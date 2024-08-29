const request = require('supertest'); // Asegúrate de importar supertest
const app = require('../app'); // Asegúrate de que la ruta sea correcta

test('Debería crear una alerta si un proyecto tiene menos de 7 días restantes', async () => {
    // Crear un proyecto con fecha de finalización dentro de 5 días
    const fechaHoy = new Date();
    const fechaFin = new Date(fechaHoy);
    fechaFin.setDate(fechaFin.getDate() + 5); // Ajustar la fecha para que falten 5 días

    const nuevoProyecto = {
        nombreProyecto: 'Proyecto Test menos de 7 días',
        descripcion: 'Este es un proyecto de prueba para verificar las alertas de menos de 7 días.',
        fechaInicio: fechaHoy.toISOString().split('T')[0], // Formato YYYY-MM-DD
        fechaFin: fechaFin.toISOString().split('T')[0], // Formato YYYY-MM-DD
        porcentajeCompletado: 50
    };

    // Crear el proyecto
    const responseCreate = await request(app).post('/proyectos').send(nuevoProyecto);
    expect(responseCreate.statusCode).toBe(201);

    // Ejecutar la verificación de los días restantes
    const responseCheck = await request(app).get('/proyectos/verificar-alertas');
    expect(responseCheck.statusCode).toBe(200);

    // Verificar que se ha creado una alerta para el proyecto
    const responseAlertas = await request(app).get('/alertas');
    const alertas = responseAlertas.body;
    const alertaCreada = alertas.find(alerta => alerta.idProyecto === responseCreate.body.idProyecto);

    expect(alertaCreada).not.toBeUndefined();
    expect(alertaCreada.descripcion).toMatch(/Faltan menos de 7 días para la fecha final del proyecto/);
});
