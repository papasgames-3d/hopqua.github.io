let currentImageIndex = 0;
let productImages = [];

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        return;
    }

    const product = getProductById(productId);

    if (!product) {
        document.getElementById('product-name').textContent = 'Không tìm thấy sản phẩm';
        const imagesContainer = document.getElementById('product-images');
        if (imagesContainer) {
            imagesContainer.innerHTML = '<p>Không tìm thấy thông tin sản phẩm.</p>';
        }
        return;
    }

    document.getElementById('product-name').textContent = product.name;
    document.title = product.name + ' - Phụ kiện Trung Thu';

    updateMetaTags(product);
    displayProductInfo(product);

    const imagesContainer = document.getElementById('product-images');
    loadProductImages(product, imagesContainer);

    if (product.videos && product.videos.length > 0) {
        const videoContainer = document.getElementById('product-videos');
        if (videoContainer) {
            displayProductVideos(product, videoContainer);
        }
    }

    setupGalleryNavigation();
});

function displayProductInfo(product) {
    const productInfoElement = document.getElementById('product-info');
    if (!productInfoElement) {
        return;
    }

    productInfoElement.innerHTML = `
            <div class="gallery-section">
                <div class="gallery-container mb-6">
                    <div class="product-images" id="product-images"></div>
                    <div class="gallery-counter" id="gallery-counter">1 / 1</div>
                    <div class="gallery-nav prev-btn" id="gallery-prev">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </div>
                    <div class="gallery-nav next-btn" id="gallery-next">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </div>
                <div class="gallery-indicators" id="gallery-indicators"></div>
            </div>
            <div class="product-info">
                <h3 class="price-title">Giá:</h3>
                <p class="price">${product.price}</p>
                <h3 class="description-title">Mô tả:</h3>
                <p class="description">${product.description}</p>
                <div class="buy-buttons">
                    <a href="https://shopee.vn/shop/169541002" target="_blank" class="buy-button shopee-button">
                        <svg class="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4Z" fill="#EE4D2D"/>
                            <path d="M36.01 16.52C35.41 15.92 34.26 15.92 33.66 16.52L33.66 16.52C33.06 17.12 31.91 17.12 31.31 16.52L31.31 16.52C30.71 15.92 29.56 15.92 28.96 16.52C28.36 17.12 28.36 18.27 28.96 18.87C29.56 19.47 29.56 20.62 28.96 21.22C28.36 21.82 27.21 21.82 26.61 21.22L26.61 21.22C26.01 20.62 24.86 20.62 24.26 21.22C23.66 21.82 23.66 22.97 24.26 23.57C24.86 24.17 24.86 25.32 24.26 25.92C23.66 26.52 22.51 26.52 21.91 25.92L21.91 25.92C21.31 25.32 20.16 25.32 19.56 25.92C18.96 26.52 18.96 27.67 19.56 28.27C20.16 28.87 20.16 30.02 19.56 30.62C18.96 31.22 17.81 31.22 17.21 30.62L17.21 30.62C16.61 30.02 15.46 30.02 14.86 30.62C14.26 31.22 14.26 32.37 14.86 32.97C15.46 33.57 15.46 34.72 14.86 35.32C14.26 35.92 13.11 35.92 12.51 35.32L12.51 35.32C11.91 34.72 10.76 34.72 10.16 35.32" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M27.73 27.46L27.73 27.46C27.13 26.86 25.98 26.86 25.38 27.46L25.37 27.46C24.77 28.06 23.62 28.06 23.02 27.46C22.42 26.86 22.42 25.71 23.02 25.11C23.62 24.51 23.62 23.36 23.02 22.76C22.42 22.16 21.27 22.16 20.67 22.76L20.67 22.76C20.07 23.36 18.92 23.36 18.32 22.76C17.72 22.16 17.72 21.01 18.32 20.41C18.92 19.81 18.92 18.66 18.32 18.06C17.72 17.46 16.57 17.46 15.97 18.06L15.97 18.06C15.37 18.66 14.22 18.66 13.62 18.06C13.02 17.46 13.02 16.31 13.62 15.71L14.5 14.83C15.1 14.23 16.25 14.23 16.85 14.83L16.85 14.83C17.45 15.43 18.6 15.43 19.2 14.83C19.8 14.23 19.8 13.08 19.2 12.48C18.6 11.88 18.6 10.73 19.2 10.13C19.8 9.53 20.95 9.53 21.55 10.13L21.55 10.13C22.15 10.73 23.3 10.73 23.9 10.13C24.5 9.53 24.5 8.38 23.9 7.78C23.3 7.18 23.3 6.03 23.9 5.43C24.5 4.83 25.65 4.83 26.25 5.43L26.25 5.43C26.85 6.03 28 6.03 28.6 5.43C29.2 4.83 29.2 3.68 28.6 3.08" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        Mua qua Shopee
                    </a>
                    <a href="https://zalo.me/0965671689" target="_blank" class="buy-button zalo-button">
                        <img src="./image/zalo-hd-logo.png" alt="Zalo" class="w-5 h-5 mr-2" width="20" height="20" loading="lazy">
                        Liên hệ Zalo
                    </a>
                </div>
            </div>
        `;
}

