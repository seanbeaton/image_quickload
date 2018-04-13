(function ($) {

  var image_quickload = 'image_quickload';
  var defaults = {

  };

  function isElementInViewport(el, load_offset, check_visibility) {
    //special bonus for those using jQuery
    if (typeof $ === "function" && el instanceof $) {
      el = el[0];
    }
    if (isHidden(el) && check_visibility) {
      return false
    }
    var rect = el.getBoundingClientRect();

    return (
      (
        rect.top - load_offset <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom + load_offset >= 0
      )
      &&
      (
        (
          rect.left - load_offset <= (window.innerWidth || document.documentElement.clientWidth) &&
          rect.right + load_offset >= 0
        )
      )
    );
  }
  function isHidden(el) {
    return (el.offsetParent === null)
  }

  publicMethod = $.fn[image_quickload] = $[image_quickload] = function(options) {
    var settings;

    $('.inner-image-container').addClass('inner-image-container-hasJs');

    $('.image-quickload-image-container').each(function() {
      var $this = $(this);
      var imageHeight = $this.attr("data-image-quickload-height");
      var imageWidth = $this.attr("data-image-quickload-width");
      var aspectRatio = $this.attr("data-image-quickload-aspect-ratio");

      $this.find('.image-quickload-image-filler').css({
        'padding-bottom': (aspectRatio * 100) + "%"
      });

      $this.css({
        'max-width': imageWidth + 'px',
        'max-height': imageHeight + 'px'
      });
    });

    publicMethod.switchImages();

    var switchingAllowed = true;
    window.onscroll = function() {
      if (switchingAllowed) {
        switchingAllowed = false;
        setTimeout(function() { switchingAllowed = true; publicMethod.switchImages(); }, 100);
        publicMethod.switchImages();
      }
    };

    window.resize = function() {
      if (switchingAllowed) {
        switchingAllowed = false;
        setTimeout(function() { switchingAllowed = true; publicMethod.switchImages(); }, 100);
        publicMethod.switchImages();
      }
    };

    $(window).on('quickloadCheckImages', function() {
      publicMethod.switchImages();
    });

    setInterval(function() {
      publicMethod.switchImages("auto");
    }, 500);
  };

  publicMethod.switchImages = function(switchType) {
    if (typeof switchType === "undefined") { switchType = "default" }
    var switchClass;
    if (switchType === "auto") {
      switchClass = ".image-quickload-image-container--auto"
    } else {
      switchClass = ".image-quickload-image-container:not(.image-quickload-image-container--auto)"
    }
    $(switchClass).each(function() {
      var $this = $(this);
      var offset = 0;
      var checkVis = !$this.hasClass('image-quickload--skip-visibility-check');
      if ($this.hasClass('image-quickload--use-offset')) {
        offset = $this.attr("data-image-quickload-load-offset");
      }
      var fullQuality = $this.attr("data-image-quickload-full-quality");
      if (!$this.hasClass("image-quickload-loaded") && isElementInViewport($this, offset, checkVis)) {
        $this.addClass("image-quickload-loaded");
        var image = new Image();
        image.onload = function() {
          $this.find('.image-quickload-transition-canvas').css({
            'background-image': 'url(' + fullQuality + ')'
          })
        };
        image.src = fullQuality;
      }

    })
  };

  publicMethod.settings = defaults;

})(jQuery, document, window);
