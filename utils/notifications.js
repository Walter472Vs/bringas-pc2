import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';

// Configurar comportamiento de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.isExpoGo = false;
  }

  // Solicitar permisos y registrar dispositivo
  async registerForPushNotifications() {
    try {
      // Verificar si es un dispositivo físico
      if (!Device.isDevice) {
        console.log('⚠️ No es un dispositivo físico, usando notificaciones simuladas');
        this.isExpoGo = true;
        return 'expo-go-simulated';
      }

      // Solicitar permisos
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('❌ Permisos de notificación denegados, usando alerts');
        this.isExpoGo = true;
        return 'permissions-denied';
      }

      // Configurar para Android
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
        });
      }

      console.log('✅ Notificaciones nativas configuradas');
      return 'native-notifications';
    } catch (error) {
      console.error('❌ Error al registrar notificaciones, usando alerts:', error);
      this.isExpoGo = true;
      return 'error-fallback';
    }
  }

  // Enviar notificación local
  async sendLocalNotification(title, body, data = {}) {
    try {
      if (this.isExpoGo || !Device.isDevice) {
        // Usar Alert como fallback en Expo Go
        Alert.alert(
          title,
          body,
          [
            {
              text: 'OK',
              onPress: () => console.log('Notificación simulada cerrada')
            }
          ]
        );
        console.log('📱 Notificación simulada enviada:', title);
        return;
      }

      // Usar notificaciones nativas en dispositivo físico
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Enviar inmediatamente
      });
      console.log('✅ Notificación nativa enviada:', title);
    } catch (error) {
      console.error('❌ Error al enviar notificación, usando alert:', error);
      // Fallback a Alert
      Alert.alert(title, body);
    }
  }

  // Simular notificación push (para desarrollo)
  async sendPushNotificationToAll(title, body, data = {}) {
    console.log('📱 Simulando notificación push a todos los usuarios:');
    console.log('   Título:', title);
    console.log('   Cuerpo:', body);
    console.log('   Datos:', data);
    
    // En desarrollo, solo enviar notificación local
    await this.sendLocalNotification(title, body, data);
  }

  // Obtener el token actual
  getToken() {
    return this.expoPushToken;
  }

  // Configurar listener para notificaciones recibidas
  addNotificationReceivedListener(callback) {
    if (this.isExpoGo) {
      console.log('⚠️ Listeners no disponibles en Expo Go');
      return { remove: () => {} };
    }
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Configurar listener para notificaciones respondidas
  addNotificationResponseReceivedListener(callback) {
    if (this.isExpoGo) {
      console.log('⚠️ Listeners no disponibles en Expo Go');
      return { remove: () => {} };
    }
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Método para probar notificaciones
  async testNotification() {
    const message = this.isExpoGo 
      ? '🧪 Prueba de Notificación (Expo Go)\nLas notificaciones reales funcionan mejor en dispositivos físicos'
      : '🧪 Prueba de Notificación\n¡El sistema de notificaciones está funcionando correctamente!';
    
    await this.sendLocalNotification(
      '🧪 Prueba de Notificación',
      message,
      { tipo: 'prueba' }
    );
  }

  // Método global para pruebas desde consola
  async sendTestNotification(title = '🧪 Prueba', body = 'Notificación de prueba') {
    await this.sendLocalNotification(title, body, { tipo: 'prueba_manual' });
  }

  // Verificar si estamos en Expo Go
  isInExpoGo() {
    return this.isExpoGo;
  }
}

export const notificationService = new NotificationService();
export default notificationService;

// Hacer disponible globalmente para pruebas desde consola
if (typeof global !== 'undefined') {
  global.testNotification = () => notificationService.testNotification();
  global.sendNotification = (title, body) => notificationService.sendTestNotification(title, body);
} 