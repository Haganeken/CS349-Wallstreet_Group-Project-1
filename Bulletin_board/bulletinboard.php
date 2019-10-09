<html>
  <head>
    <title>Online Bulletin Board System </title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="mycss\css\bootstrap.min.css">
  </head>

  <body style="background-color:powderblue;">
    <!-- Database and variables -->
    <?php
      #database information
      $dbuser = "root";
      $dbpassword = "";
      $database = "bulletin_board";
      $host = "localhost";
      #preinitialized data
      $email = "";
      $pw = "";
      $email = "";
      #connect into mysql
      $dbconnection = mysqli_connect($host, $dbuser, $dbpassword, $database);
    ?>

    <!--Check if the credential is correct before redirecting to bb_board.php-->
    <?php
      if($_SERVER["REQUEST_METHOD"] == "POST"){
        #get email and password from form
        $email = $_POST["email"];
        $pw = $_POST["password"];
        #get data from database
        $query = "SELECT name, password, email FROM bbusers";
        $result = mysqli_query($dbconnection, $query);
        #scan through all data from bbusers
        while($row = mysqli_fetch_assoc($result)){
          #check if the email matches the database
          if($row["email"] == $email){
            #check if the password matches with email
            if($row["password"] == $pw){
              $email = $row["email"];
              #redirect the user to bb_board.php
              header("location:bb_board.php?email=$email");
            }
          }
        }
      }
      mysqli_close($dbconnection);
    ?>

    <!--Form Section to get data from user-->
    <div class = "col-sm-5">
    <h1> Online Bulletin Board </h1> <hr/>
    </div>
    <div class = "col-sm-5">
    <h3> Login </h3>
    </div>
    <form action = "<?php echo $_SERVER["PHP_SELF"]?>" method = "post">
    <div class = "form-group ">
    <div class = "col-sm-5">
    <input type = "text" class = "form-control" name = "email" value = "" placeholder = "Email" /> <br/>
    </div>
    </div>
    <div class = "form- group">
    <div class = "col-sm-5">
    <input type = "password" class = "form-control" name = "password" value = "" placeholder = Password /> <br/>
    </div>
    </div>
    <div class = col-sm-5>
    <input type = "submit" name = "submit" value = "Submit" class = "btn btn-primary" /> <br />
    </div>
    </form>

    <!--Sign Up Buttom redirecting to signup_form_process.php-->
    <form action = "signup_form_process.php">
    <div class = "col-sm-5">  
    <input type = "submit" name = "signup" value = "Signup" class = "btn btn-success" />
    </div>
    </form>
  </body>
</html>
