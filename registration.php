
<?php include('server.php') ?>
<!DOCTYPE html>
<html>
<head>
  <title>Registration system PHP and MySQL</title>
  <link rel="stylesheet" type="text/css" href="stylesheets/log.css">
</head>
<body>
  <div class="header">
  	<h2>Register</h2>
  </div>

  <form method="post" action="registration.php">
  	<?php include('errors.php'); ?>

  	<div class="input-group">
  	  <label>Email</label>
  	  <input type="email" name="email" value="<?php echo $email; ?>">
  	</div>
	<div class="input-group">
  	  <label>Name</label>
  	  <input type="text" name="name" value="<?php echo $name; ?>">
  	</div>
	<div class="input-group">
  	  <label>Nickname</label>
  	  <input type="text" name="nickname" value="<?php echo $nickname; ?>">
  	</div>
  	<div class="input-group">
  	  <label>Password</label>
  	  <input type="password" name="password_1">
  	</div>
  	<div class="input-group">
  	  <label>Confirm password</label>
  	  <input type="password" name="password_2">
  	</div>
  	<div class="input-group">
  	  <button type="submit" class="btn" name="reg_user">Register</button>
  	</div>

  	<p>
  		Already registered? <a href="login2.php">Sign in</a>
  	</p>
  </form>
</body>
</html>
