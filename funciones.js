$(document).ready(function() {
    $('.carousel').slick({
        dots: true,
        arrows: true,
        slidesToShow: 3,
        infinite: true,
        slidesToScroll: 3,
        // responsive: [
        //     {
        //         breakpoint: 1024,
        //         settings: {
        //             slidesToShow: 3,
        //             slidesToScroll: 3,
        //             infinite: true,
        //             dots: true
        //         }
        //     },
        //     {
        //         breakpoint: 600,
        //         settings: {
        //             slidesToShow: 2,
        //             slidesToScroll: 2
        //         }
        //     },
        //     {
        //         breakpoint: 480,
        //         settings: {
        //             slidesToShow: 3,
        //             slidesToScroll: 3
        //         }
        //     }
        //     ]
    });


    const wishlist = [];
    const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders')) || [];
    const order = document.getElementById('wishlist');
    const pending = document.getElementById('pending-orders');
    function updateWishlist() {
        const $wishlistItems = $('#wishlist-items');
        const $wishlistTotal = $('#wishlist-total');
        $wishlistItems.empty();
        let total = 0;

        wishlist.forEach(item => {
            total += item.price;
            $wishlistItems.append(
                `<li >${item.name} - ${item.price.toFixed(2)} Bs. <button class="remove-item" data-id="${item.id}">X</button></li>`
            );
        });

        $wishlistTotal.text(total.toFixed(2));
    }

    function updatePendingOrders() {
        const $pendingOrdersList = $('#pending-orders-list');
        $pendingOrdersList.empty();

        pendingOrders.forEach((order, index) => {
            $pendingOrdersList.append(
                `<li class="order-total">Orden ${index + 1}: ${order.items.map(item => item.name).join(', ')} <br> Total: ${order.total.toFixed(2)} Bs. <button class="delete-order" data-index="${index}">Eliminar</button></li>`
            );
        });
        localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
    }

    $('body').on('click', '.wishlist-add', function() {
        const $card = $(this).closest('.card');
        const id = $card.data('id');
        const name = $card.data('name');
        const price = parseFloat($card.data('price'));

        wishlist.push({ id, name, price });
        updateWishlist();
        if (order.style.display === "none" || order.style.display === "") {
            order.style.display = "block";
            pending.style.display = "none";
        }
    });

    $('body').on('click', '.remove-item', function() {
        const id = $(this).data('id');
        const index = wishlist.findIndex(item => item.id === id);

        if (index > -1) {
            wishlist.splice(index, 1);
            updateWishlist();
        }
    });

    $('#wishlist-clear').click(function() {
        wishlist.length = 0;
        updateWishlist();
    });

    $('#wishlist-order').click(function() {
        if (wishlist.length > 0) {
            const total = wishlist.reduce((sum, item) => sum + item.price, 0);
            pendingOrders.push({ items: [...wishlist], total });
            wishlist.length = 0;
            updateWishlist();
            updatePendingOrders();
            if (pending.style.display === "none" || pending.style.display === "") {
                pending.style.display = "block";
                order.style.display = "none";
            } else {
                pending.style.display = "none";
            }
        }
    });

    $('body').on('click', '.delete-order', function() {
        const index = $(this).data('index');
        pendingOrders.splice(index, 1);
        updatePendingOrders();
    });

    $('#floating-menu').click(function() {
        if (order.style.display === "none" || order.style.display === "") {
            order.style.display = "block";
            pending.style.display = "none";
        } else {
            order.style.display = "none";
        }
    });

    $('#floating-pending').click(function() {
        if (pending.style.display === "none" || pending.style.display === "") {
            pending.style.display = "block";
            order.style.display = "none";
        } else {
            pending.style.display = "none";
        }
    });

    $('body').on('click', '.share', function () {
        const $card = $(this).closest('.card');
        const name = $card.data('name');
        const price = parseFloat($card.data('price'));
        const message = `¡Mira este plato de La Típica! ${name} por ${price.toFixed(2)} Bs.`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });



    updatePendingOrders();


});
document.addEventListener('DOMContentLoaded', function () {
    const userPopup = document.getElementById('user-popup');
    const userSelector = document.getElementById('user-selector');
    const confirmUserButton = document.getElementById('confirm-user');
    const totalAmount = document.getElementById('total-amount');
    const qrPopup = document.getElementById('qr-popup');
    const qrCloseButton = document.getElementById('close-qr');
    const qrImage = document.getElementById('qr-image');

    // Mostrar popup de usuario si no hay usuario seleccionado
    const selectedUser = localStorage.getItem('selectedUser');
    if (!selectedUser) {
        userPopup.style.display = 'flex';
    }else{
        userPopup.style.display = 'none';
    }

    confirmUserButton.addEventListener('click', function () {
        const selectedValue = userSelector.value;
        if (selectedValue) {
            localStorage.setItem('selectedUser', selectedValue);
            userPopup.style.display = 'none';
        } else {
            alert('Por favor seleccione un usuario.');
        }
    });

    // Mostrar popup de QR al eliminar orden
    function showQrPopup(detail_order) {
        totalAmount.textContent =detail_order;
        qrPopup.style.display = 'flex';
    }

    qrCloseButton.addEventListener('click', function () {
        qrPopup.style.display = 'none';
    });

    // Ejemplo: Simular eliminación de una orden
    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-order')) {
            const parentLi = event.target.closest("li");
            const clone = parentLi.cloneNode(true);
            clone.querySelector("button").remove();
            const liText = clone.textContent.trim();
            console.log("Texto al lado del botón:", liText);

            showQrPopup(liText);
        }
    });

    // Guardar pagos en cookies
    function saveToCookies(order) {
        const orders = JSON.parse(getCookie('orders') || '[]');
        orders.push(order);
        document.cookie = `orders=${JSON.stringify(orders)}; path=/;`;
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
});
