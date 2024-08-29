const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Controlador de Alertas', () => {

    // Antes de ejecutar las pruebas se autentica la conexión a la base de datos
    beforeAll(async () => {
        await db.sequelize.authenticate();
    });

    // Después de ejecutar las pruebas se cierra la conexión a la base de datos
    afterAll(async () => {
        await db.sequelize.close();
    });

    // Pruebas unitarias
    test('Debería devolver un array no nulo al obtener todas las alertas', async () => {
        const response = await request(app).get('/alertas');
        expect(response.body).not.toBeNull();
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('Debería crear una nueva alerta', async () => {
        const nuevaAlerta = {
        descripcion: 'Alerta de prueba',
        idProyecto: 2
        };
        const response = await request(app).post('/alertas').send(nuevaAlerta);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('idAlertas');
    });

    test('Debería obtener una alerta por su ID', async () => {
        const id = 4;
        const response = await request(app).get(`/alertas/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('idAlertas', id);
    });

    test('Debería actualizar una alerta existente', async () => {
        const id = 8;
        const datosActualizados = {
        descripcion: 'Descripción actualizada'
        };
        const response = await request(app).put(`/alertas/${id}`).send(datosActualizados);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('La alerta ha sido actualizada');
    });

    test('Debería eliminar la última alerta por su ID', async () => {
        // Primero se obtienen todas las alertas para identificar la última
        const responseGet = await request(app).get('/alertas');
        const alertas = responseGet.body;
    
        // Verificar que existen alertas para eliminar
        if (alertas.length > 0) {
            const ultimoId = alertas[alertas.length - 1].idAlertas; // Obtener el ID del último registro
    
            // realizar la solicitud DELETE usando el último ID
            const responseDelete = await request(app).delete(`/alertas/${ultimoId}`);
            expect(responseDelete.statusCode).toBe(200);
            expect(responseDelete.body).toHaveProperty('message', 'Alerta eliminada correctamente');
    
            // Verificar que la alerta fue realmente eliminada
            const responseGetAfterDelete = await request(app).get(`/alertas/${ultimoId}`);
            expect(responseGetAfterDelete.statusCode).toBe(404); // Debería devolver 404 porque la alerta fue eliminada
        } else {
            console.log('No hay alertas para eliminar.');
        }
    });    
});
