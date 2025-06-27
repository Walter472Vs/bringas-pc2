-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  dni VARCHAR(20),
  anonimo BOOLEAN DEFAULT FALSE,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reportes
CREATE TABLE IF NOT EXISTS reportes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  tipo VARCHAR(30),
  titulo VARCHAR(100),
  descripcion TEXT,
  direccion VARCHAR(200),
  latitud DOUBLE PRECISION,
  longitud DOUBLE PRECISION,
  estado VARCHAR(20) DEFAULT 'Activo',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  anonimo BOOLEAN DEFAULT FALSE,
  foto_url TEXT
);

-- Tabla de objetos sustraídos
CREATE TABLE IF NOT EXISTS objetos_sustraidos (
  id SERIAL PRIMARY KEY,
  reporte_id INTEGER REFERENCES reportes(id),
  objeto VARCHAR(100)
);

-- Tabla de sospechosos
CREATE TABLE IF NOT EXISTS sospechosos (
  id SERIAL PRIMARY KEY,
  reporte_id INTEGER REFERENCES reportes(id),
  nombre VARCHAR(100),
  descripcion TEXT
);

-- Tabla de confirmaciones
CREATE TABLE IF NOT EXISTS confirmaciones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  reporte_id INTEGER REFERENCES reportes(id),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS comentarios (
  id SERIAL PRIMARY KEY,
  reporte_id INTEGER REFERENCES reportes(id),
  usuario_id INTEGER REFERENCES usuarios(id),
  texto TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de autoridades
CREATE TABLE IF NOT EXISTS autoridades (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT,
  telefono VARCHAR(30)
);

-- Tabla de recomendaciones
CREATE TABLE IF NOT EXISTS recomendaciones (
  id SERIAL PRIMARY KEY,
  reporte_id INTEGER REFERENCES reportes(id),
  texto TEXT
);

-- Tabla de incidentes similares
CREATE TABLE IF NOT EXISTS similares (
  id SERIAL PRIMARY KEY,
  reporte_id INTEGER REFERENCES reportes(id),
  titulo VARCHAR(100),
  lugar VARCHAR(100),
  tiempo VARCHAR(50),
  confiabilidad VARCHAR(20)
);

-- Datos de prueba
INSERT INTO usuarios (email, password, dni, anonimo) VALUES
  ('juan@mail.com', '123456', '12345678', false),
  ('ana@mail.com', '123456', '87654321', false),
  ('anonimo@mail.com', 'anon', '00000000', true);

INSERT INTO reportes (usuario_id, tipo, titulo, descripcion, direccion, latitud, longitud, estado, anonimo, foto_url) VALUES
  (1, 'Robo', 'Robo a mano armada', 'Dos sujetos en moto asaltaron a un transeúnte.', 'Av. Principal con Jr. Libertad', -12.062106, -77.036525, 'Activo', false, NULL),
  (2, 'Sospechoso', 'Persona sospechosa', 'Individuo merodeando casas con actitud sospechosa.', 'Jr. Progreso 253', -12.061, -77.038, 'Activo', false, NULL),
  (3, 'Accidente', 'Accidente de tránsito', 'Colisión entre auto y moto.', 'Av. Central con Calle 5', -12.063, -77.034, 'Resuelto', true, NULL);

INSERT INTO objetos_sustraidos (reporte_id, objeto) VALUES
  (1, 'iPhone 14 Pro'),
  (1, 'Billetera'),
  (1, 'Tarjetas (4)'),
  (1, 'DNI'),
  (1, 'S/. 500 en efectivo'),
  (1, 'Llaves');

INSERT INTO sospechosos (reporte_id, nombre, descripcion) VALUES
  (1, 'Sospechoso #1 (Conductor)', 'Hombre, 25-30 años, casaca de cuero negro, casco integral negro.'),
  (1, 'Sospechoso #2 (Copiloto)', 'Hombre, 20-25 años, polera gris, casco abierto, cicatriz en mejilla.');

INSERT INTO confirmaciones (usuario_id, reporte_id) VALUES
  (2, 1),
  (3, 1),
  (1, 3);

INSERT INTO comentarios (reporte_id, usuario_id, texto) VALUES
  (1, 2, 'Vi la moto estacionada antes del incidente.'),
  (2, 1, 'El sospechoso llevaba mochila negra.');

INSERT INTO autoridades (nombre, descripcion, telefono) VALUES
  ('Emergencias PNP', 'Llamada gratuita a nivel nacional', '105'),
  ('Comisaría La Molina', 'Av. La Molina 1181', '368-1871'),
  ('Serenazgo La Molina', 'Atención inmediata', '313-4495');

INSERT INTO recomendaciones (reporte_id, texto) VALUES
  (1, 'Evite mostrar artículos de valor al salir de centros comerciales.'),
  (1, 'Mantente alerta a motocicletas con dos ocupantes.'),
  (1, 'Si eres víctima, no opongas resistencia.');

INSERT INTO similares (reporte_id, titulo, lugar, tiempo, confiabilidad) VALUES
  (1, 'Robo a mano armada', 'CC. La Fontana, estacionamiento', 'Hace 2 días', '90% confirmado'),
  (1, 'Arrebato de celular', 'Av. La Molina cdra 5', 'Hace 3 días', '80% confirmado');
