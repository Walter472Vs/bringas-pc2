import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView, Modal, Pressable, Switch, Platform, KeyboardAvoidingView, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../App';
import { ENDPOINTS } from '../config/api';
import notificationService from '../utils/notifications';

const tiposReporte = [
  { tipo: 'Robo', icon: 'mask', color: '#ef4444' },
  { tipo: 'Sospechoso', icon: 'user-secret', color: '#f59e42' },
  { tipo: 'Accidente', icon: 'car-crash', color: '#3b82f6' },
  { tipo: 'Policía', icon: 'shield-alt', color: '#22c55e' },
  { tipo: 'Extorsión', icon: 'phone-slash', color: '#a21caf' },
  { tipo: 'Drogas', icon: 'pills', color: '#fb7185' },
  { tipo: 'Violencia', icon: 'bolt', color: '#f59e42' },
  { tipo: 'Peligro', icon: 'exclamation-circle', color: '#ef4444' },
];

const reportes = [
  {
    id: '1',
    tipo: 'Robo',
    icon: 'mask',
    color: '#ef4444',
    titulo: 'Robo a mano armada',
    descripcion: 'Dos individuos en moto asaltaron a un transeúnte. Se llevaron celular y billetera. Ambos con cascos negros.',
    direccion: 'Av. Principal con Jr. Libertad',
    tiempo: 'Hace 10 min',
    distancia: '0.5 km',
    estado: 'Activo',
    latlng: { latitude: -12.062106, longitude: -77.036525 },
  },
  {
    id: '2',
    tipo: 'Sospechoso',
    icon: 'user-secret',
    color: '#f59e42',
    titulo: 'Persona sospechosa',
    descripcion: 'Individuo merodeando casas con actitud sospechosa. Vestido con casaca oscura y gorra.',
    direccion: 'Jr. Progreso 253',
    tiempo: 'Hace 25 min',
    distancia: '0.8 km',
    estado: 'Activo',
    latlng: { latitude: -12.061, longitude: -77.038 },
  },
  {
    id: '3',
    tipo: 'Accidente',
    icon: 'car-crash',
    color: '#3b82f6',
    titulo: 'Accidente de tránsito',
    descripcion: 'Colisión entre auto y moto en la intersección. Hay personas heridas y el tránsito está congestionado.',
    direccion: 'Av. Central con Calle 5',
    tiempo: 'Hace 45 min',
    distancia: '1.2 km',
    estado: 'Resuelto',
    latlng: { latitude: -12.063, longitude: -77.034 },
  },
  {
    id: '4',
    tipo: 'Robo',
    icon: 'mask',
    color: '#ef4444',
    titulo: 'Robo cerca de la UNI',
    descripcion: 'Asalto reportado en la puerta 05 de la UNI. Dos sujetos en moto.',
    direccion: 'UNI Puerta 05',
    tiempo: 'Hace 5 min',
    distancia: '0.2 km',
    estado: 'Activo',
    latlng: { latitude: -12.0172, longitude: -77.0501 }, // Aproximado a la UNI puerta 05
  },
];

