const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function actualizarCarritoUI() {
    const lista = document.getElementById('carrito-lista');
    lista.innerHTML = '';

    carrito.forEach((item, index) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.backgroundColor = '#fff';
        li.style.marginBottom = '8px';
        li.style.padding = '8px 12px';
        li.style.borderRadius = '6px';
        li.style.borderLeft = '5px solid #a5a58d';

        li.textContent = `${item.nombre} - €${item.precio.toFixed(2)} x ${item.cantidad}`;

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.style.backgroundColor = '#e76f51';
        btnEliminar.style.border = 'none';
        btnEliminar.style.color = 'white';
        btnEliminar.style.borderRadius = '5px';
        btnEliminar.style.cursor = 'pointer';
        btnEliminar.style.padding = '5px 10px';
        btnEliminar.onclick = () => {
            eliminarDelCarrito(index);
        };

        li.appendChild(btnEliminar);
        lista.appendChild(li);
    });

    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    document.getElementById('carrito-total').textContent = `Total: €${total.toFixed(2)}`;

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(id, nombre, precio) {
    const index = carrito.findIndex(item => item.id === id);
    if (index > -1) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }
    actualizarCarritoUI();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', e => {
        const producto = e.target.closest('.producto');
        const id = Number(producto.getAttribute('data-id'));
        const nombre = producto.getAttribute('data-nombre');
        const precio = Number(producto.getAttribute('data-precio'));
        agregarAlCarrito(id, nombre, precio);
    });
});

document.getElementById('vaciar-carrito').addEventListener('click', () => {
    carrito.length = 0;
    actualizarCarritoUI();
});

const numeroWhatsApp = '34617379016'; // Cambia aquí por tu número real sin + ni espacios

document.getElementById('enviar-whatsapp').addEventListener('click', () => {
    if(carrito.length === 0) {
        alert('Tu cesta está vacía');
        return;
    }
    let mensaje = 'Hola, quiero hacer un pedido con los siguientes productos:%0A%0A';
    carrito.forEach(item => {
        mensaje += `${item.nombre} x${item.cantidad} - €${(item.precio * item.cantidad).toFixed(2)}%0A`;
    });
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    mensaje += `%0ATotal: €${total.toFixed(2)}%0AGracias!`;

    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
});

// Mostrar carrito al cargar la página
document.addEventListener('DOMContentLoaded', actualizarCarritoUI);

