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

    var switchImages = function() {
        $('.slowload-image-container').each(function(){
            var $this = $(this);
            var imageHeight = $this.attr("data-slowload-height");
            var imageWidth = $this.attr("data-slowload-width");
            var aspectRatio = $this.attr("data-slowload-aspect-ratio");
            var fullQuality = $this.attr("data-slowload-full-quality");

            if (isElementInViewport($this, true) && !$this.hasClass("slowload-loaded")) {
                $this.addClass("slowload-loaded");
                var image = new Image();
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

    function imgLoaded(imgElement) {
        return imgElement.complete && imgElement.naturalHeight != 0;
    }

})(jQuery);
