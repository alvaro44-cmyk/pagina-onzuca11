// Menú responsive
function toggleMenu() {
    const menu = document.getElementById("nav-menu");
    menu.classList.toggle("show");
}

// Comentarios con persistencia en localStorage
const comentariosKey = "comentarios";

function cargarComentarios() {
    const comentarios = JSON.parse(localStorage.getItem(comentariosKey)) || [];
    const listaComentarios = document.getElementById("listaComentarios");
    listaComentarios.innerHTML = "";
    comentarios.forEach(({nombre, comentario}) => {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${nombre}:</strong> ${comentario}`;
        listaComentarios.appendChild(p);
    });
}

function agregarComentario() {
    const nombreInput = document.getElementById("nombre");
    const comentarioInput = document.getElementById("comentario");
    const nombre = nombreInput.value.trim();
    const comentario = comentarioInput.value.trim();

    if (!nombre || !comentario) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const comentarios = JSON.parse(localStorage.getItem(comentariosKey)) || [];
    comentarios.push({ nombre, comentario });
    localStorage.setItem(comentariosKey, JSON.stringify(comentarios));

    cargarComentarios();

    nombreInput.value = "";
    comentarioInput.value = "";
}

// Carrito mejorado con cantidades y persistencia
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarAlCarrito(nombre, precio) {
    const index = carrito.findIndex(item => item.nombre === nombre);
    if (index !== -1) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    guardarYMostrarCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarYMostrarCarrito();
}

function actualizarCantidad(index, cantidad) {
    if (cantidad <= 0) {
        eliminarDelCarrito(index);
    } else {
        carrito[index].cantidad = cantidad;
        guardarYMostrarCarrito();
    }
}

function vaciarCarrito() {
    if (carrito.length === 0) {
        alert("El carrito ya está vacío.");
        return;
    }
    if (confirm("¿Seguro que quieres vaciar el carrito?")) {
        carrito = [];
        guardarYMostrarCarrito();
    }
}

function mostrarCarrito() {
    const lista = document.getElementById("carrito-lista");
    const totalElem = document.getElementById("carrito-total");
    lista.innerHTML = "";
    let totalCompra = 0;

    carrito.forEach((item, index) => {
        const li = document.createElement("li");
        const subtotal = item.precio * item.cantidad;
        li.innerHTML = `
            ${item.nombre} - €${item.precio.toFixed(2)} x 
            <input type="number" min="1" value="${item.cantidad}" style="width: 50px;" onchange="actualizarCantidad(${index}, parseInt(this.value))" />
            = €${subtotal.toFixed(2)}
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        lista.appendChild(li);
        totalCompra += subtotal;
    });

    totalElem.textContent = totalCompra.toFixed(2);
}

function guardarYMostrarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

// Enviar por WhatsApp con cantidades y total
function enviarPorWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let mensaje = "Hola, quiero comprar:\n\n";
    let total = 0;

    carrito.forEach(producto => {
        mensaje += `- ${producto.nombre} x${producto.cantidad} (€${producto.precio.toFixed(2)} cada uno)\n`;
        total += producto.precio * producto.cantidad;
    });

    mensaje += `\nTotal: €${total.toFixed(2)}\n\nGracias por tu atención!`;

    let numeroWhatsApp = "617379016"; // Número con prefijo internacional
    let url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarComentarios();
    mostrarCarrito();
});
