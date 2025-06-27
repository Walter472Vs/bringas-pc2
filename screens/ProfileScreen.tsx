import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../App';

export default function ProfileScreen() {
  const { usuario, logout } = useUser();
  const [estadisticasUsuario, setEstadisticasUsuario] = useState({
    reportesEnviados: 0,
    confirmaciones: 0,
    puntuacion: 0
  });

  useEffect(() => {
    cargarEstadisticasUsuario();
  }, []);

  const cargarEstadisticasUsuario = async () => {
    try {
      // Simular estadísticas por ahora
      setEstadisticasUsuario({
        reportesEnviados: Math.floor(Math.random() * 20) + 5,
        confirmaciones: Math.floor(Math.random() * 50) + 10,
        puntuacion: Math.floor(Math.random() * 1000) + 200
      });
    } catch (error) {
      console.log('Error cargando estadísticas del usuario:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: logout }
      ]
    );
  };

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error al cargar perfil de usuario</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header del perfil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={60} color="#fff" />
        </View>
        <Text style={styles.userName}>{usuario.email}</Text>
        <Text style={styles.userDni}>DNI: {usuario.dni}</Text>
        <Text style={styles.userDate}>Miembro desde {new Date(usuario.fecha_registro).toLocaleDateString()}</Text>
      </View>

      {/* Estadísticas del usuario */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Mis Estadísticas</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="document-text" size={32} color="#2563eb" />
            <Text style={styles.statValue}>{estadisticasUsuario.reportesEnviados}</Text>
            <Text style={styles.statLabel}>Reportes enviados</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={32} color="#22c55e" />
            <Text style={styles.statValue}>{estadisticasUsuario.confirmaciones}</Text>
            <Text style={styles.statLabel}>Confirmaciones</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={32} color="#f59e0b" />
            <Text style={styles.statValue}>{estadisticasUsuario.puntuacion}</Text>
            <Text style={styles.statLabel}>Puntos</Text>
          </View>
        </View>
      </View>

      {/* Opciones del perfil */}
      <View style={styles.optionsContainer}>
        <Text style={styles.sectionTitle}>Configuración</Text>
        
        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons name="notifications-outline" size={24} color="#2563eb" />
            <Text style={styles.optionText}>Notificaciones</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons name="location-outline" size={24} color="#2563eb" />
            <Text style={styles.optionText}>Ubicación</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#2563eb" />
            <Text style={styles.optionText}>Privacidad</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons name="help-circle-outline" size={24} color="#2563eb" />
            <Text style={styles.optionText}>Ayuda y soporte</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons name="information-circle-outline" size={24} color="#2563eb" />
            <Text style={styles.optionText}>Acerca de SecApp</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Botón de logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userDni: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  userDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  statsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#222',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    marginLeft: 8,
  },
  bottomSpace: {
    height: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 50,
  },
}); 