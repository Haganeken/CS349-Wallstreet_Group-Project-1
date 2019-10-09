<html>
  <head>
    <title>POST MESSAGE</title>
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
    $name = $nickname = "";
    $postID = $email = $postSubject = $postDate = $postedBy = $content = $ancestorPath = "";
    $num = 0;
    $date = date("Y-m-d");
    if(isset($_GET["postID"])){
      $postID = $_GET["postID"];
    }
    if(isset($_GET["email"])){
      $email = $_GET["email"];
    }

    if(isset($_POST["postID"])){
      $postID = $_POST["postID"];
    }
    if(isset($_POST["email"])){
      $email = $_POST["email"];
    }

    #get users data from database with email
    $dbconnect = mysqli_connect($host, $dbuser, $dbpassword, $database);
    $query = "SELECT name, email, nickname FROM bbusers";
    $result = mysqli_query($dbconnect, $query);
    while($row = $result->fetch_assoc()){
      if($row["email"] == $email){
        $name = $row["name"];
        $nickname = $row["nickname"];
      }
    }
    mysqli_close($dbconnect);

    #get more data from PostID information
    $dbconnect = mysqli_connect($host, $dbuser, $dbpassword, $database);
    $query = "SELECT postID,postDate,postedBy,postSubject,content, ancestorPath FROM postings";
    $result = mysqli_query($dbconnect, $query);
    while($row = mysqli_fetch_assoc($result)){
      if($row["postID"] == $postID){
        $postSubject = $row["postSubject"];
        $postedBy = $row["postedBy"];
        $content = $row["content"];
        $ancestorPath = $row["ancestorPath"];
        $postDate = $row["postDate"];
        if($row["postID"] >= $num){
          $num = $row["postID"] + 1;
        }
      }
    }


      #check if submit buttom created new message
      $replyEmail = $messageEmail = $replySubject = "";
      if($_SERVER["REQUEST_METHOD"] == "POST"){
        $replySubject = "Re: ";
        $replySubject .= $postSubject;

        $replyEmail = $email;
        if(isset($_POST["name"])) $replyName = $_POST["name"];
        if(isset($_POST["message"])) $replyMessage = $_POST["message"];

        $dbconnect = mysqli_connect($host, $dbuser, $dbpassword, $database);
        $query = "INSERT INTO postings(postID, postDate, postedBy, postSubject, content, ancestorPath)
                  VALUES ('$num', '$date', '$replyName', '$replySubject', '$replyMessage', '$postID')";
        $result = mysqli_query($dbconnect, $query);
      }
     ?>

     <div class = "col-sm-5"> 
     <h1> User : <?php echo $email; ?> </h1>
     <a href = "bb_board.php?email=<?php echo $email;?>" > [Home Page] </a>
     <a href = "bulletinboard.php"> [Logout] </a>
     </div>
     <hr/>
     <div class = "col-sm-5">
     <h2> SUBJECT: <?php echo $postSubject; ?> </h2>
     </div>
        <!--Back page button, Check if there is previous post, if not, go to home page-->
         <?php
            if($ancestorPath == NULL){
            }
            else{
              ?>
                <a href="post_message.php?postID=<?php echo $ancestorPath; ?>&email=<?php echo $email; ?>"> [Previous Post] </a> 
              <?php
            }
          ?>
     <hr/>
     <div class = "col-sm-5">
     <p> Posted by <?php echo $postedBy; ?> on  <?php echo $postDate; ?> </p>
     <p> Message: <?php echo $content; ?> </p>
     </div>
     <hr/>
     <div class = "col-sm-5">
     <p> Follow up: </p>
     </div>
     <?php
     #check if there is an ancestory
     $query = "SELECT postID,postDate,postedBy,postSubject,content, ancestorPath FROM postings";
     $result = mysqli_query($dbconnect, $query);
     $ancestSubject = $ancestPostedBy = $ancestContent = $ancestPostDate = "";
      while($row = mysqli_fetch_assoc($result)){
        if($postID == $row["ancestorPath"]){
          $ancestID = $row["postID"];
          $ancestSubject = $row["postSubject"];
          $ancestPostedBy = $row["postedBy"];
          $ancestContent = $row["content"];
          $ancestPostDate = $row["postDate"];

          ?>
          <li> In reply to :
            <a href = "./post_message.php?postID=<?php echo $ancestID;?>&email=<?php echo $email; ?>">
              <?php echo $postSubject ?>
                </a> posted by <?php echo $ancestPostedBy ?> on <?php echo $ancestPostDate ?> <br>
            Message: &nbsp;<?php echo $ancestContent ?>
          </li>
          <?php
        }
      }
      ?>

     <hr>
    <div class = "col-sm-5">
     Post a Follow up: <br>
       <form action = "<?php echo $_SERVER["PHP_SELF"] ?>" method = "post">
          <input type = "hidden" name = "email" value = '<?php echo $email; ?>'>
          <input type = "hidden" name = "postID" value = '<?php echo $postID; ?>'>
           User: <input type = "text" name = "name" value = "<?php echo $nickname;?>" required> <br>
           Email: <?php echo $email ?> <br>
           Comment: <br>
           <textarea rows = "4" cols = "50" name = "message" required> </textarea><br>
           <input type = "submit" name = "submit" value = "Submit" class = "btn btn-warning"/>
        </form>
    </div>

     <?php
          mysqli_close($dbconnect);
      ?>
  </body>
</html>
