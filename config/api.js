import { Platform } from 'react-native';

// Configuración de URLs del API con múltiples opciones
const getApiUrl = () => {
  // Lista de URLs a probar en orden de preferencia
  const urls = [
    'http://192.168.0.190:5000', // IP local real (más confiable para emuladores)
    'http://10.0.2.2:5000',      // Emulador Android (fallback)
    'http://localhost:5000',     // Dispositivo físico o desarrollo
    'http://127.0.0.1:5000',     // Localhost alternativo
  ];

  // Para desarrollo, siempre usar la primera opción
  if (Platform.OS === 'android') {
    return urls[0]; // IP local real para emulador
  } else if (Platform.OS === 'ios') {
    return urls[2]; // localhost para iOS
  } else {
    return urls[2]; // localhost para web
  }
};

export const API_BASE_URL = getApiUrl();

// Función para probar conectividad
export const testConnection = async () => {
  const urls = [
    'http://192.168.0.190:5000', // IP local real
    'http://10.0.2.2:5000',      // Emulador Android
    'http://localhost:5000',     // Dispositivo físico
    'http://127.0.0.1:5000',     // Localhost alternativo
  ];

  for (const url of urls) {
    try {
      console.log(`🔍 Probando conexión a: ${url}`);
      const response = await fetch(`${url}/estadisticas`, {
        method: 'GET',
        timeout: 3000,
      });
      if (response.ok) {
        console.log(`✅ Conexión exitosa a: ${url}`);
        return url;
      }
    } catch (error) {
      console.log(`❌ Falló conexión a: ${url} - ${error.message}`);
    }
  }
  return null;
};

// Endpoints
export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  REPORTES: `${API_BASE_URL}/reportes`,
  ESTADISTICAS: `${API_BASE_URL}/estadisticas`,
  CONFIRMAR_REPORTE: (id) => `${API_BASE_URL}/reportes/${id}/confirmar`,
  OBTENER_REPORTE: (id) => `${API_BASE_URL}/reportes/${id}`,
};

// Función para obtener endpoint con URL específica
export const getEndpoint = (path, baseUrl = API_BASE_URL) => {
  return `${baseUrl}${path}`;
}; 