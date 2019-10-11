<?php
session_start();

// initializing variables
$email = "";
$name    = "";
$nickname = "";
$errors = array(); 
$postSubject = "";
$content = "";

// connect to the database
$db = mysqli_connect('localhost:3306', 'root', '', 'OnlineBulletin');





//example insert INSERT INTO `bbusers` (`email`, `name`, `password`, `nickname`) VALUES ('jim@jim.jim', 'Jim', 'jimmy', 'jimbo'); 

// Registration form inputs
if (isset($_POST['reg_user'])) {
  // receive all input values from the form
  $email = mysqli_real_escape_string($db, $_POST['email']);
  $name = mysqli_real_escape_string($db, $_POST['name']);
  $nickname = mysqli_real_escape_string($db, $_POST['nickname']);
  $password_1 = mysqli_real_escape_string($db, $_POST['password_1']);
  $password_2 = mysqli_real_escape_string($db, $_POST['password_2']);

  
  // Form validation, + by adding (array_push()) corresponding error unto $errors array
  if (empty($email)) { array_push($errors, "Email is required"); }
  if (empty($name)) { array_push($errors, "Name is required"); }
    if (empty($nickname)) { array_push($errors, "Nickname is required"); }
  if (empty($password_1)) { array_push($errors, "Password is required"); }
  if ($password_1 != $password_2) {
	array_push($errors, "The two passwords do not match");
  }

  // Check if a user already exists with same email or nickname 
  
  $user_check_query = "SELECT email, nickname FROM bbusers WHERE email='$email' OR nickname='$nickname' LIMIT 1";
  $result = mysqli_query($db, $user_check_query);
  $user = mysqli_fetch_assoc($result);
  
  if ($user) { // if user exists
    if ($user['email'] === $email) {
      array_push($errors, "Email already exists");
    }

    if ($user['nickname'] === $nickname) {
      array_push($errors, "Nickname already exists");
    }
  }

  // If no errors, add user to database
  if (count($errors) == 0) {
  	//$password = md5($password_1);//encrypt the password before saving in the database
	$password = $password_1;
  	$query = "INSERT INTO `bbusers` (`email`, `name`, `password`, `nickname`) 
	VALUES('$email', '$name', '$password', '$nickname')";
			  
			  
  	mysqli_query($db, $query);
  	$_SESSION['email'] = $email;
	
  	$_SESSION['success'] = "You are now logged in";
  	header('location: index.php');
  }
}






// LOGIN
if (isset($_POST['login_user'])) {
  $email = mysqli_real_escape_string($db, $_POST['email']);
  $password = mysqli_real_escape_string($db, $_POST['password']);

  if (empty($email)) {
  	array_push($errors, "Username is required");
  }
  if (empty($password)) {
  	array_push($errors, "Password is required");
  }

  if (count($errors) == 0) {
	
  	//$password = md5($password);
  	$query = "SELECT email, password FROM bbusers WHERE email='$email' AND password='$password'";
  	$results = mysqli_query($db, $query);
  	if (mysqli_num_rows($results) == 1) {
  	  $_SESSION['email'] = $email;
	  
  	  $_SESSION['success'] = "You are now logged in";
  	  header('location: index.php');
  	}else {
  		array_push($errors, "Wrong email/password.");
  	}
  }
}

?>