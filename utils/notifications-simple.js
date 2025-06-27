import { Alert, Platform } from 'react-native';

// Sistema de notificaciones simplificado usando Alert nativo
class SimpleNotificationService {
  constructor() {
    this.isAvailable = false;
    this.checkAvailability();
  }

  async checkAvailability() {
    try {
      // Intentar importar expo-notifications dinámicamente
      const Notifications = await import('expo-notifications');
      this.isAvailable = true;
      console.log('✅ Expo Notifications disponible');
    } catch (error) {
      console.log('⚠️ Expo Notifications no disponible, usando Alert nativo');
      this.isAvailable = false;
    }
  }

  // Enviar notificación usando el método disponible
  async sendNotification(title, body, data = {}) {
    if (this.isAvailable) {
      try {
        const Notifications = await import('expo-notifications');
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data,
            sound: 'default',
          },
          trigger: null,
        });
        console.log('✅ Notificación enviada con Expo');
      } catch (error) {
        console.log('❌ Error con Expo Notifications, usando Alert');
        this.sendNativeAlert(title, body);
      }
    } else {
      this.sendNativeAlert(title, body);
    }
  }

  // Fallback usando Alert nativo
  sendNativeAlert(title, body) {
    Alert.alert(title, body, [
      { text: 'OK', onPress: () => console.log('Notificación cerrada') }
    ]);
    console.log('📱 Notificación enviada con Alert nativo');
  }

  // Método de prueba
  async testNotification() {
    await this.sendNotification(
      '🧪 Prueba de Notificación',
      '¡El sistema de notificaciones está funcionando!',
      { tipo: 'prueba' }
    );
  }

  // Método para registrar (simulado)
  async registerForPushNotifications() {
    console.log('📱 Registrando dispositivo para notificaciones...');
    return 'local-only';
  }

  // Métodos simulados para compatibilidad
  addNotificationReceivedListener(callback) {
    console.log('📱 Listener de notificaciones configurado');
    return { remove: () => console.log('Listener removido') };
  }

  addNotificationResponseReceivedListener(callback) {
    console.log('📱 Listener de respuesta configurado');
    return { remove: () => console.log('Listener removido') };
  }
}

export const simpleNotificationService = new SimpleNotificationService();
export default simpleNotificationService; 