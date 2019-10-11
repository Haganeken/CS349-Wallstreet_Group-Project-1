<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
	
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
</html>

<?php 
  include('server.php');
  //session_start(); 
  //$nickname = $_SESSION['nickname'];
  //$nickname = "";
  $postreply = "";
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
  
 
	//ADD COMMENT
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
	VALUES(NULL, CURRENT_TIMESTAMP, '$nickname' , '$postSubject', '$content', NULL)";
			  
			  
  	mysqli_query($db, $query);
  	$_SESSION['postId'] = $postId;
  	$_SESSION['success'] = "Comment Added";
  	header('location: index.php');
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
	<title>Home</title>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <a class="navbar-brand" href="#">Navigation Bar</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarColor01">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="">Index <span class="sr-only">(current)</span></a>
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

<div class="header">
	<h2>Index</h2>
</div>
<div class="content">
  	<!-- notification message -->
  	<?php if (isset($_SESSION['success'])) : ?>
      <div class="error success" >
      	<h3>
          <?php 
          	echo $_SESSION['success']; 
          	unset($_SESSION['success']);
          ?>
      	</h3>
      </div>
  	<?php endif ?>

    <!-- logged in user information -->
    <?php  if (isset($_SESSION['email'])) : ?>
    	<p>Welcome <strong><?php echo $_SESSION['email']; ?></strong></p>
    	<p> <a href="index.php?logout='1'" style="color: red;">logout</a> </p>
    <?php endif ?>
</div>
		
</body>

<body>

<div class="card">
  <div class="card-body">
    <h4 class="card-title" >Title</h4>

	
    <h6 class="card-subtitle mb-2 text-muted">postedBy</h6>
	<h6 class="card-subtitle mb-2 text-muted">timestamp</h6>
    <p class="card-text">Content.</p>
    <a href="reply.php" class="card-link">Reply</a>
    
  </div>
</div>
</body>

<?php
//QUERY
  //SELECT * FROM `postings` 
  $query = " SELECT * FROM `postings` ORDER BY postDate DESC";
		
		$result = mysqli_query($db, $query);

		echo "BulletinBoard" . "<br>" . "---------------------------" . "<br>";
		if (mysqli_num_rows($result) > 0) {
		// output data of each row
		while($row = mysqli_fetch_assoc($result)) {
        echo " " . $row["postId"]. "   " . $row["postDate"]. " " . $row["postedBy"]. "   " . $row["postSubject"]. "   " . $row["content"]. "   " . $row["ancestorPath"]."<br>";
		//Test code below
		//if post has comment parent, 
		//if $row["ancestorPath"] = notnull
		echo '<tr>';
                        echo '<h4 class="card-body">';
						
                            echo '<h6><a href="reply.php?id=' . $row['postId'] . '">' . "Reply"/* $row['postId'] */ . '</a><h3>';
							if ( '<h6><a href="reply.php?id=' . $row['postId'] . '">' )
							{
							$postreply = $row['postId'];
							
							}
                        echo '</h4>';
                        echo '<td class="rightpart">';
                            
                        echo '</td>';
                    echo '</tr>';
					
					
					/* <div class="card">
  <div class="card-body">
    <h4 class="card-title" value = "<?php echo $row['postedBy']; ?>" ></h4>


    <h6 class="card-subtitle mb-2 text-muted"><value = "<?php echo $row['postedBy']; ?> " ></h6>
	<h6 class="card-subtitle mb-2 text-muted">Card subtitle2</h6>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="card-link">Card link</a> */
    
					
		//$postId=$row['postId'];
		//$postDate=$row['postDate'];
		//$postedBy=$row['postedBy'];
		//$postSubject=$row['postSubject'];
		//$content=$row['content'];
		//$ancestorPath=$row['ancestorPath'];
		
		}
		} 
		else {
		echo "0 results";
		}

?>

<body>
  <div class="header">
  	<h2>Add a post</h2>
  </div>
	
  <form method="post" action="index.php">
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
  <div align="center">
  
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