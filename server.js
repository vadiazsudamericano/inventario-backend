const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- BASE DE DATOS SIMULADA (En memoria) ---
let productos = [
    { id: 1, producto: 'Laptop Dell', stock: 10, precio: 850.00, categoria: 'Electrónica', fecha: new Date() },
    { id: 2, producto: 'Teclado Mecánico', stock: 25, precio: 45.50, categoria: 'Accesorios', fecha: new Date() },
    { id: 3, producto: 'Monitor 24"', stock: 15, precio: 180.00, categoria: 'Electrónica', fecha: new Date() }
];

// Historial inicial para "Actividad Reciente"
let historial = [
    { fecha: new Date(), accion: 'Sistema iniciado', detalle: 'Backend operativo en puerto 3000' },
    { fecha: new Date(), accion: 'Sincronización', detalle: 'Inventario cargado desde memoria RAM' }
];

// --- ENDPOINTS PARA PRODUCTOS ---

// 1. Obtener todos los productos
app.get('/api/items', (req, res) => {
    console.log(">>> Solicitando productos desde la interfaz...");
    res.json(productos);
});

// 2. Agregar un producto
app.post('/api/items', (req, res) => {
    const nuevoProducto = {
        id: Date.now(),
        producto: req.body.producto,
        stock: Number(req.body.stock),
        precio: Number(req.body.precio),
        categoria: req.body.categoria,
        fecha: new Date()
    };
    productos.push(nuevoProducto);
    
    // Agregamos el evento al historial dinámicamente
    historial.unshift({
        fecha: new Date(),
        accion: 'Producto Agregado',
        detalle: `Se añadió ${nuevoProducto.producto} al almacén.`
    });

    console.log("✅ Producto agregado y registrado en historial:", nuevoProducto.producto);
    res.status(201).json(nuevoProducto);
});

// 3. Eliminar un producto
app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const productoAEliminar = productos.find(p => p.id === Number(id));
    
    productos = productos.filter(p => p.id !== Number(id));

    if (productoAEliminar) {
        historial.unshift({
            fecha: new Date(),
            accion: 'Producto Eliminado',
            detalle: `Se quitó ${productoAEliminar.producto} del sistema.`
        });
    }

    console.log(`🗑️ Producto con ID ${id} eliminado.`);
    res.json({ ok: true });
});

// --- ENDPOINT PARA ACTIVIDAD RECIENTE ---

app.get('/api/historial', (req, res) => {
    console.log(">>> Enviando historial a la columna derecha...");
    res.json(historial);
});

// --- INICIO DEL SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`🚀 BACKEND COMPLETO Y SIMULADO`);
    console.log(`📍 API PRODUCTOS: http://localhost:${PORT}/api/items`);
    console.log(`📍 API HISTORIAL: http://localhost:${PORT}/api/historial`);
    console.log(`==========================================`);
});