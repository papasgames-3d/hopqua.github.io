// Phân trang cho sản phẩm nổi bật theo mùa
const productsPerPage = 12;
let currentPage = 1;
let featuredProducts = [];

function renderPage(page) {
    currentPage = page;
    const productListElement = document.getElementById('product-list');
    const paginationElement = document.getElementById('pagination');
    if (!featuredProducts.length) return;

    const startIdx = (currentPage - 1) * productsPerPage;
    const endIdx = startIdx + productsPerPage;
    const productsToShow = featuredProducts.slice(startIdx, endIdx);

    productListElement.innerHTML = '';
    displayProducts(productListElement, productsToShow, startIdx);
    renderPagination(paginationElement, featuredProducts.length, currentPage, productsPerPage);

    const featuredSection = document.querySelector('.featured-products');
    if (featuredSection) {
        featuredSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function renderPagination(container, totalProducts, page, perPage) {
    const totalPages = Math.ceil(totalProducts / perPage);
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-btn${i === page ? ' active' : ''}" onclick="renderPage(${i})">${i}</button> `;
    }
    container.innerHTML = html;
}

window.renderPage = renderPage;

document.addEventListener('DOMContentLoaded', function() {
    const productListElement = document.getElementById('product-list');

    if (productListElement) {
        featuredProducts = getFeaturedProducts(9999);
        renderPage(1);

        if (featuredProducts[0] && featuredProducts[0].thumbnail) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = getThumbUrl(featuredProducts[0].thumbnail);
            document.head.appendChild(link);
        }
    }
});

function displayProducts(container, productsToDisplay, globalStartIndex = 0) {
    const productsToShow = productsToDisplay || getAllProducts();

    productsToShow.forEach((product, localIndex) => {
        const globalIndex = globalStartIndex + localIndex;
        const cardThumb = getThumbUrl(product.thumbnail);
        const isPriority = globalIndex < 4;

        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        if (product.season) {
            productCard.classList.add(`season-${product.season.replace(/\s+/g, '-')}`);
        }

        const thumbnails = getProductThumbnailImages(product);
        const thumbnailsHtml = thumbnails
            .map((src) => {
                const thumbSrc = getThumbUrl(src);
                return `<img src="${thumbSrc}" alt="" width="50" height="50" loading="lazy" decoding="async" aria-hidden="true">`;
            })
            .join('');

        const seasonBadge = product.season
            ? `<span class="season-badge season-${product.season.replace(' ', '-')}">${product.season === 'trung thu' ? 'Trung Thu' : 'Tết'}</span>`
            : '';

        const loadingAttr = isPriority ? 'eager' : 'lazy';
        const fetchPriority = isPriority ? ' fetchpriority="high"' : '';

        productCard.innerHTML = `
            <a href="product.html?id=${product.id}">
                <div class="product-image-container">
                    <img src="${cardThumb}" alt="${product.name}" width="400" height="320" loading="${loadingAttr}" decoding="async"${fetchPriority} onerror="this.onerror=null; this.src='${product.thumbnail}';">
                    ${seasonBadge}
                </div>
                <div class="product-thumbnails" aria-hidden="true">
                    ${thumbnailsHtml}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">${product.price}</p>
                    <p class="product-short-desc">${product.description.substring(0, 80)}${product.description.length > 80 ? '...' : ''}</p>
                </div>
            </a>
        `;

        container.appendChild(productCard);
    });
}

function getProductThumbnailImages(product) {
    const gallery = getProductGalleryImages(product.id);
    if (gallery.length >= 2) {
        return gallery.slice(0, 3);
    }
    return [product.thumbnail];
}
