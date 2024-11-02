(function ($) {
    "use strict";
    $(window).on('elementor/frontend/init', () => {
        elementorFrontend.hooks.addAction('frontend/element_ready/pakrco-side-template.default', ($scope) => {

            let $button_side = $scope.find('.site-header-button .button-content');
            let $button_close = $('.button-side-overlay, .button-side-heading .close-button-side');

            $button_close.on('click', function (e) {
                e.preventDefault();
                var $button_active = $(this).data('target');
                $($button_active).removeClass('active');
            });

            // Setup
            $button_side.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $button_active = $(this).data('target');
                $($button_active).toggleClass('active');
            });
        });
    });

})(jQuery);


