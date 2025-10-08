<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>

<?php
$servername = "localhost";
$username = "root";       // default user
$password = "";           // blank for XAMPP
$dbname = "odyssey_db";   // your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("❌ Connection failed: " . $conn->connect_error);
}
echo "✅ Connected successfully to MySQL via PHP!";
?>
