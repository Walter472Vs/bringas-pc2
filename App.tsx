import React, { useState, createContext, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MapScreen from './screens/MapScreen';
import ReportsScreen from './screens/ReportsScreen';
import StatsScreen from './screens/StatsScreen';
import ProfileScreen from './screens/ProfileScreen';
import AnonymousReportScreen from './screens/AnonymousReportScreen';
import ReporteDetalleScreen from './screens/ReporteDetalleScreen';
import notificationService from './utils/notifications';
import apiClient from './utils/apiClient';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Contexto de usuario
interface Usuario {
  id: number;
  email: string;
  dni: string;
  fecha_registro: string;
}

interface UserContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  usuario: null,
  setUsuario: () => {},
  logout: () => {}
});

export const useUser = () => useContext(UserContext);

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name="map" size={size} color={color} />;
          } else if (route.name === 'Reportes') {
            return <MaterialCommunityIcons name="alert-circle-outline" size={size} color={color} />;
          } else if (route.name === 'Estadísticas') {
            return <Ionicons name="stats-chart" size={size} color={color} />;
          } else if (route.name === 'Perfil') {
            return <Ionicons name="person" size={size} color={color} />;
          }
          return null;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name="Home" component={MapScreen} options={{ title: 'Mapa' }} />
      <Tab.Screen name="Reportes" component={ReportsScreen} />
      <Tab.Screen name="Estadísticas" component={StatsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="AnonymousReport" component={AnonymousReportScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={Tabs} />
      <Stack.Screen name="ReporteDetalle" component={ReporteDetalleScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Configurar notificaciones cuando el usuario hace login
  const handleSetUsuario = async (newUsuario: Usuario | null) => {
    setUsuario(newUsuario);
    
    if (newUsuario) {
      // Registrar dispositivo para notificaciones
      try {
        const token = await notificationService.registerForPushNotifications();
        if (token) {
          // Enviar token al servidor
          await apiClient.request('/register-push-token', {
            method: 'POST',
            body: JSON.stringify({
              usuario_id: newUsuario.id,
              push_token: token
            })
          });
          console.log('✅ Token de notificación registrado en el servidor');
        }
      } catch (error) {
        console.log('❌ Error registrando token de notificación:', error);
      }
    }
  };

  const logout = () => {
    setUsuario(null);
  };

  // Configurar listeners de notificaciones
  useEffect(() => {
    // Listener para notificaciones recibidas cuando la app está abierta
    const notificationListener = notificationService.addNotificationReceivedListener((notification: any) => {
      console.log('📱 Notificación recibida:', notification);
      // Puedes mostrar un alert o actualizar la UI aquí
      Alert.alert(
        notification.request.content.title || 'Nueva notificación',
        notification.request.content.body || 'Tienes una nueva notificación'
      );
    });

    // Listener para cuando el usuario toca la notificación
    const responseListener = notificationService.addNotificationResponseReceivedListener((response: any) => {
      console.log('👆 Usuario tocó notificación:', response);
      const data = response.notification.request.content.data;
      
      // Navegar a la pantalla correspondiente según el tipo de notificación
      if (data?.tipo === 'nuevo_reporte') {
        // Aquí podrías navegar al detalle del reporte
        console.log('Navegando a reporte:', data.reporte_id);
      }
    });

    // Limpiar listeners al desmontar
    return () => {
      notificationListener?.remove();
      responseListener?.remove();
    };
  }, []);

  return (
    <UserContext.Provider value={{ usuario, setUsuario: handleSetUsuario, logout }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        {usuario ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </UserContext.Provider>
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
});
