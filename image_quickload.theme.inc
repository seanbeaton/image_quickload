<?php

/**
 * @file
 * image_quickload theme functions.
 */

/**
 * Returns HTML for an image_quickload image field formatter.
 *
 * @param array $variables
 *   An associative array containing:
 *   - item: An array of image data.
 *   - display_settings: An array containing the image_quickload options.
 *
 * @return string
 *   An HTML string representing the themed output.
 *
 * @ingroup themeable
 */
function theme_image_quickload_image_formatter(array $variables) {
  drupal_add_css(drupal_get_path('module', 'image_quickload') . '/libraries/image_quickload/css/image_quickload.css', array('group' => CSS_THEME, 'every_page' => FALSE));
  drupal_add_js(drupal_get_path('module', 'image_quickload') . '/libraries/image_quickload/js/image_quickload.js');
  $item = $variables['item'];
  $settings = $variables['display_settings'];

  $high_quality_style = $settings['image_quickload_high_quality'];
  $low_quality_style = $settings['image_quickload_low_quality'];

  $height = $item['height'];
  $width = $item['width'];

  $dims = array('height' => $height, 'width' => $width);
  if ($high_quality_style) {
    image_style_transform_dimensions($high_quality_style, $dims);
  }

  $image_quickload_width = $dims['width'];
  $image_quickload_height = $dims['height'];

  if ($image_quickload_width == 0) {
    // If we don't have a width for some reason, use 0.75 as a default.
    $image_quickload_ar = 0.75;
  }
  else {
    $image_quickload_ar = $image_quickload_height / $image_quickload_width;
  }

  $full_quality = image_style_url($high_quality_style, $item['uri']);
  $low_quality = image_style_url($low_quality_style, $item['uri']);

  $extra_image_container_classes = '';
  if ($settings['image_quickload_auto_swap']) {
    $extra_image_container_classes .= ' image_quickload-image-container--auto';
  }

  $image_quickload_markup = <<<EOT
  <div class="image-quickload-image-container image-quickload-image-container--expand $extra_image_container_classes" data-image-quickload-full-quality="$full_quality" data-image-quickload-low-quality="$low_quality" data-image-quickload-height="$image_quickload_height" data-image-quickload-width="$image_quickload_width" data-image-quickload-aspect-ratio="$image_quickload_ar">
    <div class="image-quickload-image-filler"></div>
    <div class="inner-image-container">
      <div class="image-quickload-transition-canvas" style="background-image: url($low_quality)">
      </div>
    </div>
  </div>
EOT;
  return $image_quickload_markup;
}
