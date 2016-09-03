(function ($) {
    var switchImages = function() {
        var bgimages = $("[data-slowload-bg-high]");
        $.each(bgimages, function(i, image) {
            image = $(image);

            // show the low quality image by default
            if (!image.hasClass("slowload-switched")) {
                image.css('backgroundImage', "url(" + image.attr("data-slowload-bg-low") + ")");
                setTimeout(function(){
                    image.addClass("slowload-usetransition");
                }, 500);
                image.addClass("slowload-switched");
            }

            // if the low quality one is visible, load and switch to the high quality one
            if (isElementInViewport(image, false) && !image.hasClass("slowload-loaded")) {
                image.addClass("slowload-loaded");
                var loadImage = new Image();
                var imageUrl = $(image).attr("data-slowload-bg-high");
                loadImage.onload = function() {
                    image.css('backgroundImage', "url(" + imageUrl + ")");
                };
                loadImage.src = imageUrl;
            }
        });

        var images = $("img[data-slowload-img-high]");
        $.each(images, function(i, image) {
            image = $(image);

            // show the low quality image by default
            if (!image.hasClass("slowload-switched") && !imgLoaded(image)) {
                image.attr("src", image.attr("data-slowload-img-low"));
                image.addClass("slowload-switched");
            }

            // if the low quality one is visible, load and switch to the high quality one
            if (isElementInViewport(image, true) && !image.hasClass("slowload-loaded") && !imgLoaded(image)) {
                image.addClass("slowload-loaded");
                var loadImage = new Image();
                var imageUrl = image.attr("data-slowload-img-high");
                loadImage.onload = function() {
                    // using fade because there's no good way to do this with css
                    image.fadeOut('fast', function () {
                        image.attr('src', imageUrl);
                        image.fadeIn('fast');
                    });
                };
                loadImage.src = imageUrl;
            }
        });
    };

    var switchingAllowed = true;
    switchImages();

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