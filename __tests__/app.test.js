const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Controlador de Alertas', () => {

  beforeAll(async () => {
    await db.sequelize.authenticate();
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

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
    const id = 4;
    const datosActualizados = {
      descripcion: 'Descripción actualizada'
    };
    const response = await request(app).put(`/alertas/${id}`).send(datosActualizados);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('La alerta ha sido actualizada');
  });

  test('Debería eliminar una alerta por su ID', async () => {
    const id = 5;
    const response = await request(app).delete(`/alertas/${id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Alerta eliminada correctamente');
  });
});
