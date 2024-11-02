(function($){
    if ( ! ( window.Waypoint ) ) {
        // if Waypoint is not available, then we MUST remove our class from all elements because otherwise BGs will never show
        $('.elementor-section.lazyelementorbackgroundimages,.elementor-column-wrap.lazyelementorbackgroundimages').removeClass('lazyelementorbackgroundimages');
        if ( window.console && console.warn ) {
            console.warn( 'Waypoint library is not loaded so backgrounds lazy loading is turned OFF' );
        }
        return;
    }
    $('.lazyelementorbackgroundimages').each( function () {
        var $section = $( this );
        new Waypoint({
            element: $section.get( 0 ),
            handler: function( direction ) {
                //console.log( [ 'waypoint hit', $section.get( 0 ), $(window).scrollTop(), $section.offset() ] );
                $section.removeClass('lazyelementorbackgroundimages');
            },
            offset: $(window).height()*1.5 // when item is within 1.5x the viewport size, start loading it
        });
    } );
})(jQuery)