export default function MapScreen() {
  const { usuario } = useUser();
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReporte, setSelectedReporte] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({ tipo: '', titulo: '', descripcion: '', direccion: '', objetos: '', sospechosos: '', anonimo: false, foto: null as string | null });
  const [enviando, setEnviando] = useState(false);
  const [reportesData, setReportesData] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      const response = await fetch(ENDPOINTS.REPORTES);
      if (response.ok) {
        const data = await response.json();
        setReportesData(data);
      }
    } catch (error) {
      console.log('Error cargando reportes:', error);
    }
  };

  useEffect(() => {
    if (location) {
      // Auto-completar dirección con ubicación actual
      setForm(f => ({ ...f, direccion: f.direccion || `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}` }));
    }
  }, [location]);

  const { width } = Dimensions.get('window');

  const handleVerEnMapa = (reporte: any) => {
    setSelectedReporte(reporte.id);
    mapRef.current?.animateToRegion({
      latitude: reporte.latlng.latitude,
      longitude: reporte.latlng.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 800);
  };

  const enviarReporte = async () => {
    if (!form.tipo || !form.titulo || !form.descripcion || !form.direccion) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    
    setEnviando(true);
    try {
      const data = {
        usuario_id: usuario?.id || 1, // Usar el ID del usuario autenticado
        tipo: form.tipo,
        titulo: form.titulo,
        descripcion: form.descripcion,
        direccion: form.direccion,
        latitud: location?.latitude,
        longitud: location?.longitude,
        anonimo: form.anonimo,
        foto_url: form.foto
      };
      
      const response = await fetch(ENDPOINTS.REPORTES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        // Enviar notificación local
        await notificationService.sendLocalNotification(
          '🚨 Reporte Enviado',
          `Tu reporte "${form.titulo}" ha sido enviado exitosamente. La comunidad será notificada.`,
          {
            tipo: 'reporte_enviado',
            reporte_id: (await response.json()).id
          }
        );
        
        alert('Reporte enviado exitosamente');
        setForm({ tipo: '', titulo: '', descripcion: '', direccion: '', objetos: '', sospechosos: '', anonimo: false, foto: null });
        setFormVisible(false);
        
        // Recargar reportes para mostrar el nuevo
        cargarReportes();
      } else {
        alert('Error al enviar el reporte');
      }
    } catch (error) {
      alert('Error de conexión');
    }
    setEnviando(false);
  };

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginLeft: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar zonas o direcciones"
          placeholderTextColor="#aaa"
        />
        <Ionicons name="options-outline" size={22} color="#2563eb" style={{ marginRight: 8 }} />
      </View>
      {/* Leyenda horizontal de tipos de reportes */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.legendScroll} contentContainerStyle={styles.legendContainer}>
        {tiposReporte.map((t) => (
          <View key={t.tipo} style={styles.legendItem}>
            <FontAwesome5 name={t.icon} size={22} color={t.color} style={{ marginBottom: 2 }} />
            <Text style={styles.legendText}>{t.tipo}</Text>
          </View>
        ))}
      </ScrollView>
      {/* Mapa */}
      <View style={{ borderRadius: 16, overflow: 'hidden', marginHorizontal: 0 }}>
        {loading ? (
          <View style={{ height: 220, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={{ width: width, height: 220 }}
            initialRegion={{
              latitude: -12.062106,
              longitude: -77.036525,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* Marcadores de reportes desde backend */}
            {reportesData.map((reporte: any) => (
              reporte.latitud && reporte.longitud && (
                <Marker
                  key={reporte.id}
                  coordinate={{
                    latitude: reporte.latitud,
                    longitude: reporte.longitud,
                  }}
                  title={reporte.titulo}
                  description={reporte.descripcion}
                  pinColor={tiposReporte.find(t => t.tipo === reporte.tipo)?.color || '#888'}
                />
              )
            ))}
            
            {/* Marcador de ubicación del usuario */}
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Mi ubicación"
                pinColor="#2563eb"
              />
            )}
          </MapView>
        )}
      </View>
      {/* Lista de reportes recientes */}
      <View style={styles.reportsContainer}>
        <Text style={styles.reportsTitle}>Reportes recientes cerca de ti</Text>
        <FlatList
          data={reportesData.slice(0, 5)} // Solo últimos 5
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: any) => (
            <View style={[styles.reportItem, item.estado === 'Resuelto' ? styles.reportItemResolved : null]}> 
              <View style={styles.reportIconBox}>
                <FontAwesome5 name={tiposReporte.find(t => t.tipo === item.tipo)?.icon || 'exclamation'} size={26} color={tiposReporte.find(t => t.tipo === item.tipo)?.color || '#888'} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.reportTitle}>{item.titulo}</Text>
                  <Text style={styles.reportTime}>Hace {Math.floor(Math.random() * 60)} min</Text>
                </View>
                <Text style={styles.reportDesc}>{item.descripcion}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Ionicons name="location-outline" size={14} color="#2563eb" style={{ marginRight: 2 }} />
                  <Text style={styles.reportAddress}>{item.direccion}</Text>
                  <Text style={styles.reportDist}> • {((Math.random() * 2) + 0.1).toFixed(1)} km</Text>
                </View>
              </View>
            </View>
          )}
        />
        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>Ver todos los reportes</Text>
        </TouchableOpacity>
      </View>
      {/* Botón flotante */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Botón de prueba de notificaciones */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: 100, backgroundColor: '#f59e0b' }]} 
        onPress={async () => {
          try {
            await notificationService.testNotification();
            alert('✅ Notificación de prueba enviada');
          } catch (error) {
            alert('❌ Error enviando notificación');
          }
        }}
      >
        <Ionicons name="notifications" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={{ flex: 1, backgroundColor: '#0008' }} onPress={() => setModalVisible(false)} />
        <View style={styles.bottomSheet}>
          <TouchableOpacity style={styles.sheetOption} onPress={() => { setModalVisible(false); setFormVisible(true); }}>
            <Ionicons name="document-text-outline" size={24} color="#2563eb" />
            <Text style={styles.sheetOptionText}>Hacer Reporte</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={formVisible} animationType="slide">
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#f3f6fb' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#2563eb', marginBottom: 16 }}>Nuevo Reporte</Text>
            {/* Tipo */}
            <Text style={styles.label}>Tipo de incidente</Text>
            <View style={styles.pickerRow}>
              {tiposReporte.filter(t => t.tipo !== 'Todos').map(t => (
                <TouchableOpacity key={t.tipo} style={[styles.pickerBtn, form.tipo === t.tipo && styles.pickerBtnActive]} onPress={() => setForm(f => ({ ...f, tipo: t.tipo }))}>
                  <FontAwesome5 name={t.icon} size={18} color={t.color} />
                  <Text style={[styles.pickerBtnText, form.tipo === t.tipo && { color: '#fff' }]}>{t.tipo}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Título */}
            <Text style={styles.label}>Título</Text>
            <TextInput style={styles.input} value={form.titulo} onChangeText={v => setForm(f => ({ ...f, titulo: v }))} placeholder="Ej: Robo a mano armada" />
            {/* Descripción */}
            <Text style={styles.label}>Descripción</Text>
            <TextInput style={[styles.input, { height: 80 }]} value={form.descripcion} onChangeText={v => setForm(f => ({ ...f, descripcion: v }))} placeholder="Describe lo sucedido..." multiline />
            {/* Dirección */}
            <Text style={styles.label}>Dirección</Text>
            <TextInput style={styles.input} value={form.direccion} onChangeText={v => setForm(f => ({ ...f, direccion: v }))} placeholder="Ubicación del incidente" />
            {/* Objetos sustraídos */}
            <Text style={styles.label}>Objetos sustraídos (opcional)</Text>
            <TextInput style={styles.input} value={form.objetos} onChangeText={v => setForm(f => ({ ...f, objetos: v }))} placeholder="Ej: Celular, billetera..." />
            {/* Sospechosos */}
            <Text style={styles.label}>Características de sospechosos (opcional)</Text>
            <TextInput style={styles.input} value={form.sospechosos} onChangeText={v => setForm(f => ({ ...f, sospechosos: v }))} placeholder="Ej: Hombre, casaca negra..." />
            {/* Foto */}
            <Text style={styles.label}>Foto (opcional)</Text>
            <TouchableOpacity style={styles.photoBtn} onPress={async () => {
              let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.5 });
              if (!result.canceled) setForm(f => ({ ...f, foto: result.assets[0].uri }));
            }}>
              <Ionicons name="camera" size={22} color="#2563eb" />
              <Text style={{ color: '#2563eb', marginLeft: 8 }}>Seleccionar foto</Text>
            </TouchableOpacity>
            {form.foto && <Image source={{ uri: form.foto }} style={{ width: 120, height: 120, borderRadius: 10, marginTop: 8 }} />}
            {/* Anónimo */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <Text style={styles.label}>Reportar anónimamente</Text>
              <Switch value={form.anonimo} onValueChange={v => setForm(f => ({ ...f, anonimo: v }))} style={{ marginLeft: 8 }} />
            </View>
            {/* Botones */}
            <TouchableOpacity style={styles.submitBtn} onPress={enviarReporte} disabled={enviando}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>{enviando ? 'Enviando...' : 'Enviar Reporte'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignSelf: 'center', marginTop: 10 }} onPress={() => setFormVisible(false)}>
              <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    margin: 16,
    marginBottom: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    marginHorizontal: 8,
    color: '#222',
  },
  legendScroll: {
    marginLeft: 8,
    marginBottom: 2,
    marginTop: 2,
    maxHeight: 54,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  legendItem: {
    alignItems: 'center',
    marginRight: 18,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
    minWidth: 56,
  },
  legendText: {
    fontSize: 12,
    color: '#222',
    fontWeight: 'bold',
  },
  reportsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 18,
    paddingHorizontal: 8,
    flex: 1,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
  },
  reportsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    marginLeft: 8,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  reportItemResolved: {
    backgroundColor: '#e0f7fa',
  },
  reportIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
    elevation: 1,
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  reportTime: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
  },
  reportDesc: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  reportAddress: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  reportDist: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  seeAllBtn: {
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  seeAllText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#2563eb',
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  bottomSheet: { backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 18, position: 'absolute', bottom: 0, left: 0, right: 0, elevation: 10 },
  sheetOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderColor: '#eee' },
  sheetOptionText: { fontSize: 18, color: '#2563eb', marginLeft: 12, fontWeight: 'bold' },
  label: { color: '#2563eb', fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  pickerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e7ff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7, marginRight: 10, marginBottom: 8 },
  pickerBtnActive: { backgroundColor: '#2563eb' },
  pickerBtnText: { color: '#2563eb', fontWeight: 'bold', marginLeft: 6 },
  input: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 8, borderWidth: 1, borderColor: '#e0e7ff' },
  photoBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e7ff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 4, alignSelf: 'flex-start' },
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 18 },
}); 