import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useUser } from '../App';
import { ENDPOINTS } from '../config/api';

const tiposReporte = [
  { tipo: 'Todos', icon: 'list', color: '#2563eb' },
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
    estado: 'Activo',
    latlng: { latitude: -12.062106, longitude: -77.036525 },
    validaciones: { confirmaciones: 42, rechazos: 3, confiabilidad: 93 },
    objetos: ['iPhone 14 Pro', 'Billetera', 'Tarjetas (4)', 'DNI', 'S/. 500 en efectivo', 'Llaves'],
    sospechosos: [
      {
        nombre: 'Sospechoso #1 (Conductor)',
        desc: 'Hombre, aproximadamente 25-30 años, contextura delgada, 1.75m aproximadamente. Vestía casaca de cuero negro, jean oscuro y zapatillas negras. Casco integral negro sin visibilidad del rostro.'
      },
      {
        nombre: 'Sospechoso #2 (Copiloto)',
        desc: 'Hombre, aprox. 20-25 años, contextura atlética, 1.70m aproximadamente. Vestía polera gris, pantalón deportivos negros. Casco abierto, tez morena, cicatriz en mejilla derecha. Portaba arma de fuego.'
      }
    ],
    comentarios: [
      {
        usuario: 'Luis Mendoza',
        tiempo: 'Hace 12 min',
        texto: 'Vi la moto estacionada aproximadamente 15 minutos antes del incidente, parecía estar vigilando a las personas que salían del centro comercial.'
      }
    ],
    autoridades: [
      { nombre: 'Emergencias PNP', desc: 'Llamada gratuita a nivel nacional', tel: '105', icon: 'phone' },
      { nombre: 'Comisaría La Molina', desc: 'Av. La Molina 1181', tel: '368-1871', icon: 'building' },
      { nombre: 'Serenazgo La Molina', desc: 'Atención inmediata', tel: '313-4495', icon: 'shield-alt' },
    ],
    recomendaciones: [
      'Evite mostrar artículos de valor (celular, joyas) al salir de centros comerciales.',
      'Mantente alerta a motocicletas con dos ocupantes, especialmente las de color negro.',
      'Si eres víctima, no opongas resistencia. Los objetos materiales se recuperan, la vida no.'
    ],
    similares: [
      { titulo: 'Robo a mano armada', lugar: 'CC. La Fontana, estacionamiento', tiempo: 'Hace 2 días', confiabilidad: '90% confirmado' },
      { titulo: 'Arrebato de celular', lugar: 'Av. La Molina cdra 5', tiempo: 'Hace 3 días', confiabilidad: '80% confirmado' },
    ]
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
    estado: 'Activo',
    latlng: { latitude: -12.061, longitude: -77.038 },
    validaciones: { confirmaciones: 12, rechazos: 1, confiabilidad: 92 },
    objetos: [],
    sospechosos: [],
    comentarios: [],
    autoridades: [],
    recomendaciones: [],
    similares: []
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
    estado: 'Resuelto',
    latlng: { latitude: -12.063, longitude: -77.034 },
    validaciones: { confirmaciones: 8, rechazos: 0, confiabilidad: 100 },
    objetos: [],
    sospechosos: [],
    comentarios: [],
    autoridades: [],
    recomendaciones: [],
    similares: []
  },
  {
    id: '4',
    tipo: 'Extorsión',
    icon: 'phone-slash',
    color: '#a21caf',
    titulo: 'Intento de extorsión',
    descripcion: 'Nuevo incidente reportado en la zona.',
    direccion: 'Cerca de tu ubicación',
    tiempo: 'Ahora mismo',
    estado: 'Activo',
    latlng: { latitude: -12.060, longitude: -77.037 },
    validaciones: { confirmaciones: 5, rechazos: 0, confiabilidad: 100 },
    objetos: [],
    sospechosos: [],
    comentarios: [],
    autoridades: [],
    recomendaciones: [],
    similares: []
  },
  {
    id: '5',
    tipo: 'Sospechoso',
    icon: 'user-secret',
    color: '#f59e42',
    titulo: 'Actividad sospechosa',
    descripcion: 'Nuevo incidente reportado en la zona.',
    direccion: 'Cerca de tu ubicación',
    tiempo: 'Ahora mismo',
    estado: 'Activo',
    latlng: { latitude: -12.059, longitude: -77.036 },
    validaciones: { confirmaciones: 3, rechazos: 0, confiabilidad: 100 },
    objetos: [],
    sospechosos: [],
    comentarios: [],
    autoridades: [],
    recomendaciones: [],
    similares: []
  },
];