function updateMetaTags(product) {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');

    const canonicalProductUrl = getCanonicalProductUrl(product);
    const canonicalImageUrl = getCanonicalAssetUrl(product.thumbnail);
    const canonicalLink = document.querySelector('link[rel="canonical"]');

    if (ogTitle) ogTitle.setAttribute('content', product.name);
    if (ogDesc) ogDesc.setAttribute('content', product.description);
    if (ogImage) ogImage.setAttribute('content', canonicalImageUrl);
    if (ogUrl) ogUrl.setAttribute('content', canonicalProductUrl);
    if (canonicalLink) canonicalLink.setAttribute('href', canonicalProductUrl);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    const twImage = document.querySelector('meta[name="twitter:image"]');

    if (twTitle) twTitle.setAttribute('content', product.name);
    if (twDesc) twDesc.setAttribute('content', product.description);
    if (twImage) twImage.setAttribute('content', canonicalImageUrl);

    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (jsonLdScript) {
        try {
            const jsonLd = JSON.parse(jsonLdScript.textContent);
            jsonLd.name = product.name;
            jsonLd.description = product.description;
            jsonLd.image = canonicalImageUrl;
            jsonLd.url = canonicalProductUrl;
            jsonLdScript.textContent = JSON.stringify(jsonLd, null, 2);
        } catch (e) {
            // Bỏ qua nếu JSON-LD gốc không hợp lệ.
        }
    }
}

function getCanonicalProductUrl(product) {
    return `https://hopqua.github.io/product.html?id=${encodeURIComponent(product.id)}`;
}

function getCanonicalAssetUrl(assetPath) {
    if (!assetPath) return '';
    if (/^https?:\/\//i.test(assetPath)) return assetPath;
    return `https://hopqua.github.io/${assetPath.replace(/^\.\//, '')}`;
}

function resolveGalleryPaths(product) {
    const paths = [];

    if (product.videos && product.videos.length) {
        paths.push(...product.videos);
    }

    const manifest = getProductGalleryImages(product.id);
    if (manifest.length) {
        paths.push(...manifest);
        return paths;
    }

    paths.push(...buildFallbackImagePaths(product));
    return paths;
}

function buildFallbackImagePaths(product) {
    const basePath = `image/${product.folder}`;
    const result = [];

    if (product.id === 'tui-dung-banh-trung-thu-sz-9-10-11') {
        [3, 4, 5, 6, 12, 13, 14, 15, 16, 17, 18].forEach((n) => {
            result.push(`${basePath}/tui-dung-banh-trung-thu-sz-91011-${n}.jpg`);
        });
        return result;
    }

    if (product.id === 'hoa-vien-do-4-banh-re') {
        [1, 2, 3, 4].forEach((n) => result.push(`${basePath}/hoa-vien-do-4-banh-re-${n}.jpg`));
        return result;
    }

    if (product.id === 'hop-lam-cuc-4-6-banh') {
        for (let i = 1; i <= 5; i++) result.push(`${basePath}/hop-lam-cuc-4-6-banh-${i}.jpg`);
        for (let i = 1; i <= 22; i++) {
            result.push(`${basePath}/vo-hop-trung-thu-lam-cuc-4-banh-tra-6-banh-them-anh-${i}.jpg`);
        }
        return result;
    }

    const folderParts = product.folder.split('/');
    const subFolder = folderParts[folderParts.length - 1];
    const max = product.folder.includes('18-06-2025') || product.folder.includes('26-5-2026') ? 15 : 12;

    for (let i = 1; i <= max; i++) {
        result.push(`${basePath}/${subFolder}-${i}.jpg`);
    }

    if (!product.folder.includes('/')) {
        for (let i = 1; i <= max; i++) {
            result.push(`${basePath}/${product.id}-${i}.jpg`);
        }
    }

    return result;
}

function loadProductImages(product, container) {
    productImages = resolveGalleryPaths(product);
    currentImageIndex = 0;

    if (!container) {
        return;
    }

    container.innerHTML = '';

    const indicatorsContainer = document.getElementById('gallery-indicators');
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
    }

    if (productImages.length > 0) {
        displayImage(0);
    } else {
        container.innerHTML = '<p>Không tìm thấy ảnh sản phẩm.</p>';
    }

    createGalleryIndicators();
}

