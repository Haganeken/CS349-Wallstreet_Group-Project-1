    <?php
        #preinitialized data
        $email = $user = $password = $nickname = " ";
        if($_SERVER["REQUEST_METHOD"] == "POST"){
          $email = $_POST["email"];
          $user = $_POST["username"];
          $password = $_POST["password"];
          $nickname = $_POST["nickname"];
        }
    ?>
    
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