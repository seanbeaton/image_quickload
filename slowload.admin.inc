<?php

/**
 * @file
 * Administrative page callbacks for the slowload module.
 */

/**
 * General configuration form for controlling the colorbox behaviour.
 */
function slowload_admin_settings() {

  $form['tbd'] = array(
    '#type' => 'text',
    '#title' => t('TBD'),
    '#markup' => "TBD",
  );

  return system_settings_form($form);
}
