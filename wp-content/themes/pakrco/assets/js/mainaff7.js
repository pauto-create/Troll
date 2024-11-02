(function($){
    'use strict';

    function cursorCustom(){
        if($('body').hasClass('custom-cursor')){
            var cursor = {
                delay: 2,
                _x: 0,
                _y: 0,
                endX: (window.innerWidth / 2),
                endY: (window.innerHeight / 2),
                cursorVisible: true,
                cursorEnlarged: false,
                $dot: document.querySelector('.cursor-dot'),
                $outline: document.querySelector('.cursor-dot-outline'),
                lastScrolledLeft: 0,
                lastScrolledTop: 0,

                init: function() {
                    // Set up element sizes
                    this.dotSize = this.$dot.offsetWidth;
                    this.outlineSize = this.$outline.offsetWidth;

                    this.setupEventListeners();
                    this.animateDotOutline();
                },

                updateCursor: function(e) {
                    var self = this;

                    console.log(e)

                    // Show the cursor
                    self.cursorVisible = true;
                    self.toggleCursorVisibility();

                    // Position the dot
                    self.endX = e.pageX;
                    self.endY = e.pageY;
                    self.$dot.style.top = self.endY + 'px';
                    self.$dot.style.left = self.endX + 'px';
                },

                setupEventListeners: function() {
                    var self = this;

                    // Anchor hovering
                    document.querySelectorAll('a').forEach(function(el) {
                        el.addEventListener('mouseover', function() {
                            self.cursorEnlarged = true;
                            self.toggleCursorSize();
                        });
                        el.addEventListener('mouseout', function() {
                            self.cursorEnlarged = false;
                            self.toggleCursorSize();
                        });
                    });

                    // Click events
                    document.addEventListener('mousedown', function() {
                        self.cursorEnlarged = true;
                        self.toggleCursorSize();
                    });
                    document.addEventListener('mouseup', function() {
                        self.cursorEnlarged = false;
                        self.toggleCursorSize();
                    });


                    document.addEventListener('mousemove', function(e) {
                        // Show the cursor
                        self.cursorVisible = true;
                        self.toggleCursorVisibility();

                        // Position the dot
                        self.endX = e.pageX;
                        self.endY = e.pageY;
                        self.$dot.style.top = self.endY + 'px';
                        self.$dot.style.left = self.endX + 'px';
                    });

                    $(window).scroll(function(event) {
                        if(self.lastScrolledLeft != $(document).scrollLeft()){
                            self.endX -= self.lastScrolledLeft;
                            self.lastScrolledLeft = $(document).scrollLeft();
                            self.endX += self.lastScrolledLeft;
                        }
                        if(self.lastScrolledTop != $(document).scrollTop()){
                            self.endY -= self.lastScrolledTop;
                            self.lastScrolledTop = $(document).scrollTop();
                            self.endY += self.lastScrolledTop;
                        }
                        self.$dot.style.top = self.endY + 'px';
                        self.$dot.style.left = self.endX + 'px';
                    });

                    // Hide/show cursor
                    document.addEventListener('mouseenter', function(e) {
                        self.cursorVisible = true;
                        self.toggleCursorVisibility();
                        self.$dot.style.opacity = 1;
                        self.$outline.style.opacity = 0.4;
                    });

                    document.addEventListener('mouseleave', function(e) {
                        self.cursorVisible = true;
                        self.toggleCursorVisibility();
                        self.$dot.style.opacity = 0;
                        self.$outline.style.opacity = 0;
                    });
                },

                animateDotOutline: function() {
                    var self = this;

                    self._x += (self.endX - self._x) / self.delay;
                    self._y += (self.endY - self._y) / self.delay;
                    self.$outline.style.top = self._y + 'px';
                    self.$outline.style.left = self._x + 'px';

                    requestAnimationFrame(this.animateDotOutline.bind(self));
                },

                toggleCursorSize: function() {
                    var self = this;

                    if (self.cursorEnlarged) {
                        self.$dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
                        self.$outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    } else {
                        self.$dot.style.transform = 'translate(-50%, -50%) scale(1)';
                        self.$outline.style.transform = 'translate(-50%, -50%) scale(1)';
                    }
                },

                toggleCursorVisibility: function() {
                    var self = this;

                    if (self.cursorVisible) {
                        self.$dot.style.opacity = 1;
                        self.$outline.style.opacity = 0.4;
                    } else {
                        self.$dot.style.opacity = 0;
                        self.$outline.style.opacity = 0;
                    }
                }
            }
            cursor.init();
        }
    }

    function handleWindow() {
        var body = document.querySelector('body');

        if (window.innerWidth > body.clientWidth + 5) {
            body.classList.add('has-scrollbar');
            body.setAttribute('style', '--scroll-bar: ' + (window.innerWidth - body.clientWidth) + 'px');
        } else {
            body.classList.remove('has-scrollbar');
        }
    }

    function navigation() {
        var $button = $('.site-navigation .menu-toggle'),
            $menu = $('.site-navigation');
        $button.on('click', function () {
           $menu.toggleClass('toggled');
        });

        if ($menu.length > 0) {
            $menu.find('.menu-item-has-children > a, .page_item_has_children > a').each((index, element) => {
                var $dropdown = $('<button class="dropdown-toggle"></button>');
                $dropdown.insertAfter(element);

            });
            $(document).on('click', '.site-navigation .dropdown-toggle', function (e) {
                e.preventDefault();
                $(e.target).toggleClass('toggled-on');
                $(e.target).siblings('ul').stop().toggleClass('show');
            });
        }

    }

    function minHeight() {
        var bodyHeight = $(window).outerHeight(),
            headerHeight = $('header.site-header').outerHeight(true),
            footerHeight = $('footer.site-footer').outerHeight(true),
            siteMain = $('.site-main').outerHeight(true);

        if(bodyHeight > (headerHeight + footerHeight + siteMain )){

            $('.site-main').css({
                'min-height': bodyHeight - headerHeight - footerHeight
            });
        }
    }

    function search_popup() {
        var $button_search = $('.button-search-popup');
        var $drop_down = $('.site-search-popup-wrap');
        $button_search.on('click', function (e) {
            e.preventDefault();
            $('html').toggleClass('search-popup-active');
        });

        $('.site-search-popup-close').on('click', function (e) {
            e.preventDefault();
            $('html').removeClass('search-popup-active');
        });

        $(document).mouseup(function (e) {
            if (!$drop_down.is(e.target) && $drop_down.has(e.target).length == 0) {
                $('html').removeClass('search-popup-active');
            }
        });
    }

    function side_collapse() {
        $('body').on('click', '[data-toggle="button-side"]', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $target = $(this).data('target');
            $($target).toggleClass('active');

        }).on('click', '.side-overlay', function (e) {
            e.preventDefault();
            var $target = $(this).siblings('.side-wrap');
            $target.removeClass('active');
        }).on('click', '.close-side', function (e) {
            e.preventDefault();
            var $target = $(this).closest('.side-wrap');
            $target.removeClass('active');
        });
    }

    function backToTop(){
        $(window).scroll(function () {
            if (jQuery(this).scrollTop() > 200) {
                jQuery('.scrollup').fadeIn().addClass('active');
            } else {
                jQuery('.scrollup').fadeOut().removeClass('active');
            }
        });

        $('.scrollup').on('click', function () {
            jQuery("html, body").animate({ scrollTop: 0 }, 600);
            return false;
        });
    }

    function setPositionLvN($item) {
        var sub = $item.children('.sub-menu'),
            offset = $item.offset(),
            width = $item.outerWidth(),
            screen_width = $(window).width(),
            sub_width = sub.outerWidth();
        var align_delta = offset.left + width + sub_width - screen_width;
        if (align_delta > 0) {
            if ($item.parents('.menu-item-has-children').length) {
                sub.css({ left: 'auto', right: '100%' });
            }else {
                sub.css({ left: 'auto', right: '0' });
            }
        } else {
            sub.css({ left: '', right: '' });
        }
    }

    function initSubmenuHover() {
        $('.site-header .primary-navigation .menu-item-has-children').hover(function (event) {
            var $item = $(event.currentTarget);
            setPositionLvN($item);
        });
    }

    $(document).on('skeletonScreen', function (event, selector) {
        var $skel_bodies = '',
            skel_cnt = $skel_bodies.length;
        if (typeof selector !== 'undefined') {
            $skel_bodies = $('.skeleton-body')
        }else{
            $skel_bodies = $('.skeleton-body', selector);
        }

        $skel_bodies.each(
            function (e) {
                var $this = $(this);
                var dclPromise = (function () {
                    var deferred = $.Deferred();
                    if (typeof imagesLoaded === 'function') {
                        var $content = $this.find('script[type="text/template"]');
                        var cnt = $content.length;
                        $content.each(
                            function () {
                                $(JSON.parse($(this).html())).imagesLoaded(
                                    function () {
                                        if (0 == --cnt) {
                                            deferred.resolve();
                                        }
                                    }
                                );
                            }
                        )
                    }
                    return deferred.promise();
                })();
                $.when(dclPromise).done(
                    function (e) {
                        var $content = $this.find('script[type="text/template"]');
                        $content.map(
                            function () {
                                var $parent = $(this).parent().parent();
                                $parent.children().remove();
                                $parent.append($(JSON.parse($(this).html())));
                            }
                        );
                        $this.removeClass('skeleton-body');
                        --skel_cnt || $(document).trigger('pakrco_skeleton_loaded', $this);
                    }
                );
            }
        );
    }).ready(function () {
        $(document).trigger('skeletonScreen');
    })

    cursorCustom();
    initSubmenuHover();
    search_popup();
    side_collapse();
    minHeight();
    handleWindow();
    navigation();
    backToTop();
})(jQuery);
