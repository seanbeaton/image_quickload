<?php

/**
 * @file
 * Views handlers for Colorbox module.
 */

/**
 * A handler to provide a field that is completely custom by the administrator.
 *
 * @ingroup views_field_handlers
 */
class image_quickload_handler_field_image_quickload extends views_handler_field {
  function query() {
    // Do nothing, as this handler does not need to do anything to the query itself.
  }

  function option_definition() {
    $options = parent::option_definition();

    $options['high_quality'] = array('default' => '');
    $options['low_quality'] = array('default' => '');
    $options['extra_class'] = array('default' => '');

    return $options;
  }

  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);

    $form['high_quality'] = array(
      '#type' => 'select',
      '#title' => t('High quality image style'),
      '#description' => t('High quality image style.'),
      '#default_value' => $this->options['high_quality'],
      '#weight' => -11,
    );

    $form['low_quality'] = array(
      '#type' => 'select',
      '#title' => t('Low quality image style'),
      '#description' => t('Low quality image style.'),
      '#default_value' => $this->options['low_quality'],
      '#weight' => -10,
    );

    $form['extra_class'] = array(
      '#type' => 'textfield',
      '#title' => t('Caption'),
      '#description' => t('The Colorbox Caption. You may include HTML. You may enter data from this view as per the "Replacement patterns" below.'),
      '#default_value' => $this->options['low_quality'],
      '#weight' => -9,
    );
  }

  /**
   * Render the trigger field and its linked popup information.
   */
  function render($values) {
    drupal_add_library("image_quickload", "image_quickload");
    ddl($values, 'values');
    // Get image styles needed.

//    $image['path'] = file_create_url($image['uri']);
//    $image_quickload_width = $image['width'];
//    $image_quickload_height = $image['height'];
//    $image_quickload_ar = $image_quickload_height / $image_quickload_width;
//    $full_quality = $image['path'];
    $low_quality = image_style_url($this->options['low_quality'], $image_path);
//    $image_quickload_markup = <<<EOT
//    <div class="image_quickload-image-container image_quickload-image-container--expand image_quickload-image-container--front-page-slider" data-image_quickload-full-quality="$full_quality" data-image_quickload-low-quality="$low_quality" data-image_quickload-height="$image_quickload_height" data-image_quickload-width="$image_quickload_width" data-image_quickload-aspect-ratio="$image_quickload_ar">
//      <div class="image_quickload-image-filler"></div>
//      <div class="inner-image-container">
//        <div class="image_quickload-transition-canvas" style="background-image: url($low_quality)">
//        </div>
//      </div>
//    </div>
//EOT;
//
    $image_quickload_markup = "RENDER IN THE VIEW";

    return $image_quickload_markup;
  }
}
