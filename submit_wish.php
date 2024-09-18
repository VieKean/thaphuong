<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "wish_tree";

// Tạo kết nối
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối không thành công: " . $conn->connect_error);
}

// Nhận dữ liệu từ yêu cầu POST để thêm ước nguyện
if (isset($_POST['wish'])) {
    $wish = $conn->real_escape_string($_POST['wish']);
    $sql = "INSERT INTO wishes (wish_text, date_submitted) VALUES ('$wish', NOW())";

    if ($conn->query($sql) === TRUE) {
        echo "success";
    } else {
        echo "error";
    }
} 

// Nhận dữ liệu từ yêu cầu GET để lấy tất cả ước nguyện
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT wish_text FROM wishes";
    $result = $conn->query($sql);

    $wishes = [];
    while ($row = $result->fetch_assoc()) {
        $wishes[] = $row['wish_text'];
    }
    echo json_encode($wishes);
}

$conn->close();
?>
