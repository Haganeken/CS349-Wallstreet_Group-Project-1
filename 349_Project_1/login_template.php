<?php
      if($_SERVER["REQUEST_METHOD"] == "POST"){
        #get email and password from form
        $email = $_POST["email"];
        $pw = $_POST["password"];
        #get data from database
        #database query goes here
        $query = "";
        $result = mysqli_query($dbconnection, $query);
        #scan through all data from bbusers
        while($row = mysqli_fetch_assoc($result)){
          #check if the email matches the database
          if($row["email"] == $email){
            #check if the password matches with email
            if($row["password"] == $pw){
              $email = $row["email"];
            }
          }
        }
      }
      mysqli_close($dbconnection);
?>