interface Reporte {
  id: number;
  tipo: string;
  titulo: string;
  descripcion: string;
  direccion: string;
  estado: string;
  latitud?: number;
  longitud?: number;
  fecha?: string;
  anonimo?: boolean;
  foto_url?: string;
}

export default function ReportsScreen({ navigation }: any) {
  const { usuario } = useUser();
  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [reportesData, setReportesData] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);

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
    setCargando(false);
  };

  const confirmarReporte = async (reporte: Reporte) => {
    try {
      const response = await fetch(ENDPOINTS.CONFIRMAR_REPORTE(reporte.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario_id: usuario?.id || 1 }), // Usar el ID del usuario autenticado
      });
      
      if (response.ok) {
        // Actualiza localmente y recarga desde servidor
        setReportesData(prev => prev.map(r => r.id === reporte.id ? { ...r, estado: 'Resuelto' } : r));
        cargarReportes(); // Recarga datos actualizados
      }
    } catch (error) {
      console.log('Error confirmando reporte:', error);
    }
  };

  const reportesFiltrados = reportesData.filter(r =>
    (filtro === 'Todos' || r.tipo === filtro) &&
    (r.titulo.toLowerCase().includes(busqueda.toLowerCase()) || r.direccion.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reportes de Incidentes</Text>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginLeft: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por tipo o ubicación"
          placeholderTextColor="#aaa"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>
      {/* Filtros horizontales */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContainer}>
        {tiposReporte.map((t) => (
          <TouchableOpacity
            key={t.tipo}
            style={[styles.filterBtn, filtro === t.tipo && styles.filterBtnActive]}
            onPress={() => setFiltro(t.tipo)}
          >
            <FontAwesome5 name={t.icon} size={16} color={filtro === t.tipo ? '#fff' : t.color} style={{ marginRight: 6 }} />
            <Text style={[styles.filterText, filtro === t.tipo && styles.filterTextActive]}>{t.tipo}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Lista de reportes */}
      {cargando ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Cargando reportes...</Text>
        </View>
      ) : (
        <FlatList
          data={reportesFiltrados}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('ReporteDetalle', { reporte: item })} activeOpacity={0.85}>
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
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <Text style={[styles.reportStatus, item.estado === 'Resuelto' ? styles.statusResolved : styles.statusActive]}>{item.estado}</Text>
                    <TouchableOpacity style={styles.confirmBtn} onPress={() => confirmarReporte(item)}>
                      <Ionicons name="checkmark-circle-outline" size={16} color="#2563eb" />
                      <Text style={styles.confirmBtnText}>Confirmar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mapBtn}>
                      <Ionicons name="map-outline" size={16} color="#2563eb" />
                      <Text style={styles.mapBtnText}>Ver en Mapa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe',
    paddingTop: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 18,
    marginBottom: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 8,
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
  filtersScroll: {
    marginLeft: 8,
    marginBottom: 8,
    maxHeight: 44,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  filterBtnActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterText: {
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#fff',
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 12,
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
  reportStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusActive: {
    backgroundColor: '#fef08a',
    color: '#b45309',
  },
  statusResolved: {
    backgroundColor: '#d1fae5',
    color: '#047857',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
  },
  confirmBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 3,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  mapBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 3,
  },
}); 