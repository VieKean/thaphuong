document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById("submitBtn");
    const quehuong = document.querySelector(".quehuong");
    const wishForm = document.getElementById("wishForm");
    const btnThaphuong = document.getElementById("btnThaphuong");
    const phat = document.querySelector(".phat");
    const may = document.querySelector(".may");
    const thapHuongAudio = document.getElementById("daihongchung");

    submitBtn.addEventListener("click", function (event) {
        event.preventDefault();

        // Cuộn trang về đầu
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Lấy dữ liệu từ form
        const formData = new FormData(wishForm);
        const wishText = formData.get('wish'); // Lấy nội dung ước nguyện

        // Phát âm thanh thắp hương
        thapHuongAudio.play();

        // Ngừng phát và reset âm thanh sau 10 giây
        setTimeout(() => {
            thapHuongAudio.pause();
            thapHuongAudio.currentTime = 0; // Đặt lại vị trí phát về đầu
        }, 15000); // 15000ms tương đương 15 giây

        // Thực hiện hoạt ảnh thắp hương sau khi cuộn trang hoàn tất
        setTimeout(() => {
            quehuong.classList.add("thaphuong");

            // Chờ hoạt ảnh thắp hương hoàn tất rồi tiếp tục
            setTimeout(() => {
                // Hiển thị hoạt ảnh phật và mây
                phat.classList.add("hienphat");
                may.classList.add("hienphat");

                // Chờ một khoảng thời gian sau khi hiển thị phật và mây
                setTimeout(() => {
                    // Ẩn phật và mây
                    phat.classList.remove("hienphat");
                    may.classList.remove("hienphat");

                    // Ẩn hoạt ảnh thắp hương
                    quehuong.classList.remove("thaphuong");

                    // Đặt giá trị mới cho btnThaphuong
                    btnThaphuong.value = "Đã Thắp Hương";

                    // Gửi dữ liệu form qua fetch
                    fetch('submit_wish.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.text())
                    .then(data => {
                        if (data === 'success') {
                            // Reset form và tải lại thẻ ước nguyện
                            wishForm.reset();
                            loadWishes();

                            // Làm nổi bật thẻ vừa gửi
                            setTimeout(() => {
                                const tagsContainer = document.getElementById('tagsContainer');
                                const newTags = tagsContainer.getElementsByClassName('wish-tag');
                                for (let i = 0; i < newTags.length; i++) {
                                    if (newTags[i].dataset.wish === wishText) {
                                        newTags[i].classList.add('highlight');
                                        
                                        // Gỡ bỏ lớp highlight khi nhấn nút khác
                                        document.getElementById('toggleTreeButton').addEventListener('click', function() {
                                            newTags[i].classList.remove('highlight');
                                        });
                                    }
                                }
                            }, 500); // Đợi một chút sau khi tải lại để áp dụng hiệu ứng

                        } else {
                            alert('Có lỗi xảy ra, vui lòng thử lại.');
                        }
                    })
                    .catch(error => {
                        console.error('Lỗi:', error);
                        alert('Có lỗi xảy ra, vui lòng thử lại.');
                    });

                }, 5000); // Hiển thị phật và mây trong 5 giây

            }, 3000); // Thời gian hoạt ảnh thắp hương

        }, 500); // Thời gian để cuộn trang về đầu trước khi bắt đầu hoạt ảnh
    });
});
