<?php

namespace Drupal\slowload\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormState;
use Drupal\Core\Form\FormStateInterface;
use Drupal\image\Entity\ImageStyle;
use Drupal\Component\Utility\NestedArray;

/**
 * Class ConfigForm.
 *
 * @package Drupal\slowload\Form
 */
class ConfigForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'slowload.Config',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'config_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $available_styles_values = array_keys(ImageStyle::loadMultiple());
    $available_styles = array_combine($available_styles_values, $available_styles_values);
    $form['#tree'] = TRUE;

    $form['#attached']['library'][] = 'slowload/drupal.slowload.admin';
    $values = &$form_state->getValues();
    $storage = &$form_state->getStorage();

    $config = $this->config('slowload.Config')->get('options_fieldset');
    $levels = $this->config('slowload.Config')->get('levels');

    if ($form_state->hasTemporaryValue('options')) {
      $last_options = $form_state->getTemporaryValue('options');
    }

    if (!isset($storage['slowload']) ) {
      if (isset($levels)) {
        $storage['slowload']['num_options'] = $levels;
      } else {
        $storage['slowload']['num_options'] = 1;
      }
    }

    $form_state->setStorage($storage);

    $num_options = &$storage['slowload']['num_options'];

    $form['options_fieldset'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Styles pairs'),
      '#prefix' => '<div id="all-styles-wrapper">',
      '#suffix' => '</div>',
    ];

    for ($i = 0; $i < $num_options; $i++) {

      $form['options_fieldset'][$i] = array(
        '#type' => 'fieldset',
        '#title' => "Image style set " . ($i + 1),
        '#prefix' => '<div class="options-pair two-col">',
        '#suffix' => '</div>'
      );
      $full_key_placeholder = 'placeholder';
      $full_item_value = 'placeholder';
      $preload_key_placeholder = 'placeholder';
      $preload_item_value = 'placeholder';

      if (isset($last_options[$i]['full'])) {
        $full_key_placeholder = 'value';
        $full_item_value = $last_options[$i]['full'];
//        error_log("level $i set full to " . $last_options[$i]['full']);
//        $message = "level $i set full to " . $last_options[$i]['full'];
      }

      if (isset($last_options[$i]['preload'])) {
        $preload_key_placeholder = 'value';
        $preload_item_value = $last_options[$i]['preload'];
//        error_log($message . ", set preload to " . $last_options[$i]['preload']);
      }

      $form['options_fieldset'][$i]['full'] = array(
        '#type' => 'select',
        '#options' => $available_styles,
        '#title' => 'Full size',
        '#default_value' =>  (isset($config[$i]['full']) ? $config[$i]['full'] : ""),
        "#$full_key_placeholder" => $full_item_value,
//        '#ajax' => $image_style_ajax,
      );

      $form['options_fieldset'][$i]['preload'] = array(
        '#type' => 'select',
        '#options' => $available_styles,
        '#title' => 'Preload version',
        '#default_value' =>  (isset($config[$i]['preload']) ? $config[$i]['preload'] : ""),
        "#$preload_key_placeholder" => $preload_item_value,
//        '#ajax' => $image_style_ajax,
      );

      if ($num_options > 1) {
        $item = $i + 1;
        $form['options_fieldset'][$i]["remove_field_$i"] = array(
          '#type' => 'submit',
          '#value' => t("Remove style pair $item"), // if you don't make the value unique, getTriggeringElement will always take the last one with that name.
          '#limitValidationErrors' => array(),
          '#remove_level' => $i,
          '#submit' => array('::slowload_add_more_remove_specific'),
          '#validate' => array(),
          '#ajax' => array(
            'callback' => "::slowload_add_more_callback",
            'wrapper' => 'all-styles-wrapper',
          ),
        );
      }
    }

    $form['options_fieldset']['more_fields'] = array(
      '#type' => 'submit',
      '#value' => t('Add another pair'),
      '#limitValidationErrors' => array(),
      '#submit' => array('::slowload_add_more_add_one'),
      '#validate' => array(),
      '#ajax' => array(
        'callback' => "::slowload_add_more_callback",
        'wrapper' => 'all-styles-wrapper',
      ),
    );

