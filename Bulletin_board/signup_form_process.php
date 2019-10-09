<html>
  <head>
    <title>Sign Up | Bulletin Board</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="mycss\css\bootstrap.min.css">
  </head>
  <body style="background-color:powderblue;">

    <?php
        #database information
        $dbuser = "root";
        $dbpassword = "";
        $host = "localhost";
        $database = "bulletin_board";

        #preinitialized data
        $email = $user = $password = $nickname = " ";
        if($_SERVER["REQUEST_METHOD"] == "POST"){
          $email = $_POST["email"];
          $user = $_POST["username"];
          $password = $_POST["password"];
          $nickname = $_POST["nickname"];
        }
    ?>

    <!--Header Sign up-->
    <div class = "col-sm-5">
    <h1> Sign Up </h1>
    </div>
    <!--Form page to sign up-->
    <form method="post" action="<?php echo $_SERVER["PHP_SELF"]; ?>">
    <div class = "form-group ">
    <div class = "col-sm-5">        
        <input type = "text" name = "email" value = "" placeholder = "Email"/> <br/>
    </div>
    </div>
    <div class = "form-group ">
    <div class = "col-sm-5">        
        <input type = "text" name = "username" value = "" placeholder = "Username"/> <br/>
    </div>
    </div>
    <div class = "form-group ">
    <div class = "col-sm-5">
        <input type = "text" name = "password" value = "" placeholder = "Password"/> <br/>
    </div>
    </div>
    <div class = "form-group ">
    <div class = "col-sm-5">        
        <input type = "text" name = "nickname" value = "" placeholder = "Nickname"/> <br/>
    </div>
    </div>
    <div class = "col-sm-5">
        <input type = "submit" name = "submit" value = "Submit" class = "btn btn-primary" /> <br/>
    </div>
    </form>

    <!--Back Buttom to bulletinboard.php-->
    <form action = "bulletinboard.php">
    <div class = "col-sm-5">
        <input type = "submit" name = "back" value = "Back" class = "btn btn-danger"/> <br/>
    </div>
    </form>


    <?php
    $dbconnect = mysqli_connect($host, $dbuser, $dbpassword, $database);
    #check if the connection fails
    if ($dbconnect->connect_error)  die("Connection failed: " . $conn->connect_error);
    #insert new user data to database bbusers
    $query = "INSERT INTO bbusers (email, name, password, nickname)
    VALUES ('$email', '$user', '$password', '$nickname')";
    mysqli_query($dbconnect, $query);
    #closing database connection
    mysqli_close($dbconnect);
    ?>

  </body>
</html>
