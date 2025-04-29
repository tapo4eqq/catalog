const products = [
    {
        id: 1,
        name: "RTX 3070",
        price: 156000,
        category: "videocard",
        description: "Palit GeForce RTX 3060 Dual PCI-E 12288Mb GDDR6",
        image: "https://via.placeholder.com/200x180?text=RTX+3070"
    },
    {
        id: 2,
        name: "Intel i3-4130",
        price: 56000,
        category: "processor",
        description: "Intel Core i3-4130 3.4GHz 3Mb 2xDDR3-1600",
        image: "https://via.placeholder.com/200x180?text=i3-4130"
    },
    {
        id: 3,
        name: "Intel i5-13400F",
        price: 67000,
        category: "processor",
        description: "Процессор Intel Core i5-13400F OEM",
        image: "https://via.placeholder.com/200x180?text=i5-13400F"
    },
    {
        id: 4,
        name: "AMD Ryzen 7 5700X",
        price: 45000,
        category: "processor",
        description: "Процессор AMD Ryzen 7 5700X OEM",
        image: "https://via.placeholder.com/200x180?text=Ryzen+7+5700X"
    },
    {
        id: 5,
        name: "RTX 2060",
        price: 70000,
        category: "videocard",
        description: "Видеокарта GIGABYTE GeForce RTX 2060 D6 6G",
        image: "https://via.placeholder.com/200x180?text=RTX+2060"
    },
    {
        id: 6,
        name: "RTX 2080 Ti",
        price: 90000,
        category: "videocard",
        description: "MSI GeForce RTX 2080 Ti 11264MB 352bit GDDR6",
        image: "https://via.placeholder.com/200x180?text=RTX+2080+Ti"
    },
    {
        id: 7,
        name: "Kingston FURY DDR5 32GB",
        price: 15000,
        category: "memory",
        description: "Оперативная память Kingston FURY Beast Black 32 ГБ",
        image: "https://via.placeholder.com/200x180?text=Kingston+32GB"
    },
    {
        id: 8,
        name: "Kingston FURY DDR5 64GB",
        price: 30000,
        category: "memory",
        description: "Оперативная память Kingston FURY Beast Black 64 ГБ",
        image: "https://via.placeholder.com/200x180?text=Kingston+64GB"
    }
];

// Корзина
let cart = [];

// Загрузка страницы
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupEventListeners();
});

// Рендер товаров
function renderProducts(filter = 'all') {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.dataset.category = product.category;
        
        productElement.innerHTML = `
            <img src="" alt="${product.name}" class="product-img">
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${product.price} руб.</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" data-id="${product.id}">В корзину</button>
            </div>
        `;
        
        productsContainer.appendChild(productElement);
    });
}

// Название категории
function getCategoryName(category) {
    switch(category) {
        case 'videocard': return 'Видеокарта';
        case 'processor': return 'Процессор';
        case 'memory': return 'Оперативная память';
        default: return '';
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Фильтрация товаров
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderProducts(this.dataset.category);
        });
    });
    
    // Добавление в корзину
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });
    
    // Открытие/закрытие корзины
    document.querySelector('.cart-btn').addEventListener('click', function() {
        document.querySelector('.cart-content').classList.toggle('hidden');
    });
    
    // Оформление заказа
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        alert('Заказ оформлен! Спасибо за покупку!');
        cart = [];
        updateCart();
    });
}

// Добавление в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}

// Обновление корзины
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    let count = 0;
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        count += item.quantity;
        
        itemElement.innerHTML = `
            <div>${item.name} x${item.quantity}</div>
            <div>${itemTotal} руб.</div>
            <button class="remove-item" data-id="${item.id}">×</button>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            removeFromCart(productId);
        });
    });
    
    cartCount.textContent = count;
    cartTotal.textContent = total;
}

// Новая функция для удаления товара из корзины
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        updateCart();
        showCartNotification('Товар удален из корзины');
    }
}

// Модифицируем функцию уведомления
function showCartNotification(message = 'Товар добавлен в корзину!') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    // ... остальной код функции без изменений
}
// Уведомление о добавлении в корзину
function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = 'Товар добавлен в корзину!';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#09a11d';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.animation = 'fadeIn 0.5s';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2000);
}
// Отмена заказа
document.querySelector('.cancel-btn').addEventListener('click', function() {
    if (cart.length > 0) {
        if (confirm('Вы уверены, что хотите отменить заказ и очистить корзину?')) {
            cart = [];
            updateCart();
            alert('Заказ отменен, корзина очищена');
        }
    } else {
        alert('Корзина уже пуста');
    }
});