// إدارة سلة التسوق
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// تحديث عرض السلة
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (checkoutBtn) checkoutBtn.disabled = true;
        cartItemsContainer.innerHTML = '<p id="empty-cart-message" class="empty-cart">سلة التسوق فارغة</p>';
        updateCartSummary();
        updateCartCount();
        return;
    }
    
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    let html = '';
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-price">${item.price} SAR</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" onclick="decreaseQuantity(${index})">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase" onclick="increaseQuantity(${index})">+</button>
                    </div>
                </div>
                <div class="cart-item-total">${itemTotal} SAR</div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})" title="إزالة المنتج">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    updateCartSummary();
    updateCartCount();
}

// تحديث ملخص الطلب
function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 100 ? 0 : 50; // شحن مجاني للطلبات فوق 100 ريال
    const total = subtotal + shipping;
    
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-price').textContent = `${subtotal} SAR`;
    document.getElementById('shipping').textContent = `${shipping} SAR`;
    document.getElementById('final-total').textContent = `${total} SAR`;
}

// تحديث عداد السلة
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        if (totalItems > 0) {
            cartCount.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// زيادة كمية المنتج
function increaseQuantity(index) {
    if (cart[index]) {
        cart[index].quantity++;
        saveCart();
        updateCartDisplay();
        showNotification('تم زيادة الكمية');
    }
}

// تقليل كمية المنتج
function decreaseQuantity(index) {
    if (cart[index] && cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCart();
        updateCartDisplay();
        showNotification('تم تقليل الكمية');
    } else {
        removeFromCart(index);
    }
}

// إزالة المنتج من السلة
function removeFromCart(index) {
    if (confirm('هل تريد إزالة هذا المنتج من السلة؟')) {
        const removedItem = cart.splice(index, 1)[0];
        saveCart();
        updateCartDisplay();
        showNotification(`تم إزالة ${removedItem.name} من السلة`, 'error');
    }
}

// حفظ السلة في localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// إظهار الإشعارات
function showNotification(message, type = 'success') {
    // إزالة أي إشعارات سابقة
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // إنشاء الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // إزالة تلقائية بعد 3 ثوان
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// إعداد زر اتمام الطلب
function setupCheckoutButton() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('السلة فارغة، أضف منتجات أولاً', 'error');
                return;
            }
            
            // تحويل إلى صفحة الدفع
            window.location.href = 'checkout.html';
        });
    }
}

// القائمة الجانبية للجوال
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sideNav = document.querySelector('.side-nav');
    const overlay = document.querySelector('.overlay');
    
    if (menuToggle && !sideNav) {
        // إنشاء القائمة الجانبية إذا لم تكن موجودة
        const sideNavHTML = `
            <div class="side-nav" id="sideNav">
                <a href="index.html">الرئيسية</a>
                <a href="features.html">المميزات</a>
                <a href="shr7.html">العرض الواقعي</a>
                <a href="about.html">عن مُـخـتـلـف</a>
                <a href="faq.html">الأسئلة الشائعة</a>
                <a href="cart.html">سلة التسوق</a>
            </div>
            <div class="overlay" id="overlay" onclick="toggleMenu()"></div>
        `;
        document.body.insertAdjacentHTML('beforeend', sideNavHTML);
        
        // إعادة تعيين المتغيرات
        const newSideNav = document.getElementById('sideNav');
        const newOverlay = document.getElementById('overlay');
        
        menuToggle.addEventListener('click', function() {
            newSideNav.classList.toggle('active');
            newOverlay.classList.toggle('active');
            document.body.style.overflow = newSideNav.classList.contains('active') ? 'hidden' : '';
        });
        
        // إغلاق القائمة عند النقر على الروابط
        newSideNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                newSideNav.classList.remove('active');
                newOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// زر الرجوع للأعلى
function setupBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.innerHTML = '↑';
    backToTop.title = 'الرجوع للأعلى';
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    setupCheckoutButton();
    setupMobileMenu();
    setupBackToTop();
    
    // تحديث تلقائي كل ثانية (للتزامن بين الصفحات)
    setInterval(updateCartCount, 1000);
});

// السماح باستدعاء الدوال من الكونسول
window.updateCartDisplay = updateCartDisplay;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeFromCart = removeFromCart;
window.toggleMenu = function() {
    const sideNav = document.getElementById('sideNav');
    const overlay = document.getElementById('overlay');
    if (sideNav && overlay) {
        sideNav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sideNav.classList.contains('active') ? 'hidden' : '';
    }
};