document.addEventListener('DOMContentLoaded', () => {
    // 自动获取照片列表
    const photos = [];
    const photoExtensions = ['.jpg', '.jpeg', '.png'];
    
    // 尝试加载照片
    function loadPhotos() {
        // 从1开始尝试加载照片，直到连续3次失败
        let failedAttempts = 0;
        let photoIndex = 1;
        
        function tryLoadNextPhoto() {
            if (failedAttempts >= 3) {
                // 如果连续3次失败，认为已经没有更多照片
                if (photos.length === 0) {
                    showNoPhotosMessage();
                } else {
                    // 初始化相册功能
                    initCarousel(photos);
                    initGallery(photos);
                }
                return;
            }

            // 尝试加载照片
            const img = new Image();
            const photoPath = `photos/${photoIndex}.jpg`;
            
            img.onload = function() {
                photos.push(photoPath);
                failedAttempts = 0;
                photoIndex++;
                tryLoadNextPhoto();
            };

            img.onerror = function() {
                // 尝试其他扩展名
                const currentExt = photoExtensions[photoIndex % photoExtensions.length];
                const altPhotoPath = `photos/${photoIndex}${currentExt}`;
                
                const altImg = new Image();
                altImg.onload = function() {
                    photos.push(altPhotoPath);
                    failedAttempts = 0;
                    photoIndex++;
                    tryLoadNextPhoto();
                };

                altImg.onerror = function() {
                    failedAttempts++;
                    photoIndex++;
                    tryLoadNextPhoto();
                };

                altImg.src = altPhotoPath;
            };

            img.src = photoPath;
        }

        tryLoadNextPhoto();
    }

    // 显示无照片消息
    function showNoPhotosMessage() {
        const container = document.querySelector('.container');
        const message = document.createElement('div');
        message.className = 'no-photos-message';
        message.innerHTML = `
            <i class="fas fa-images"></i>
            <h2>暂无照片</h2>
            <p>请在 photos 目录下添加 .jpg 或 .png 格式的照片</p>
        `;
        container.appendChild(message);
    }

    // 初始化轮播图
    function initCarousel(photos) {
        const carouselInner = document.querySelector('.carousel-inner');
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        let currentIndex = 0;

        // 创建轮播图项目
        photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.innerHTML = `<img src="${photo}" alt="相册照片 ${index + 1}">`;
            carouselInner.appendChild(item);
        });

        // 更新轮播图位置
        function updateCarousel() {
            carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        // 下一张
        function nextSlide() {
            currentIndex = (currentIndex + 1) % photos.length;
            updateCarousel();
        }

        // 上一张
        function prevSlide() {
            currentIndex = (currentIndex - 1 + photos.length) % photos.length;
            updateCarousel();
        }

        // 添加按钮事件监听
        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);

        // 自动轮播
        setInterval(nextSlide, 5000);
    }

    function initGallery(photos) {
        const galleryGrid = document.querySelector('.gallery-grid');

        // 创建相册网格项目
        photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${photo}" alt="相册照片 ${index + 1}">`;
            
            // 添加点击事件
            item.addEventListener('click', () => {
                const lightbox = document.querySelector('.lightbox');
                const lightboxImg = document.getElementById('lightbox-img');
                lightboxImg.src = photo;
                lightbox.classList.add('active');
            });

            galleryGrid.appendChild(item);
        });
    }

    function initLightbox() {
        const lightbox = document.querySelector('.lightbox');
        const closeButton = document.querySelector('.close-lightbox');

        // 关闭灯箱
        closeButton.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        // 点击背景关闭灯箱
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });

        // ESC键关闭灯箱
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
            }
        });
    }

    function initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const icon = themeToggle.querySelector('i');
        let isDark = false;

        themeToggle.addEventListener('click', () => {
            isDark = !isDark;
            document.body.style.backgroundColor = isDark ? '#2d3436' : '#f8f9fa';
            document.body.style.color = isDark ? '#f8f9fa' : '#2d3436';
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // 初始化所有功能
    loadPhotos();
    initLightbox();
    initThemeToggle();
}); 