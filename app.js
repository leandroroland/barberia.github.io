// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAWEsuSooSeERDySTu_LQFD082Yy1puDvc",
    authDomain: "genesis-barbers-database.firebaseapp.com",
    projectId: "genesis-barbers-database",
    storageBucket: "genesis-barbers-database.appspot.com",
    messagingSenderId: "684136841153",
    appId: "1:684136841153:web:dca24861f4579fc9637940
    measurementId: "G-51MVXZWPDN""
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Referencias al DOM
const servicioForm = document.getElementById('servicio-form');
const serviciosLista = document.getElementById('servicios-lista');
const ventasLista = document.getElementById('ventas-lista');
const agregarVentaBtn = document.getElementById('agregar-venta');

// Agregar Servicio
if (servicioForm) {
    servicioForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const precio = document.getElementById('precio').value;

        db.collection('servicios').add({
            nombre: nombre,
            precio: precio
        }).then(() => {
            servicioForm.reset();
        });
    });
}

// Mostrar Servicios
if (serviciosLista) {
    db.collection('servicios').onSnapshot(snapshot => {
        serviciosLista.innerHTML = '';
        snapshot.forEach(doc => {
            const servicio = doc.data();
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
            ${servicio.nombre} - $${servicio.precio}
            <span>
            <button class="btn btn-warning btn-sm" onclick="editarServicio('${doc.id}', '${servicio.nombre}', ${servicio.precio})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarServicio('${doc.id}')">Eliminar</button>
            </span>
            `;
            serviciosLista.appendChild(li);
        });
    });
}

// Editar Servicio
function editarServicio(id, nombre, precio) {
    const nuevoNombre = prompt('Nuevo nombre del servicio:', nombre);
    const nuevoPrecio = prompt('Nuevo precio del servicio:', precio);

    if (nuevoNombre && nuevoPrecio) {
        db.collection('servicios').doc(id).update({
            nombre: nuevoNombre,
            precio: nuevoPrecio
        });
    }
}

// Eliminar Servicio
function eliminarServicio(id) {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
        db.collection('servicios').doc(id).delete();
    }
}

// Registrar Venta
if (agregarVentaBtn) {
    agregarVentaBtn.addEventListener('click', () => {
        const servicioNombre = prompt('Nombre del servicio vendido:');
        const servicioPrecio = prompt('Precio del servicio vendido:');

        if (servicioNombre && servicioPrecio) {
            db.collection('ventas').add({
                nombre: servicioNombre,
                precio: servicioPrecio,
                fecha: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    });
}

// Mostrar Ventas
if (ventasLista) {
    db.collection('ventas').orderBy('fecha', 'desc').onSnapshot(snapshot => {
        ventasLista.innerHTML = '';
        snapshot.forEach(doc => {
            const venta = doc.data();
            const tr = document.createElement('tr');
            const fecha = new Date(venta.fecha.seconds * 1000);
            tr.innerHTML = `
            <td>${fecha.toLocaleDateString()}</td>
            <td>${venta.nombre}</td>
            <td>$${venta.precio}</td>
            `;
            ventasLista.appendChild(tr);
        });
    });
}
