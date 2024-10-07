
document.addEventListener('DOMContentLoaded', () => {
    const filtrosDiv = document.getElementById('filtros');
    const productosDiv = document.getElementById('productos');

    // Función para generar las tarjetas de productos
    const mostrarProductos = (productos) => {
        productosDiv.innerHTML = ''; // Limpiar productos anteriores

        productos.forEach(producto => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4');
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.title}</h5>
                        <p class="card-text">${producto.description.substring(0, 100)}...</p>
                        <p class="card-text"><strong>Price:</strong> $${producto.price}</p>
                        <button class="btn btn-success w-100">Agregar</button>
                    </div>
                </div>
            `;
            productosDiv.appendChild(card);

            // Botón "Agregar" para enviar la petición POST
            const agregarButton = card.querySelector('button');
            agregarButton.addEventListener('click', () => agregarProducto(producto));
        });
    };

    // Función para hacer la petición POST al agregar el producto
    const agregarProducto = (producto) => {
        fetch('https://fakestoreapi.com/carts', {
            method: 'POST',
            body: JSON.stringify({
                userId: 1, // Asumimos un userId estático para este ejemplo
                date: new Date().toISOString(),
                products: [{ productId: producto.id, quantity: 1 }]
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Producto agregado:', data);
            alert('Producto agregado con éxito');
        })
        .catch(error => console.error('Error al agregar el producto:', error));
    };

    // Función para obtener productos por categoría
    const obtenerProductosPorCategoria = (categoria) => {
        fetch(`https://fakestoreapi.com/products/category/${categoria}`)
            .then(response => response.json())
            .then(productos => mostrarProductos(productos))
            .catch(error => console.error('Error al obtener productos:', error));
    };

    // Función para obtener las categorías y crear los botones
    fetch('https://fakestoreapi.com/products/categories')
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category;
                button.classList.add('btn', 'btn-outline-primary', 'm-2');
                filtrosDiv.appendChild(button);

                // Agregar evento de clic a cada botón
                button.addEventListener('click', () => {
                    obtenerProductosPorCategoria(category);
                });
            });
        })
        .catch(error => console.error('Error al obtener las categorías:', error));
});

// Esperar a que el documento esté cargado
document.addEventListener("DOMContentLoaded", () => {
    // Obtener el botón del carrito
    const carritoButton = document.getElementById("btnCarrito");

    // Asignar el evento de clic para redirigir
    carritoButton.addEventListener("click", () => {
        // Redirigir a la página del carrito
        window.location.href = "carrito.html";
    });
});


// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Obtener todos los enlaces "Ver" usando la clase común "ver-pedido"
    const verPedidoLinks = document.querySelectorAll(".ver-pedido");

    // Asignar un evento de clic a cada enlace "Ver"
    verPedidoLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            // Prevenir el comportamiento predeterminado del enlace
            event.preventDefault();

            // Obtener el número de pedido desde el atributo data-pedido
            const numeroPedido = event.target.getAttribute("data-pedido");

            // Redirigir a la página de detalle del pedido
            window.location.href = `pedido.html?pedido=${numeroPedido}`;
        });
    });
});
/*
document.addEventListener('DOMContentLoaded', function () {
    const btnCarrito = document.getElementById('btnCarrito');

    // Maneja el evento de clic en el botón "Carrito"
    btnCarrito.addEventListener('click', function (event) {
        event.preventDefault();

        // Realiza la solicitud a la API de carrito (usando el id 5 como ejemplo)
        fetch('https://fakestoreapi.com/carts/user/2')
            .then(res => res.json())
            .then(json => {
                // Guarda los detalles del pedido en localStorage para mostrarlos en la otra página
                localStorage.setItem('pedidoDetalles', JSON.stringify(json));
                
                // Redirecciona a la página de carrito (carrito.html)
                window.location.href = 'carrito.html';
            })
            .catch(error => {
                console.error('Error al obtener los detalles del carrito:', error);
            });
    });
});

*/

 // Referencia al botón del carrito y contenedor de datos
 const btnCarrito = document.getElementById('btnCarrito');
 const carritoContainer = document.getElementById('carrito');
 const carritoItems = document.getElementById('carritoItems');

 // Función para consumir la API y obtener los datos del carrito
 btnCarrito.addEventListener('click', (e) => {
     e.preventDefault(); // Prevenir la recarga de la página
     fetch('https://fakestoreapi.com/carts/user/2')
         .then(res => res.json())
         .then(data => {
             // Limpiar lista de productos antes de agregar nuevos
             carritoItems.innerHTML = '';

             // Mostrar la sección de carrito
             carritoContainer.style.display = 'block';

             // Iterar sobre cada carrito y sus productos
             data.forEach(cart => {
                 // Agregar el título del pedido
                 const pedidoTitulo = document.createElement('li');
                 pedidoTitulo.classList.add('list-group-item', 'list-group-item-primary', 'fw-bold');
                 pedidoTitulo.textContent = `Pedido ID: ${cart.id} | Usuario: ${cart.userId} | Fecha: ${cart.date}`;
                 carritoItems.appendChild(pedidoTitulo);

                 // Iterar sobre cada producto del carrito
                 cart.products.forEach(product => {
                     const productoItem = document.createElement('li');
                     productoItem.classList.add('list-group-item');
                     productoItem.textContent = `Producto ID: ${product.productId} | Cantidad: ${product.quantity}`;
                     carritoItems.appendChild(productoItem);
                 });
             });
         })
         .catch(err => console.error('Error al obtener el carrito:', err));
 });

document.addEventListener('DOMContentLoaded', function () {
    // Obtener los detalles del pedido almacenados en localStorage
    const pedidoDetalles = JSON.parse(localStorage.getItem('pedidoDetalles'));
    const pedidoTabla = document.getElementById('pedidoDetalles');

    // Si hay detalles, muestra la información
    if (pedidoDetalles) {
        pedidoDetalles.products.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.productId}</td>
                <td>${producto.quantity}</td>
            `;
            pedidoTabla.appendChild(row);
        });
    } else {
        // Muestra un mensaje si no hay detalles de pedido disponibles
        pedidoTabla.innerHTML = '<tr><td colspan="2" class="text-center">No hay detalles del pedido disponibles.</td></tr>';
    }
});



