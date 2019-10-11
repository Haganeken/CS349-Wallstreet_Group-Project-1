<?php
  include('server.php');
  //session_start(); 
  //$nickname = $_SESSION['nickname'];
  //$nickname = "";
  $nickname = $_SESSION['email'];
  if (!isset($_SESSION['email'])) {
  	$_SESSION['msg'] = "You must log in first";
  	header('location: login.php');
  }
  if (isset($_GET['logout'])) {
  	session_destroy();
  	unset($_SESSION['email']);
  	header("location: login.php");
  }
  

 if (isset($_POST['add_comment'])) {
  // receive all input values from the form
  $postSubject = mysqli_real_escape_string($db, $_POST['postSubject']);
  $content = mysqli_real_escape_string($db, $_POST['content']);
 

  
  // Form validation, + by adding (array_push()) corresponding error unto $errors array
  if (empty($postSubject)) { array_push($errors, "Subject is required"); }
  if (empty($content)) { array_push($errors, "Content is required"); }
   
    if (count($errors) == 0) {
		//echo "QUERY CHECK COMMENT INSERT";
  	$query = "INSERT INTO `postings` (`postId`, `postDate`, `postedBy`, `postSubject`, `content`, `ancestorPath`) 
	VALUES(NULL, CURRENT_TIMESTAMP, '$nickname' , '$postSubject', '$content', $postreply)";
			  
			  
  	mysqli_query($db, $query);
  	$_SESSION['postId'] = $postId;
  	$_SESSION['success'] = "Comment Added";
  	header('location: reply.php');
  }    
}
 
?>

<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
	<title>Reply</title>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <a class="navbar-brand" href="#">Navigation Bar</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarColor01">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" href="index.php">Index </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="?logout='1'">Logout</a>
      </li>
	  <li class="nav-item">
        <a class="nav-link" href="about.php">About</a>
      </li>
    </ul>
   
  </div>
</nav>



<body>
<div class="card">
  <div class="card-body">
    <h4 class="card-title">"Post Subject</h4>


    <h6 class="card-subtitle mb-2 text-muted">Posted By</h6>
	<h6 class="card-subtitle mb-2 text-muted">Timestamp</h6>
    <p class="card-text">Content.</p>
    
    
  </div>
</div>
</body>
<?php
$query = " SELECT * FROM `postings` ORDER BY postDate ASC";
		
		$result = mysqli_query($db, $query);

		echo "BulletinBoard" . "<br>" . "---------------------------" . "<br>";
		if (mysqli_num_rows($result) > 0) {
		// output data of each row
		//Display selected postId and comment chain
		//while postId = clicked comment
		//ancestorPath = postId of top post
		
		while($row = mysqli_fetch_assoc($result)) {
			
			//test if statement to display only selected post
			 //echo '<h6><a href="reply.php?id=' . $row['postId'] . '">' . "Reply"/* $row['postId'] */ . '</a><h3>';
			 if ($postreply=$row["postId"])
			{
			
        echo " " . $row["postId"]. "   " . $row["postDate"]. " " . $row["postedBy"]. "   " . $row["postSubject"]. "   " . $row["content"]. "   " . $row["ancestorPath"]."<br>";
		//Test code below
		echo '<tr>';
                        echo '<h4 class="card-body">';
                            //echo '<h6><a href="reply.php?id=' . $row['postId'] . '">' . $row['postSubject'] . '</a><h3>';
                        echo '</h4>';
                        echo '<td class="rightpart">';
                            
                        echo '</td>';
                    echo '</tr>';
					

		}
			else {
				echo "0 children";
			}
		} 
		//test if {
		}
		else {
		echo "0 results";
		}
		
 ?>



<body>
  
  <div class="header">
  	<h2>Add a reply</h2>
  </div>
	
  <form method="post" action="reply.php">
  	<?php include('errors.php'); ?>
  	
  	<div class="input-group">
  	  <label>Subject Post</label>
  	  <input type="text" name="postSubject" value="<?php echo $postSubject; ?>">
  	</div>
	
	
	  <div class="form-group">
      <label for="ContentArea">Post</label>
      <textarea class="form-control" name="content" id="content" rows="3" value="<?php echo $content; ?>"></textarea>
    </div>
	
  	<div class="input-group">
  	  <button type="submit" class="btn" name="add_comment">Add post</button>
  	</div>
	
  	
  </form>
  <div>
  <ul class="pagination">
    <li class="page-item disabled">
      <a class="page-link" href="#">&laquo;</a>
    </li>
    <li class="page-item active">
      <a class="page-link" href="#">1</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">2</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">3</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">4</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">5</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">&raquo;</a>
    </li>
  </ul>
</div>

</body>

</html>