(function ($, elementorFrontend, elementorModules) {
    "use strict";
    var _siwper = elementorModules.frontend.handlers.Base.extend({
        getDefaultSettings() {
            return {
                selectors: {
                    carousel    : '.swiper-container',
                    slideContent: '.swiper-slide',
                },
            };
        },
        getDefaultElements() {
            const selectors = this.getSettings('selectors');
            const elements = {
                $swiperContainer: this.$element.find(selectors.carousel),
            };
            elements.$slides = elements.$swiperContainer.find(selectors.slideContent);
            return elements;
        },
        getSwiperSettings() {
            const elementSettings        = this.getElementSettings(),
                  slidesToShow           = +elementSettings.slides_to_show || 3,
                  isSingleSlide          = 1 === slidesToShow,
                  elementorBreakpoints   = elementorFrontend.config.responsive.activeBreakpoints,
                  defaultSlidesToShowMap = {
                      mobile: 1,
                      tablet: isSingleSlide ? 1 : 2,
                  };
            const swiperOptions = {
                slidesPerView             : slidesToShow,
                loop                      : 'yes' === elementSettings.infinite,
                speed                     : elementSettings.speed,
                handleElementorBreakpoints: true,
            };
            swiperOptions.breakpoints = {};
            let lastBreakpointSlidesToShowValue = slidesToShow;
            Object.keys(elementorBreakpoints).reverse().forEach((breakpointName) => {
                // Tablet has a specific default `slides_to_show`.
                const defaultSlidesToShow = defaultSlidesToShowMap[breakpointName] ? defaultSlidesToShowMap[breakpointName] : lastBreakpointSlidesToShowValue;
                swiperOptions.breakpoints[elementorBreakpoints[breakpointName].value] = {
                    slidesPerView : +elementSettings['slides_to_show_' + breakpointName] || defaultSlidesToShow,
                    slidesPerGroup: +elementSettings['slides_to_scroll_' + breakpointName] || 1,
                };
                lastBreakpointSlidesToShowValue = +elementSettings['slides_to_show_' + breakpointName] || defaultSlidesToShow;
            });
            if ('yes' === elementSettings.autoplay) {
                swiperOptions.autoplay = {
                    delay               : elementSettings.autoplay_speed,
                    disableOnInteraction: 'yes' === elementSettings.pause_on_interaction,
                };
            }
            if (isSingleSlide) {
                swiperOptions.effect = elementSettings.effect;
                if ('fade' === elementSettings.effect) {
                    swiperOptions.fadeEffect = {crossFade: true};
                }
            } else {
                swiperOptions.slidesPerGroup = +elementSettings.slides_to_scroll || 1;
            }
            if (elementSettings.spaceBetween) {
                swiperOptions.spaceBetween = elementSettings.spaceBetween.size;
            }
            const showArrows = 'arrows' === elementSettings.navigation || 'both' === elementSettings.navigation,
                  showDots   = 'dots' === elementSettings.navigation || 'both' === elementSettings.navigation || 'custom' === elementSettings.navigation;
            if (showArrows) {
                swiperOptions.navigation = {
                    prevEl: '.elementor-swiper-button-prev',
                    nextEl: '.elementor-swiper-button-next',
                };
            }
            if (showDots) {

                swiperOptions.pagination = {
                    el       : '.swiper-pagination',
                    type     : 'bullets',
                    clickable: true,
                };
                if(this.$element.data('widget_type') === 'pakrco-modern-slider.default'){
                    if('custom' === elementSettings.navigation){
                        const pt = {};
                        this.elements.$slides.each(function (index, element) {
                            pt[index] = $(element).data('pagination');
                        });

                        swiperOptions.pagination.renderBullet = function(index, className){
                            return `<span class="swiper-pagination-bullet"><span class="inner">${pt[index]}</span></span>`;
                        }
                    }else {
                        swiperOptions.pagination.renderBullet = function(index, className){
                            let count = '';
                            if((index + 1) < 10){
                                count = '0' + (index + 1)+ '.';
                            }else{
                                count = (index + 1)+ '.';
                            }
                            return `<span class="swiper-pagination-bullet swiper-pagination-bullet-custom"><span class="count">${count}</span></span>`;
                        }
                    }
                }
            }

            if(typeof elementSettings.enable_scrollbar !== 'undefined' && elementSettings.enable_scrollbar === 'yes'){
                swiperOptions.scrollbar = {
                    el: this.$element.find('.swiper-scrollbar').get(0),
                    hide: false,
                }
                swiperOptions.loop = false;
            }

            swiperOptions.on = {
                init: () => {
                    $(document).trigger('skeletonScreen', [this.$element]);
                }
            }

            return swiperOptions;
        },
        updateSwiperOption(propertyName) {
            const elementSettings = this.getElementSettings(),
                  newSettingValue = elementSettings[propertyName],
                  params          = this.swiper.params;
            // Handle special cases where the value to update is not the value that the Swiper library accepts.
            switch (propertyName) {
                case 'image_spacing_custom':
                    params.spaceBetween = newSettingValue.size || 0;
                    break;
                case 'autoplay_speed':
                    params.autoplay.delay = newSettingValue;
                    break;
                case 'speed':
                    params.speed = newSettingValue;
                    break;
            }
            this.swiper.update();
        },
        getChangeableProperties() {
            return {
                pause_on_hover      : 'pauseOnHover',
                autoplay_speed      : 'delay',
                speed               : 'speed',
                image_spacing_custom: 'spaceBetween',
            };
        },
        onElementChange(propertyName) {
            const changeableProperties = this.getChangeableProperties();
            if (changeableProperties[propertyName]) {
                // 'pause_on_hover' is implemented by the handler with event listeners, not the Swiper library.
                if ('pause_on_hover' === propertyName) {
                    const newSettingValue = this.getElementSettings('pause_on_hover');
                    this.togglePauseOnHover('yes' === newSettingValue);
                } else {
                    this.updateSwiperOption(propertyName);
                }
            }
        },
        onEditSettingsChange(propertyName) {
            if ('activeItemIndex' === propertyName) {
                this.swiper.slideToLoop(this.getEditSettings('activeItemIndex') - 1);
            }
        },

        async bindEvents() {
            const elementSettings = this.getElementSettings();
            if (!this.elements.$swiperContainer.length || 2 > this.elements.$slides.length) {
                return;
            }
            const Swiper = elementorFrontend.utils.swiper;
            this.swiper = await new Swiper(this.elements.$swiperContainer, this.getSwiperSettings());
            // Expose the swiper instance in the frontend
            this.elements.$swiperContainer.data('swiper', this.swiper);
            if ('yes' === elementSettings.pause_on_hover) {
                this.togglePauseOnHover(true);
            }
            this.animate();
        },

        animate() {
            var slides = this.swiper.$wrapperEl.find( '.swiper-slide' );
            var currentSlide = $( slides ).filter( '.swiper-slide-active' );
            currentSlide.addClass( 'animated' );

            this.swiper.on( 'slideChangeTransitionEnd', () => {
                var slides = this.swiper.$wrapperEl.find( '.swiper-slide' );
                var visibleSlides = $( slides ).filter( '.swiper-slide-active' );
                visibleSlides.addClass( 'animated' );

                slides.removeClass( 'swiper-ken-burn-active' );
                visibleSlides.addClass( 'swiper-ken-burn-active' );
            } );

            this.swiper.on( 'slideChangeTransitionStart', () => {
                var slides = this.swiper.$wrapperEl.find( '.swiper-slide' );
                slides.removeClass( 'animated' );
            } );
        },

        togglePauseOnHover( toggleOn ) {
            if ( toggleOn ) {
                this.elements.$swiperContainer.on( {
                    mouseenter: () => {
                        this.swiper.autoplay.stop();
                    },
                    mouseleave: () => {
                        this.swiper.autoplay.start();
                    },
                } );
            } else {
                this.elements.$swiperContainer.off( 'mouseenter mouseleave' );
            }
        },
    });

    $(window).on('elementor/frontend/init', () => {
        const addHandler = ( $element ) => {
            elementorFrontend.elementsHandler.addHandler( _siwper, {
                $element,
            } );
        };

        elementorFrontend.hooks.addAction( 'frontend/element_ready/pakrco-project.default', addHandler );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pakrco-post-grid.default', addHandler );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pakrco-modern-slider.default', addHandler );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pakrco-testimonials.default', addHandler );

        elementorFrontend.hooks.addAction( 'frontend/element_ready/image-carousel.default', ($element) => {
            setTimeout(function(){
                $(document).trigger('skeletonScreen', $element);
            }, 400)
        } );

    });
})(jQuery, window.elementorFrontend, window.elementorModules);

