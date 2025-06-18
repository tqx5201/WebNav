document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 获取照片列表
        const photos = await getPhotos();
        
        if (photos.length === 0) {
            showNoPhotosMessage();
            return;
        }

        // 初始化轮播图
        initCarousel(photos);
        // 初始化相册网格
        initGallery(photos);
        // 初始化灯箱效果
        initLightbox();
        // 初始化主题切换
        initThemeToggle();
    } catch (error) {
        console.error('加载照片时出错:', error);
        showNoPhotosMessage();
    }
});

async function getPhotos() {
    try {
        // 获取当前仓库的根路径
        const basePath = window.location.pathname.includes('/PersonalAlbum/') 
            ? '/PersonalAlbum/' 
            : '/';
        
        // 构建照片目录的URL
        const photosDirUrl = `${window.location.origin}${basePath}photos/`;
        
        // 获取目录内容
        const response = await fetch(photosDirUrl);
        const text = await response.text();
        
        // 使用正则表达式匹配jpg和png文件
        const photoRegex = /href="([^"]+\.(jpg|png))"/gi;
        const photos = [];
        let match;
        
        while ((match = photoRegex.exec(text)) !== null) {
            const photoPath = `${photosDirUrl}${match[1]}`;
            photos.push(photoPath);
        }
        
        return photos;
    } catch (error) {
        console.error('获取照片列表失败:', error);
        return [];
    }
}

function showNoPhotosMessage() {
    const container = document.querySelector('.container');
    const message = document.createElement('div');
    message.className = 'no-photos-message';
    message.innerHTML = `
        <i class="fas fa-images"></i>
        <h2>暂无照片</h2>
        <p>请在 photos 目录中添加 .jpg 或 .png 格式的照片</p>
    `;
    container.appendChild(message);
}

function initCarousel(photos) {
    const carouselInner = document.querySelector('.carousel-inner');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentIndex = 0;

    // 创建轮播图项目
    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.innerHTML = `<img src="${photo}" alt="相册照片 ${index + 1}" loading="lazy">`;
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
        item.innerHTML = `<img src="${photo}" alt="相册照片 ${index + 1}" loading="lazy">`;
        
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