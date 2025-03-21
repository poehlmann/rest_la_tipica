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

    function updateWishlist() {
        const $wishlistItems = $('#wishlist-items');
        const $wishlistTotal = $('#wishlist-total');
        $wishlistItems.empty();
        let total = 0;

        wishlist.forEach(item => {
            total += item.price;
            $wishlistItems.append(
                `<li>${item.name} - $${item.price.toFixed(2)} <button class="remove-item" data-id="${item.id}">X</button></li>`
            );
        });

        $wishlistTotal.text(total.toFixed(2));
    }

    function updatePendingOrders() {
        const $pendingOrdersList = $('#pending-orders-list');
        $pendingOrdersList.empty();

        pendingOrders.forEach((order, index) => {
            $pendingOrdersList.append(
                `<li>Orden ${index + 1}: ${order.items.map(item => item.name).join(', ')} <br> Total: $${order.total.toFixed(2)} <button class="delete-order" data-index="${index}">Eliminar</button></li>`
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
        }
    });

    $('body').on('click', '.delete-order', function() {
        const index = $(this).data('index');
        pendingOrders.splice(index, 1);
        updatePendingOrders();
    });

    $('#floating-menu').click(function() {
        $('.wishlist, .pending-orders').toggle();
    });

    const elemento = document.getElementById('pending-orders');
    let offsetX, offsetY;
    let arrastrando = false;

    elemento.addEventListener('mousedown', (e) => {
        arrastrando = true;
        offsetX = e.clientX - elemento.offsetLeft;
        offsetY = e.clientY - elemento.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!arrastrando) return;
        elemento.style.left = e.clientX - offsetX + 'px';
        elemento.style.top = e.clientY - offsetY + 'px';
    });

    document.addEventListener('mouseup', () => {
        arrastrando = false;
    });

    updatePendingOrders();
});
