<?php
class IndexController
{
  private $configFile = 'config.json'; 
  private $config;

  public function __construct() {
    if (file_exists($this->configFile)) {
      $this->config = json_decode(file_get_contents($this->configFile), true);
    } else {
      $this->config = array(
        'from' => 'Ghostly Support', 
        'email' => 'support@void-whispers.htb',
        'sendMailPath' => '/usr/sbin/sendmail',
        'mailProgram' => 'sendmail',
      );
    }
  }

  public function index($router)
  {
    $router->view('index', ['config' => $this->config]);
  }

  public function updateSetting($router)
  {
    $from = $_POST['from'];
    $mailProgram = $_POST['mailProgram'];
    $sendMailPath = $_POST['sendMailPath'];
    $email = $_POST['email'];

    if (empty($from) || empty($mailProgram) || empty($sendMailPath) || empty($email)) {
      return $router->jsonify(['message' => 'All fields required!', 'status' => 'danger'], 400);
    }

    if (preg_match('/\s/', $sendMailPath)) {
      return $router->jsonify(['message' => 'Sendmail path should not contain spaces!', 'status' => 'danger'], 400);
    }

    $whichOutput = shell_exec("which $sendMailPath");
    if (empty($whichOutput)) {
      return $router->jsonify(['message' => 'Binary does not exist!', 'status' => 'danger'], 400);
    }

    $this->config['from'] = $from;
    $this->config['mailProgram'] = $mailProgram;
    $this->config['sendMailPath'] = $sendMailPath;
    $this->config['email'] = $email;

    file_put_contents($this->configFile, json_encode($this->config));

    return $router->jsonify(['message' => 'Config updated successfully!', 'status' => 'success'], 200);
  }
}