function displayImage(index) {
    if (index < 0 || index >= productImages.length) {
        return;
    }

    currentImageIndex = index;

    const counterElement = document.getElementById('gallery-counter');
    if (counterElement) {
        counterElement.textContent = `${index + 1} / ${productImages.length}`;
    }

    const imagesContainer = document.getElementById('product-images');
    if (!imagesContainer) {
        return;
    }

    const src = productImages[index];
    imagesContainer.innerHTML = '';

    if (src.match(/\.(mp4|webm)$/i)) {
        const video = document.createElement('video');
        video.controls = true;
        video.preload = 'metadata';
        video.className = 'video-player';
        const source = document.createElement('source');
        source.src = src;
        source.type = 'video/mp4';
        video.appendChild(source);
        imagesContainer.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Sản phẩm - Hình ${index + 1}`;
        img.className = 'product-image';
        img.width = 800;
        img.height = 600;
        img.decoding = 'async';
        img.fetchPriority = index === 0 ? 'high' : 'auto';
        img.onerror = function() {
            productImages.splice(index, 1);
            if (productImages.length > 0) {
                displayImage(index % productImages.length);
                createGalleryIndicators();
            } else {
                imagesContainer.innerHTML = '<p>Không có phương tiện.</p>';
            }
        };
        img.addEventListener('click', function() {
            openLightbox(src, `Sản phẩm - phương tiện ${index + 1}`);
        });
        imagesContainer.appendChild(img);
    }

    updateGalleryIndicators(index);
    scrollThumbnailIntoView(index);
}

function scrollThumbnailIntoView(index) {
    const indicatorsContainer = document.getElementById('gallery-indicators');
    const thumbnails = indicatorsContainer?.children;

    if (thumbnails && thumbnails[index]) {
        thumbnails[index].scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
        });
    }
}

function createGalleryIndicators() {
    const indicatorsContainer = document.getElementById('gallery-indicators');
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = '';

    if (productImages.length <= 1) {
        indicatorsContainer.style.display = 'none';
        return;
    }

    indicatorsContainer.style.display = 'flex';

    productImages.forEach((src, index) => {
        const thumbContainer = document.createElement('div');
        thumbContainer.className = 'thumb-container';

        if (src.match(/\.(mp4|webm)$/i)) {
            const badge = document.createElement('span');
            badge.className = 'thumb-video-badge';
            badge.textContent = '▶';
            badge.title = 'Video';
            thumbContainer.appendChild(badge);
            thumbContainer.addEventListener('click', () => displayImage(index));
            indicatorsContainer.appendChild(thumbContainer);
            return;
        }

        const thumb = document.createElement('img');
        thumb.dataset.fullSrc = src;
        thumb.dataset.loaded = 'false';
        thumb.alt = `Thumbnail ${index + 1}`;
        thumb.title = `Xem ảnh ${index + 1}`;
        thumb.width = 80;
        thumb.height = 80;
        thumb.loading = 'lazy';
        thumb.decoding = 'async';

        if (index === currentImageIndex) {
            thumb.classList.add('active');
        }

        thumb.addEventListener('click', () => displayImage(index));
        thumbContainer.appendChild(thumb);
        indicatorsContainer.appendChild(thumbContainer);
    });

    loadVisibleGalleryThumbs();
    setupGalleryThumbObserver();
}

let galleryThumbObserver = null;

function setupGalleryThumbObserver() {
    const indicatorsContainer = document.getElementById('gallery-indicators');
    if (!indicatorsContainer || galleryThumbObserver) {
        return;
    }

    galleryThumbObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadGalleryThumbImg(entry.target);
                }
            });
        },
        { root: indicatorsContainer, rootMargin: '80px' }
    );

    indicatorsContainer.querySelectorAll('img[data-full-src]').forEach((img) => {
        galleryThumbObserver.observe(img);
    });
}

function loadVisibleGalleryThumbs() {
    const indicatorsContainer = document.getElementById('gallery-indicators');
    if (!indicatorsContainer) return;

    indicatorsContainer.querySelectorAll('img[data-full-src]').forEach((img) => {
        const rect = img.getBoundingClientRect();
        const parentRect = indicatorsContainer.getBoundingClientRect();
        if (rect.right >= parentRect.left - 100 && rect.left <= parentRect.right + 100) {
            loadGalleryThumbImg(img);
        }
    });

    const active = indicatorsContainer.querySelector('img.active[data-full-src]');
    if (active) {
        loadGalleryThumbImg(active);
    }
}

function loadGalleryThumbImg(thumb) {
    if (thumb.dataset.loaded === 'true') {
        return;
    }
    thumb.dataset.loaded = 'true';
    thumb.src = getThumbUrl(thumb.dataset.fullSrc);
    thumb.onerror = function() {
        thumb.src = thumb.dataset.fullSrc;
    };
}

function updateGalleryIndicators(activeIndex) {
    const indicatorsContainer = document.getElementById('gallery-indicators');
    if (!indicatorsContainer) return;

    const thumbContainers = indicatorsContainer.children;

    for (let i = 0; i < thumbContainers.length; i++) {
        const thumb = thumbContainers[i].querySelector('img');
        if (thumb) {
            if (i === activeIndex) {
                thumb.classList.add('active');
                loadGalleryThumbImg(thumb);
            } else {
                thumb.classList.remove('active');
            }
        }
    }
}

function setupGalleryNavigation() {
    const prevButton = document.getElementById('gallery-prev');
    const nextButton = document.getElementById('gallery-next');

    if (prevButton) {
        prevButton.addEventListener('click', navigatePrevImage);
    }

    if (nextButton) {
        nextButton.addEventListener('click', navigateNextImage);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            navigatePrevImage();
        } else if (e.key === 'ArrowRight') {
            navigateNextImage();
        }
    });
}

function navigatePrevImage() {
    let newIndex = currentImageIndex - 1;
    if (newIndex < 0) {
        newIndex = productImages.length - 1;
    }
    displayImage(newIndex);
}

function navigateNextImage() {
    let newIndex = currentImageIndex + 1;
    if (newIndex >= productImages.length) {
        newIndex = 0;
    }
    displayImage(newIndex);
}

function displayProductVideos(product, container) {
    container.innerHTML = '';

    if (!product.videos || product.videos.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    product.videos.forEach((videoPath) => {
        const videoDiv = document.createElement('div');
        videoDiv.className = 'product-video';

        const video = document.createElement('video');
        video.controls = true;
        video.preload = 'metadata';
        video.className = 'video-player';

        video.onerror = function() {
            videoDiv.remove();
        };

        const source = document.createElement('source');
        source.src = videoPath;
        source.type = 'video/mp4';

        video.appendChild(source);
        video.appendChild(document.createTextNode('Trình duyệt của bạn không hỗ trợ xem video.'));
        videoDiv.appendChild(video);
        container.appendChild(videoDiv);
    });
}

function openLightbox(imageSrc, imageAlt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';

    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <img src="${imageSrc}" alt="${imageAlt}" width="1200" height="900" decoding="async">
        </div>
    `;

    document.body.appendChild(lightbox);

    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 50);

    const closeBtn = lightbox.querySelector('.close-lightbox');
    closeBtn.addEventListener('click', function() {
        lightbox.style.opacity = '0';
        setTimeout(() => lightbox.remove(), 300);
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.opacity = '0';
            setTimeout(() => lightbox.remove(), 300);
        }
    });
}
