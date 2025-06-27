import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useUser } from '../App';
import { ENDPOINTS } from '../config/api';

export default function RegisterScreen({ navigation }: any) {
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const { setUsuario } = useUser();

  const handleRegister = async () => {
    if (!dni || !email || !password) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }
    if (!/^\d{8}$/.test(dni)) {
      Alert.alert('Error', 'El DNI debe tener 8 dígitos.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Correo inválido.');
      return;
    }

    setCargando(true);
    try {
      console.log('Intentando conectar a:', ENDPOINTS.REGISTER);
      const response = await fetch(ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni, email, password }),
      });

      console.log('Respuesta del servidor:', response.status);
      const data = await response.json();
      
      if (data.success) {
        setUsuario(data.usuario);
        Alert.alert('Éxito', '¡Cuenta creada exitosamente!');
      } else {
        Alert.alert('Error', data.message || 'Error al crear la cuenta');
      }
    } catch (error) {
      console.log('Error de conexión:', error);
      Alert.alert(
        'Error de Conexión', 
        'No se pudo conectar al servidor. Verifica que:\n\n• El servidor esté corriendo\n• Tu conexión a internet\n• La configuración de red'
      );
    }
    setCargando(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="DNI"
        keyboardType="numeric"
        value={dni}
        onChangeText={setDni}
        maxLength={8}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={cargando}>
        <Text style={styles.buttonText}>{cargando ? 'Registrando...' : 'Registrarse'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  button: {
    width: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#2563eb',
    fontSize: 15,
    marginTop: 10,
  },
}); 