import { Platform } from 'react-native';

// Configuración de URLs del API
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://192.168.0.190:5000'; // IP local real
  } else {
    return 'http://localhost:5000';
  }
};

const API_BASE_URL = getApiUrl();

// Cliente API centralizado
class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      console.log(`📡 API Response: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`❌ API Error: ${error.message}`);
      throw error;
    }
  }

  // Métodos de autenticación
  async login(email, password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(dni, email, password) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify({ dni, email, password }),
    });
  }

  // Métodos de reportes
  async getReportes() {
    return this.request('/reportes');
  }

  async createReporte(data) {
    return this.request('/reportes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async confirmarReporte(reporteId, usuarioId) {
    return this.request(`/reportes/${reporteId}/confirmar`, {
      method: 'POST',
      body: JSON.stringify({ usuario_id: usuarioId }),
    });
  }

  async getReporte(reporteId) {
    return this.request(`/reportes/${reporteId}`);
  }

  // Métodos de estadísticas
  async getEstadisticas() {
    return this.request('/estadisticas');
  }

  // Método para registrar token de notificaciones
  async registerPushToken(usuarioId, pushToken) {
    return this.request('/register-push-token', {
      method: 'POST',
      body: JSON.stringify({
        usuario_id: usuarioId,
        push_token: pushToken
      }),
    });
  }

  // Método para probar conectividad
  async testConnection() {
    const urls = [
      'http://192.168.0.190:5000',
      'http://10.0.2.2:5000',
      'http://localhost:5000',
    ];

    for (const url of urls) {
      try {
        console.log(`🔍 Probando: ${url}`);
        const response = await fetch(`${url}/estadisticas`, {
          method: 'GET',
          timeout: 3000,
        });
        if (response.ok) {
          console.log(`✅ Conexión exitosa: ${url}`);
          return url;
        }
      } catch (error) {
        console.log(`❌ Falló: ${url} - ${error.message}`);
      }
    }
    return null;
  }
}

export const apiClient = new ApiClient();
export default apiClient; 