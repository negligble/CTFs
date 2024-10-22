<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>🎃 Void Whispers 🎃</title>
  <link href="https://fonts.googleapis.com/css?family=Eater" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
  <link rel="stylesheet" href="/static/css/main.css">
  <style>
    html {
      height: 100%;
      width: 100%;
      overflow: hidden;
    }

    body {
      background-color: #2F5363;
      filter: progid:DXImageTransform.Microsoft.gradient(gradientType=1, startColorstr='#FF2F5363', endColorstr='#FF1B2628');
      background-image: radial-gradient(ellipse cover at center, #2f5363 0%, #1b2628 80%);
      overflow: hidden;
    }

    /* Spider Animation */
    [class*="spider"] {
      position: absolute;
      height: 40px;
      width: 50px;
      border-radius: 50%;
      margin: 40px 0 0 0;
      background: #110D04;
    }
    
    [class*="spider"] *, [class*="spider"]:before, [class*="spider"]:after {
      position: absolute;
      content: "";
    }

    [class*="spider"]:before {
      width: 1px;
      background: #AAAAAA;
      left: 50%;
      top: -320px;
      height: 320px;
    }

    [class*="spider"] .eye {
      top: 16px;
      height: 14px;
      width: 12px;
      background: #FFFFFF;
      border-radius: 50%;
    }

    [class*="spider"] .eye:after {
      top: 6px;
      height: 5px;
      width: 5px;
      background: black;
      border-radius: 50%;
    }

    [class*="spider"] .eye.left { left: 14px; }
    [class*="spider"] .eye.left:after { right: 3px; }
    [class*="spider"] .eye.right { right: 14px; }
    [class*="spider"] .eye.right:after { left: 3px; }
    /* ... Additional Spider Animation CSS from the original code ... */

    /* Form Styling */
    .form-container {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.8);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .form-container h1 {
      font-family: 'Eater', cursive;
      font-size: 2rem;
      position: relative !important;
      color: #ff7518;
      left: 0 !important;
      text-align: center;
    }

    .form-container label {
      color: #fff;
    }

    .form-control {
      background-color: #333;
      border: 1px solid #444;
      color: #fff;
    }

    .btn-primary {
      background-color: #ff7518 !important;
      border-color: #ff7518;
      width: 100%;
    }

    .btn-primary:hover {
      background-color: #e65c00 !important;
    }

    .response-message {
      margin-top: 15px;
      display: none;
    }
  </style>
</head>

<body>

  <!-- Spiders Animation -->
 <div class='spider_0'>
  <div class='eye left'></div>
  <div class='eye right'></div>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
</div>
<div class='spider_1'>
  <div class='eye left'></div>
  <div class='eye right'></div>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
</div>
<div class='spider_2'>
  <div class='eye left'></div>
  <div class='eye right'></div>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
</div> <!-- More spiders here... -->
 <div class='spider_3'>
  <div class='eye left'></div>
  <div class='eye right'></div>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
</div>  <div class='spider_4'>
  <div class='eye left'></div>
  <div class='eye right'></div>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
</div> <div class='spider_5'>
  <div class='eye left'></div>
  <div class='eye right'></div>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
</div> <div class='spider_6'>
  <div class='eye left'></div>
  <div class='eye right'></div>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg left'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
  <span class='leg right'></span>
</div> 
  <!-- Void Whispers Form -->
  <div class="form-container">
    <h1>🎃 Void Whispers 🎃</h1>
    <div method="post" id="settingsForm">
      <div class="form-group">
        <label for="from-name">From Name 📝</label>
        <input type="text" name="from-name" class="form-control" id="from-name" value="<?php echo $config['from']; ?>" /> 
      </div>
      <div class="form-group">
        <label for="from-mail">From Email 📧</label>
        <input type="text" name="from-mail" class="form-control" id="from-mail" value="<?php echo $config['email']; ?>" /> 
      </div>
      <div class="form-group">
        <label for="mail-binary">Sendmail PATH 📜</label>
        <input type="text" name="mail-binary" class="form-control" id="mail-binary" value="<?php echo $config['sendMailPath']; ?>" />
      </div>
      <div class="form-group">
        <label for="mail-program">Mail Program 🛠️</label>
        <input type="text" name="mail-program" class="form-control" id="mail-program" value="<?php echo $config['mailProgram']; ?>" />
      </div>

      <button onclick="submitForm()" type="submit" class="btn btn-primary">💀 Save 💀</button>
    </div>

    <div id="response-message" class="alert response-message"></div>
  </div>

  <!-- Script for handling form submission -->

<script>
    const submitForm = () => {
      // Collect form data
      const formData = new URLSearchParams();
      formData.append('from', document.getElementById('from-name').value);
      formData.append('email', document.getElementById('from-mail').value);
      formData.append('sendMailPath', document.getElementById('mail-binary').value);
      formData.append('mailProgram', document.getElementById('mail-program').value);

      // Send the API request
      fetch('/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      })
      .then(response => response.json())
      .then(data => {
        const responseMessage = document.getElementById('response-message');
        responseMessage.style.display = 'block';
        responseMessage.innerText = data.message;

        if (data.status === 'success') {
          responseMessage.classList.add('alert-success');
          responseMessage.classList.remove('alert-danger');
        } else {
          responseMessage.classList.add('alert-danger');
          responseMessage.classList.remove('alert-success');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        const responseMessage = document.getElementById('response-message');
        responseMessage.style.display = 'block';
        responseMessage.innerText = 'An error occurred. Please try again.';
        responseMessage.classList.add('alert-danger');
        });
    }
</script>
</body>
</html>
