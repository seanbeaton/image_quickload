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
class slowload_handler_field_slowload extends views_handler_field {
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
    drupal_add_library("slowload", "slowload");
    ddl($values, 'values');
    // Get image styles needed.

//    $image['path'] = file_create_url($image['uri']);
//    $slowload_width = $image['width'];
//    $slowload_height = $image['height'];
//    $slowload_ar = $slowload_height / $slowload_width;
//    $full_quality = $image['path'];
    $low_quality = image_style_url($this->options['low_quality'], $image_path);
//    $slowload_markup = <<<EOT
//    <div class="slowload-image-container slowload-image-container--expand slowload-image-container--front-page-slider" data-slowload-full-quality="$full_quality" data-slowload-low-quality="$low_quality" data-slowload-height="$slowload_height" data-slowload-width="$slowload_width" data-slowload-aspect-ratio="$slowload_ar">
//      <div class="slowload-image-filler"></div>
//      <div class="inner-image-container">
//        <div class="slowload-transition-canvas" style="background-image: url($low_quality)">
//        </div>
//      </div>
//    </div>
//EOT;
//
    $slowload_markup = "RENDER IN THE VIEW";

    return $slowload_markup;
  }
}
