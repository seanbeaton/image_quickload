<?php

/**
 * @file
 * Slowload theme functions.
 */

/**
 * Returns HTML for an Slowload image.
 *
 * @param array $variables
 *   An associative array containing:
 *   - item: An array of image data.
 *   - display_settings: An array containing the low and high quality styles.
 *
 * @return string
 *   An HTML string representing the themed output.
 *
 * @ingroup themeable
 */
function theme_slowload_image_formatter($variables) {
  drupal_add_css(drupal_get_path("module", "slowload") . "/libraries/slowload/css/slowload.css", array('group' => CSS_THEME, 'every_page' => FALSE));
  drupal_add_js(drupal_get_path("module", "slowload") . "/libraries/slowload/js/slowload.js");
  $item = $variables['item'];
  $settings = $variables['display_settings'];

  $high_quality_style = $settings['slowload_high_quality'];
  $low_quality_style = $settings['slowload_low_quality'];

  $height = $item['height'];
  $width = $item['width'];

  $dims = array('height' => $height, 'width' => $width);
  image_style_transform_dimensions($high_quality_style, $dims);

  $slowload_width = $dims['width'];
  $slowload_height = $dims['height'];

  $slowload_ar = $slowload_height / $slowload_width;
  $full_quality = image_style_url($high_quality_style, $item['uri']);
  $low_quality = image_style_url($low_quality_style, $item['uri']);

  $slowload_markup = <<<EOT
  <div class="slowload-image-container slowload-image-container--expand" data-slowload-full-quality="$full_quality" data-slowload-low-quality="$low_quality" data-slowload-height="$slowload_height" data-slowload-width="$slowload_width" data-slowload-aspect-ratio="$slowload_ar">
    <div class="slowload-image-filler"></div>
    <div class="inner-image-container">
      <div class="slowload-transition-canvas" style="background-image: url($low_quality)">
      </div>
    </div>
  </div>
EOT;
  
  return $slowload_markup;
}
