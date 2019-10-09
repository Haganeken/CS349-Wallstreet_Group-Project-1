<html>
  <head>
    <title> Main Page </title>
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
      $email = ""; #email is REQUIRED and should not be changed
      $subject = $message = "";
      $user = "";
      $num = 0;
      $email = "";
      $date = date("Y-m-d");
      #first initial data from bulletinboard.php
      if(isset($_GET["email"])) $email = $_GET["email"];
      #Submit buttom was triggered and grabbing data from form
      if($_SERVER["REQUEST_METHOD"] == "POST"){
          $message = $_POST["message"];
          $subject = $_POST["subject"];
          $email = $_POST["email"]; #<- grab old data
      }
      #get users data from database with email
      $dbconnect = mysqli_connect($host, $dbuser, $dbpassword, $database);
      $query = "SELECT name, email, nickname FROM bbusers";
      $result = mysqli_query($dbconnect, $query);
      while($row = $result->fetch_assoc()){
        if($row["email"] == $email){
          $user = $row["name"];
          $nickname = $row["nickname"];
        }
      }
      mysqli_close($dbconnect);
      #find all largest postID and add 1 for next post
      if($_SERVER["REQUEST_METHOD"] == "POST"){
        $dbconnect = mysqli_connect($host, $dbuser, $dbpassword, $database);
        $query = "SELECT postID FROM postings";
        $result = mysqli_query($dbconnect, $query);
        while($row = mysqli_fetch_assoc($result)){
          if($row["postID"] >= $num) {
            $num = $row["postID"] + 1;
          }
        }
        #inserting new message post here
        $query = "INSERT INTO postings(postID, postDate, postedBy, postSubject, content)
                  VALUES ('$num', '$date', '$user', '$subject', '$message')";
        $result = mysqli_query($dbconnect, $query);
        #closing database connection
        mysqli_close($dbconnect);
      }
      ?>

      <!--Display current user logged in -->
      <div class = col-sm-5>
      <h1> User: <?php echo $email ?> </h1>

      <!--Logout button-->
      <a href = "bulletinboard.php"> [Logout] </a> <hr/>

      <!-- Bulletin Board text -->
      <h2> BULLETIN BOARD </h2>
      </div>

      <!-- Grabbing all the content from database -->
      <?php
        #grab data from posting in bulletin_baord
        $dbconnect = mysqli_connect($host, $dbuser, $dbpassword, $database);
        $query = "SELECT postID, postDate, postedBy, postSubject, content, ancestorPath FROM postings";
        $result = mysqli_query($dbconnect, $query);
        #fetch all post that are main post
        while($row = mysqli_fetch_assoc($result)){
          if($row["ancestorPath"] == NULL){
            $postID = $row["postID"];
        ?>

      <!--LISTING ALL CONTENT HERE-->
              <!--This is in the if statement-->
              <li>
                <a href="./post_message.php?postID=<?php echo $row["postID"]; ?>&email=<?php echo $email;?>">
                  <?php echo $row["postSubject"];?>
                </a>
                <?php echo " - ", $row["postedBy"], " ", $row["postDate"]; ?>
              </li>
      <?php
          } #end of if-statement
        } #end of while-loop
        mysqli_close($dbconnect);
      ?>

      <!--Post Form-->
      <div class = "col-sm-5">
      <h3> POST A MESSAGE </h3>
      <p>
          Name: <?php echo $user; ?> <br>
          Email: <?php echo $email; ?> <br>
      </p>
      </div>

      <form action = "<?php echo $_SERVER["PHP_SELF"] ?>" method = "post">
        <input type="hidden" name="email" value = '<?php echo $email;?>'> 
        <div class = "form-group ">
        <div class = "col-sm-5">            
            <input type = "text" name = "subject" value = "" required><br>
        </div>
        </div>
        <div class = "form-group ">
        <div class = "col-sm-5">            
            <textarea rows = "4" cols = "50" placeholder = "" name = "message" required> </textarea>
        </div>
        </div>
        <br>
        <div class = "col-sm-5">
        <input type = "submit" name = "submit" value = "Post Message" class = "btn btn-success"/>
        </div>
    </form>
  </body>
</html>
