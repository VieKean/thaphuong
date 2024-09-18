document.getElementById('wishForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const wishText = document.getElementById('wish').value;

    fetch('submit_wish.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ wish: wishText }),
    })
        .then(response => response.text())
        .then(data => {
            if (data === 'success') {
                document.getElementById('wish').value = '';
                loadWishes(); // Tải lại tất cả các thẻ ước nguyện

                // Tìm và làm nổi bật thẻ ước nguyện mới gửi
                setTimeout(() => {
                    const tagsContainer = document.getElementById('tagsContainer');
                    const newTags = tagsContainer.getElementsByClassName('wish-tag');
                    for (let i = 0; i < newTags.length; i++) {
                        if (newTags[i].dataset.wish === wishText) {
                            newTags[i].classList.add('highlight');
                            // Gỡ bỏ lớp highlight khi nhấn nút khác
                            document.getElementById('toggleTreeButton').addEventListener('click', function () {
                                newTags[i].classList.remove('highlight');
                            });
                        }
                    }
                }, 500); // Đợi một chút sau khi tải lại để áp dụng hiệu ứng
            } else {
                alert('Có lỗi xảy ra, vui lòng thử lại.');
            }
        });
});

// Hiển thị nội dung ước nguyện khi nhấn vào thẻ tre
document.getElementById('tagsContainer').addEventListener('click', function (event) {
    if (event.target.classList.contains('wish-tag')) {
        const wishText = event.target.dataset.wish;
        document.getElementById('wishContent').textContent = wishText;
        document.getElementById('wishModal').style.display = 'block';
    }
});

// Đóng modal khi nhấn vào biểu tượng đóng
document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('wishModal').style.display = 'none';
});

// Đóng modal khi nhấn ra ngoài modal
window.addEventListener('click', function (event) {
    if (event.target === document.getElementById('wishModal')) {
        document.getElementById('wishModal').style.display = 'none';
    }
});

// Khi trang được tải, gọi loadWishes để đảm bảo tất cả các thẻ được tải ngay từ đầu
document.addEventListener('DOMContentLoaded', function () {
    const wishTree = document.getElementById('wishTree');
    const toggleTreeButton = document.getElementById('toggleTreeButton');

    // Đặt vị trí của cây ước nguyện
    if (wishTree.style.right === '0px' || wishTree.style.right === '') {
        // Cây ước nguyện đã hiển thị
        toggleTreeButton.textContent = 'Ẩn Cây Ước Nguyện';
    } else {
        // Cây ước nguyện đã ẩn
        toggleTreeButton.textContent = 'Hiển thị Cây Ước Nguyện';
    }

    // Gọi loadWishes để đảm bảo các thẻ ước nguyện được tải
    loadWishes();
});

// Hiển thị và ẩn cây ước nguyện khi nhấn nút
document.getElementById('toggleTreeButton').addEventListener('click', function () {
    const wishTree = document.getElementById('wishTree');
    if (wishTree.style.right === '0px' || wishTree.style.right === '') {
        wishTree.style.right = '-804px'; // Ẩn cây
        this.textContent = 'Hiển thị Cây Ước Nguyện';
    } else {
        wishTree.style.right = '0'; // Hiển thị cây
        this.textContent = 'Ẩn Cây Ước Nguyện';
        // Tải tất cả các thẻ ước nguyện khi cây xuất hiện
        loadWishes();
    }
});



// Tạo một mảng để lưu các vị trí đã sử dụng
const usedPositions = [];

// Hàm kiểm tra xem một vị trí đã bị sử dụng chưa
function isPositionUsed(x, y) {
    return usedPositions.some(pos => Math.abs(pos.x - x) < 50 && Math.abs(pos.y - y) < 50); // 50 là kích thước của thẻ
}

// Tạo một vị trí không chồng lấp
function getAvailablePosition(treeWidth, treeHeight) {
    let x, y;

    // Tìm một vị trí không bị chiếm
    do {
        x = Math.floor(Math.random() * (treeWidth - 50)); // 50 là kích thước của thẻ
        y = Math.floor(Math.random() * (treeHeight - 50)); // 50 là kích thước của thẻ
    } while (isPositionUsed(x, y));

    // Thêm vị trí vào mảng các vị trí đã sử dụng
    usedPositions.push({ x, y });

    return { x, y };
}

function loadWishes() {
    const treeImage = document.getElementById('treeImage');
    const treeWidth = treeImage.offsetWidth;
    const treeHeight = treeImage.offsetHeight;

    fetch('submit_wish.php', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(wishes => {
            const tagsContainer = document.getElementById('tagsContainer');
            tagsContainer.innerHTML = ''; // Xóa tất cả thẻ tre hiện tại
            usedPositions.length = 0; // Xóa các vị trí đã sử dụng

            wishes.forEach(wish => {
                const newWishTag = document.createElement('img');
                newWishTag.src = 'wish_tag.png'; // Đường dẫn đến hình ảnh thẻ tre
                newWishTag.classList.add('wish-tag');
                newWishTag.dataset.wish = wish; // Lưu nội dung ước nguyện vào thuộc tính data

                // Lấy vị trí có sẵn và gán cho thẻ
                const position = getAvailablePosition(treeWidth, treeHeight);
                newWishTag.style.top = `${position.y}px`;
                newWishTag.style.left = `${position.x}px`;


                tagsContainer.appendChild(newWishTag);

            });
        });
}
// Okee