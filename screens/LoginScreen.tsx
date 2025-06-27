import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox';
import { useUser } from '../App';
import apiClient from '../utils/apiClient';
import notificationService from '../utils/notifications';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('juan@mail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [cargando, setCargando] = useState(false);
  const { setUsuario } = useUser();

  const testServerConnection = async () => {
    Alert.alert('Probando conexión...', 'Verificando conectividad con el servidor...');
    try {
      const workingUrl = await apiClient.testConnection();
      if (workingUrl) {
        Alert.alert('✅ Conexión exitosa', `Servidor encontrado en: ${workingUrl}`);
      } else {
        Alert.alert('❌ Sin conexión', 'No se pudo conectar a ningún servidor. Verifica que:\n\n• El servidor Python esté corriendo\n• El puerto 5000 esté libre\n• Tu configuración de red');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al probar la conexión');
    }
  };

  const testNotifications = async () => {
    try {
      await notificationService.testNotification();
      
      // Mostrar información adicional sobre el estado
      const isExpoGo = notificationService.isInExpoGo();
      if (isExpoGo) {
        Alert.alert(
          '📱 Notificación Simulada', 
          'Se envió una notificación simulada (Alert).\n\nPara notificaciones reales:\n• Usa un dispositivo físico\n• Instala Expo Go en tu teléfono\n• Escanea el QR code'
        );
      } else {
        Alert.alert('✅ Notificación Enviada', 'Se envió una notificación real a tu dispositivo.');
      }
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo enviar la notificación de prueba');
    }
  };

  const quickLogin = () => {
    setUsuario({
      id: 1,
      email: 'juan@mail.com',
      dni: '12345678',
      fecha_registro: new Date().toISOString()
    });
    Alert.alert('Login Rápido', 'Entrando en modo desarrollo...');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo válido.');
      return;
    }

    setCargando(true);
    try {
      const data = await apiClient.login(email, password);
      
      if (data.success) {
        setUsuario(data.usuario);
        Alert.alert('Éxito', '¡Bienvenido de vuelta!');
      } else {
        Alert.alert('Error', data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.log('Error de conexión:', error);
      Alert.alert(
        'Error de Conexión', 
        'No se pudo conectar al servidor. Verifica que:\n\n• El servidor esté corriendo\n• Tu conexión a internet\n• La configuración de red',
        [
          { text: 'OK', style: 'default' },
          { text: 'Probar Conexión', onPress: testServerConnection },
          { text: 'Login Rápido (Dev)', onPress: quickLogin, style: 'destructive' }
        ]
      );
    }
    setCargando(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Ionicons name="shield-checkmark" size={60} color="#3B82F6" style={styles.logo} />
        </View>
        <Text style={styles.title}>SecApp</Text>
        <Text style={styles.subtitle}>Seguridad Ciudadana Colaborativa</Text>
        
        <View style={styles.testButtonsRow}>
          <TouchableOpacity style={styles.testButton} onPress={testServerConnection}>
            <Ionicons name="wifi-outline" size={20} color="#2563eb" />
            <Text style={styles.testButtonText}>Probar Conexión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLoginButton} onPress={quickLogin}>
            <Ionicons name="flash-outline" size={20} color="#22c55e" />
            <Text style={styles.quickLoginText}>Login Rápido</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.notificationTestButton} onPress={testNotifications}>
          <Ionicons name="notifications-outline" size={20} color="#f59e0b" />
          <Text style={styles.notificationTestText}>Probar Notificaciones</Text>
        </TouchableOpacity>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#aaa"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <CheckBox
              value={rememberMe}
              onValueChange={setRememberMe}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>Recordarme</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={cargando}>
          <Text style={styles.loginButtonText}>{cargando ? 'Iniciando...' : 'Iniciar Sesión'}</Text>
        </TouchableOpacity>
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>O inicia sesión con</Text>
          <View style={styles.separator} />
        </View>
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={24} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={24} color="#4267B2" />
          </TouchableOpacity>
        </View>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿Aún no tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.anonButton} onPress={() => navigation.navigate('AnonymousReport')}>
          <Text style={styles.anonButtonText}>Reportar anónimamente </Text>
          <Ionicons name="eye-off" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  logoContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 50,
    padding: 12,
    marginBottom: 8,
  },
  logo: {
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 8,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#222',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: Platform.OS === 'ios' ? 0 : 4,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#555',
  },
  forgot: {
    color: '#2563eb',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  separatorText: {
    marginHorizontal: 8,
    color: '#888',
    fontSize: 13,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  socialButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 50,
    padding: 10,
    marginHorizontal: 10,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  registerText: {
    color: '#555',
    fontSize: 14,
  },
  registerLink: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 14,
  },
  anonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#38bdf8',
    borderRadius: 8,
    width: '100%',
    paddingVertical: 10,
    justifyContent: 'center',
    marginTop: 6,
  },
  anonButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
  },
  testButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  testButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  quickLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  quickLoginText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  notificationTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  notificationTestText: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
}); 