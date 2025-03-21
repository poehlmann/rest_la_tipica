$(document).ready(function () {
    $('.carousel').slick({
        dots: true,
        arrows: true,
    });

    const wishlist = [];
    let pendingOrders = JSON.parse(localStorage.getItem('pendingOrders')) || [];

    function updateWishlist() {
        const $wishlistItems = $('#wishlist-items');
        const $wishlistTotal = $('#wishlist-total');
        $wishlistItems.empty();
        let total = 0;

        wishlist.forEach(item => {
            total += item.price;
            $wishlistItems.append(
                `<li>${item.name} - $${item.price.toFixed(2)} <button class="remove-item" data-id="${item.id}">Eliminar</button></li>`
            );
        });

        $wishlistTotal.text(total.toFixed(2));
    }

    function updatePendingOrders() {
        const $pendingOrdersList = $('#pending-orders-list');
        $pendingOrdersList.empty();

        pendingOrders.forEach((order, index) => {
            $pendingOrdersList.append(
                `<li>
          Orden ${index + 1}: ${order.items.map(item => item.name).join(', ')} - Total: $${order.total.toFixed(2)}
          <button class="remove-order" data-index="${index}">Eliminar</button>
        </li>`
            );
        });

        // Guardar las órdenes pendientes en localStorage
        localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
    }

    $('body').on('click', '.wishlist-add', function () {
        const $card = $(this).closest('.card');
        const id = $card.data('id');
        const name = $card.data('name');
        const price = parseFloat($card.data('price'));

        wishlist.push({ id, name, price });
        updateWishlist();
    });

    $('body').on('click', '.remove-item', function () {
        const id = $(this).data('id');
        const index = wishlist.findIndex(item => item.id === id);

        if (index > -1) {
            wishlist.splice(index, 1);
            updateWishlist();
        }
    });

    $('#wishlist-clear').click(function () {
        wishlist.length = 0;
        updateWishlist();
    });

    $('#wishlist-order').click(function () {
        if (wishlist.length === 0) return;

        const total = wishlist.reduce((sum, item) => sum + item.price, 0);
        pendingOrders.push({ items: [...wishlist], total });

        wishlist.length = 0;
        updateWishlist();
        updatePendingOrders();
    });

    $('body').on('click', '.remove-order', function () {
        const index = $(this).data('index');
        if (index > -1) {
            pendingOrders.splice(index, 1);
            updatePendingOrders();
        }
    });

    $('body').on('click', '.share', function () {
        const $card = $(this).closest('.card');
        const name = $card.data('name');
        const price = parseFloat($card.data('price'));
        const message = `¡Mira este plato de La Típica! ${name} por $${price.toFixed(2)}`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });

    // Cargar órdenes pendientes desde localStorage al cargar la página
    updatePendingOrders();
});
