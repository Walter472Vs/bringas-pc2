# SecApp - Aplicación de Seguridad Ciudadana

Una aplicación móvil desarrollada con React Native y Expo para reportar incidentes de seguridad y mantener informada a la comunidad.

## 🚀 Características

- **Autenticación de usuarios** con login y registro
- **Reporte de incidentes** con geolocalización
- **Mapa interactivo** para visualizar reportes
- **Confirmación de reportes** por la comunidad
- **Estadísticas** de incidentes
- **Notificaciones push** para alertar sobre nuevos reportes
- **Reportes anónimos** para mayor seguridad

## 📱 Sistema de Notificaciones

La aplicación incluye un sistema completo de notificaciones:

### Notificaciones Locales
- Se muestran inmediatamente cuando se crea un reporte
- Funcionan en emuladores y dispositivos físicos
- No requieren configuración adicional

### Notificaciones Push (Futuro)
- Alertan a todos los usuarios registrados
- Requieren configuración de Expo Push Notifications
- Funcionan incluso cuando la app está cerrada

### Cómo Probar las Notificaciones

1. **En la pantalla de login**, toca "Probar Notificaciones"
2. **Al crear un reporte**, recibirás una notificación de confirmación
3. **Cuando otros usuarios creen reportes**, recibirás alertas (en desarrollo)

## 🛠️ Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Expo CLI
- Python 3.8+
- PostgreSQL

### Frontend (React Native)
```bash
# Instalar dependencias
npm install

# Instalar dependencias de notificaciones
npx expo install expo-notifications expo-device

# Iniciar la aplicación
npx expo start
```

### Backend (Python/Flask)
```bash
cd api

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos PostgreSQL
# Crear base de datos llamada "SecApp"

# Ejecutar el servidor
python app.py
```

## 🔧 Configuración

### Base de Datos
1. Instalar PostgreSQL
2. Crear base de datos: `CREATE DATABASE SecApp;`
3. Configurar credenciales en `api/app.py`

### Notificaciones Push (Opcional)
Para habilitar notificaciones push reales:

1. Crear cuenta en [Expo](https://expo.dev)
2. Crear un proyecto y obtener el Project ID
3. Actualizar `app.json` con tu Project ID
4. Configurar `utils/notifications.js` con el Project ID

## 📊 Estructura del Proyecto

```
bringas-pc2/
├── api/                 # Backend Flask
│   ├── app.py          # Servidor principal
│   ├── bd.sql          # Scripts de base de datos
│   └── requirements.txt # Dependencias Python
├── screens/            # Pantallas de la app
├── utils/              # Utilidades
│   ├── apiClient.js    # Cliente API
│   └── notifications.js # Sistema de notificaciones
├── config/             # Configuración
└── assets/             # Recursos gráficos
```

## 🔌 Endpoints del Backend

- `POST /login` - Autenticación de usuarios
- `POST /register` - Registro de usuarios
- `POST /register-push-token` - Registrar token de notificaciones
- `GET /reportes` - Obtener todos los reportes
- `POST /reportes` - Crear nuevo reporte
- `POST /reportes/<id>/confirmar` - Confirmar reporte
- `GET /estadisticas` - Obtener estadísticas

## 🚨 Funcionalidades de Seguridad

### Reportes
- **Tipos**: Robo, Extorsión, Sospechoso, Otros
- **Geolocalización**: Captura automática de ubicación
- **Fotos**: Opción de adjuntar imágenes
- **Anónimos**: Reportes sin identificación personal

### Confirmaciones
- Los usuarios pueden confirmar reportes
- 3+ confirmaciones marcan el reporte como "Resuelto"
- Sistema de verificación comunitaria

## 📈 Estadísticas

La aplicación genera estadísticas en tiempo real:
- Total de reportes
- Reportes por tipo (Robo, Extorsión, Sospechoso)
- Tendencias temporales

## 🔔 Notificaciones Implementadas

### Tipos de Notificación
1. **Reporte Enviado**: Confirma que tu reporte fue enviado
2. **Nuevo Reporte**: Alerta sobre incidentes en tu área
3. **Reporte Confirmado**: Notifica cuando un reporte es verificado
4. **Prueba**: Para verificar que el sistema funciona

### Configuración Automática
- Solicita permisos al iniciar la app
- Registra el dispositivo automáticamente
- Funciona en Android e iOS

## 🧪 Pruebas

### Probar Conexión
- Botón "Probar Conexión" en login
- Verifica conectividad con el servidor

### Probar Notificaciones
- Botón "Probar Notificaciones" en login
- Envía notificación de prueba inmediata

### Login Rápido
- Botón "Login Rápido" para desarrollo
- Acceso directo sin backend

## 🚀 Despliegue

### Desarrollo
```bash
npx expo start
```

### Producción - Alternativas para crear APK

#### Opción 1: EAS Build (Recomendado)
```bash
npx eas build --platform android --profile preview
```

#### Opción 2: Android Studio (Local)
1. Instalar Android Studio
2. Configurar ANDROID_HOME
3. Ejecutar: `cd android && ./gradlew assembleRelease`

#### Opción 3: Servicios Online
- [Appetize.io](https://appetize.io) - Build en la nube
- [Bitrise](https://bitrise.io) - CI/CD para móviles
- [GitHub Actions](https://github.com/features/actions) - Automatización

#### Opción 4: Expo Go (Desarrollo)
```bash
npx expo start
# Escanear QR con Expo Go app
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Para soporte técnico o reportar bugs, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para la seguridad ciudadana**
