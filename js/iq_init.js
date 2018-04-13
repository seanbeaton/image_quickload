(function ($) {
  Drupal.behaviors.image_quickload_init = {
    attach: function (context, settings) {
      var init_quickload = function() {
        if (typeof $.image_quickload !== 'undefined') {
          $.image_quickload()
        } else {
          setTimeout(init_quickload, 50);
        }
      };
      init_quickload()
    }
  };
})(jQuery);