//    if ($num_options > 1) {
//      $form['options_fieldset']['less_fields'] = array(
//        '#type' => 'submit',
//        '#value' => t('Remove a pair'),
//        '#limitValidationErrors' => array(),
//        '#submit' => array(array($this, 'slowload_add_more_remove_one')),
//        '#validate' => array(),
//        '#ajax' => array(
//          'callback' => "::slowload_add_more_callback",
//          'wrapper' => 'all-styles-wrapper',
//        ),
//      );
//    }

    $form['actions'] = array('#type' => 'actions');

    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Submit'),
      '#submit' => array($this, 'CustomSubmit'),
    );

    return parent::buildForm($form, $form_state);
  }

  /**
   * @param array $form
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   */
  public function CustomSubmit(array &$form, FormStateInterface $form_state) {
    drupal_set_message("Custom Submit triggered");
  }

  /**
   * @param array $form
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   * @return mixed
   */
  public function slowload_add_more_callback(array &$form, FormStateInterface $form_state) {
    return $form['options_fieldset'];
  }

  /**
   * @param array $form
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   */
  public function slowload_add_more_add_one(array &$form, FormStateInterface $form_state) {
    $storage = &$form_state->getStorage();
    $storage['slowload']['num_options']++;

    $form_state->setStorage($storage);

    $form_state->setRebuild();
  }

  /**
   * @param array $form
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   */
  public function slowload_add_more_remove_one(array &$form, FormStateInterface $form_state) {
    $storage = &$form_state->getStorage();
    if ($storage['slowload']['num_options'] > 1) {
      $storage['slowload']['num_options']--;
    }
    $form_state->setStorage($storage);

    $form_state->setRebuild();
  }

  /**
   * @param array $form
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   */
  public function slowload_add_more_remove_specific(array &$form, FormStateInterface $form_state) {
    $button = $form_state->getTriggeringElement();
    $all_values = $form_state->getValues();
    $values = &$all_values['options_fieldset'];
    $storage = &$form_state->getStorage();
    $num_options = $storage['slowload']['num_options'];

    if ($button['#remove_level'] !== null && $num_options > 1) {

      // remove fields on the correct level
      unset($values[$button['#remove_level']]);

      // shift other values
      if ($button['#remove_level'] < ($num_options - 1)) {
        for ($i = $button['#remove_level']; $i < ($num_options - 1); $i++) {
          $values[$i] = $values[($i + 1)];
          unset($values[($i + 1)]);
        }
        uksort($values, 'strnatcasecmp');
      }

      $form_state->setTemporaryValue('options', $values);
      $form_state->setValues($all_values);

      $storage['slowload']['num_options']--;

      $form_state->setStorage($storage);

      $form_state->setRebuild();

    }
  }

  /**
   * @param $image_style_input
   * @return bool
   */
  public function slowload_validate_image_style($image_style_input) {
    $styles = ImageStyle::loadMultiple();
    return array_key_exists($image_style_input, $styles);
  }

  /**
   * @param array $form
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   * @return bool
   */
  public function slowload_validation(array &$form, FormStateInterface $form_state) {
    $storage = &$form_state->getStorage();
    $levels = $storage['slowload']['num_options'];
    $pass = TRUE;

    for ($i = 0; $i < $levels; $i++) {
      $full_item = $form_state->getValue(['options_fieldset', $i, 'full']);
      $preload_item = $form_state->getValue(['options_fieldset', $i, 'preload']);

      if (!$this->slowload_validate_image_style($full_item) && !$full_item == '') {
        $form_state->setErrorByName("options_fieldset][$i][full", $this->t('This is not an image style.'));
        $pass = FALSE;
      }

      if (!$this->slowload_validate_image_style($preload_item) && !$preload_item == '') {
        $form_state->setErrorByName("options_fieldset][$i][preload", $this->t('This is not an image style.'));
        $pass = FALSE;
      }
    }
    return $pass;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    return $this->slowload_validation($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $this->config('slowload.Config')
      ->set('options_fieldset', $form_state->getValue('options_fieldset'))
      ->set('levels', $form_state->getStorage()['slowload']['num_options'])
      ->save();
  }

}
