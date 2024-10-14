const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Esto sirve para servir archivos estáticos como los HTML, CSS, JS

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Reemplaza con tu usuario de MySQL
    password: '123456789', // Reemplaza con tu contraseña de MySQL
    database: 'login_db' // Reemplaza con tu nombre de base de datos
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});
app.get('/test', (req, res) => {
    console.log('El servidor funciona correctamente');
});
// Ruta para el login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else if (result.length > 0) {
            const user = result[0]; // Obtener el primer usuario que coincide
            res.json({ success: true, role: user.role }); // Devolver el rol del usuario
        } else {
            res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    });
});

// Ruta para agregar un nuevo usuario
app.post('/addUser', (req, res) => {
    const { username, password, role } = req.body;
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, password, role], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar usuario' });
        } else {
            res.json({ success: true, message: 'Usuario agregado exitosamente' });
        }
    });
});

// Ruta para modificar un usuario
app.put('/editUser', (req, res) => {
    const { id, username, password, role } = req.body;
    const query = 'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?';
    db.query(query, [username, password, role, id], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al modificar usuario' });
        } else {
            res.json({ success: true, message: 'Usuario modificado exitosamente' });
        }
    });
});

// Ruta para obtener el horario general
app.get('/schedule', (req, res) => {
    const query = 'SELECT * FROM schedules';
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al obtener el horario' });
        } else {
            res.json({ success: true, schedules: result });
        }
    });
});

// Ruta para agregar un nuevo buque
app.post('/addShip', (req, res) => {
    const { shipName, capacity } = req.body;
    const query = 'INSERT INTO ships (name, capacity) VALUES (?, ?)';
    db.query(query, [shipName, capacity], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al agregar buque' });
        } else {
            res.json({ success: true, message: 'Buque agregado exitosamente' });
        }
    });
});

// Ruta para obtener reportes de empleados
app.get('/employeeReports', (req, res) => {
    const query = 'SELECT * FROM employee_reports'; // Asume que tienes una tabla de reportes
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al obtener reportes' });
        } else {
            res.json({ success: true, reports: result });
        }
    });
});

// Ruta para configurar turnos
app.post('/shiftConfig', (req, res) => {
    const { shiftName, startTime, endTime } = req.body;
    const query = 'INSERT INTO shifts (name, start_time, end_time) VALUES (?, ?, ?)';
    db.query(query, [shiftName, startTime, endTime], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al configurar turno' });
        } else {
            res.json({ success: true, message: 'Turno configurado exitosamente' });
        }
    });
});

// Ruta para obtener estadísticas de rendimiento
app.get('/performanceStats', (req, res) => {
    const query = 'SELECT * FROM performance_stats'; // Asume que tienes una tabla de estadísticas
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
        } else {
            res.json({ success: true, stats: result });
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
