(function ($) {
    $('.inner-image-container').addClass('inner-image-container-hasJs');

    $('.slowload-image-container').each(function() {
        var $this = $(this);
        var imageHeight = $this.attr("data-slowload-height");
        var imageWidth = $this.attr("data-slowload-width");
        var aspectRatio = $this.attr("data-slowload-aspect-ratio");

        $this.find('.slowload-image-filler').css({
            'padding-bottom': (aspectRatio * 100) + "%"
        });

        $this.css({
            'max-width': imageWidth + 'px',
            'max-height': imageHeight + 'px'
        });
    });

    var switchImages = function(switch_type) {
        if (typeof switch_type === "undefined") { switch_type = "default" }
        var switch_class;
        if (switch_type === "auto") {
            switch_class = ".slowload-image-container--auto"
        } else {
            switch_class = ".slowload-image-container:not(.slowload-image-container--auto)"
        }
        $(switch_class).each(function() {
            var $this = $(this);
            var fullQuality = $this.attr("data-slowload-full-quality");
            if (!$this.hasClass("slowload-loaded") && isElementInViewport($this, true)) {
                $this.addClass("slowload-loaded");
                var image = new Image();
                console.log("loading image!", fullQuality);
                image.onload = function() {
                    $this.find('.slowload-transition-canvas').css({
                        'background-image': 'url(' + fullQuality + ')'
                    })
                };
                image.src = fullQuality;
            }

        })
    };

    switchImages();

    var switchingAllowed = true;
    window.onscroll = function() {
        if (switchingAllowed) {
            switchingAllowed = false;
            setTimeout(function() { switchingAllowed = true; switchImages(); }, 100);
            switchImages();
        }
    };

    setInterval(function() {
        switchImages("auto");
    }, 500);

    function isElementInViewport(el, strict) {
        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }
        var rect = el.getBoundingClientRect();
        return (
            (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.bottom >= 0
            )
            &&
            (
                (
                    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
                    rect.right >= 0
                )
                ||
                (!strict)
            )
        );
    }

})(jQuery);
