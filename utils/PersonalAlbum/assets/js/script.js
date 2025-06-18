document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 获取photos目录下的所有图片
        const photos = await loadPhotos();
        
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

async function loadPhotos() {
    try {
        // 使用 File System Access API
        const dirHandle = await window.showDirectoryPicker({
            startIn: 'pictures',
            mode: 'read'
        });

        const photos = [];
        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'file') {
                const file = await entry.getFile();
                if (file.type.startsWith('image/') && 
                    (file.name.toLowerCase().endsWith('.jpg') || 
                     file.name.toLowerCase().endsWith('.jpeg') || 
                     file.name.toLowerCase().endsWith('.png'))) {
                    const url = URL.createObjectURL(file);
                    photos.push(url);
                }
            }
        }
        return photos;
    } catch (error) {
        console.error('读取照片目录失败:', error);
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
        <p>请选择包含照片的文件夹</p>
        <button class="retry-button">重新选择文件夹</button>
    `;
    
    // 清空现有内容
    container.innerHTML = '';
    container.appendChild(message);

    // 添加重试按钮事件
    const retryButton = message.querySelector('.retry-button');
    retryButton.addEventListener('click', async () => {
        const photos = await loadPhotos();
        if (photos.length > 0) {
            location.reload();
        }
    });
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