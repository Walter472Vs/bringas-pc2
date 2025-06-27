import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const ejemploReporte = {
  id: '1',
  tipo: 'Robo',
  icon: 'mask',
  color: '#ef4444',
  titulo: 'Robo a mano armada',
  descripcion: 'Dos individuos en motocicleta (Pulsar negra 200cc) interceptaron a un transeúnte a la salida del centro comercial. Ambos estaban armados con pistola y cuchillo. Le robaron un celular de alta gama, billetera con documentos y dinero en efectivo (aprox. S/.500). La víctima no sufrió daños físicos pero quedó en estado de shock. Los asaltantes huyeron en dirección hacia Av. La Molina.',
  direccion: 'Av. Javier Prado Este 5460, La Molina, Lima - Frente al C.C. La Fontana',
  tiempo: 'Reportado hace 35 minutos',
  estado: 'Activo',
  latlng: { latitude: -12.085, longitude: -76.971 },
  distancia: '1.2 km',
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
};

export default function ReporteDetalleScreen({ route, navigation }: any) {
  // En producción, usar route.params.reporte
  const reporte = route.params?.reporte || ejemploReporte;
  const validaciones = reporte.validaciones || { confirmaciones: 0, rechazos: 0, confiabilidad: 0 };
  const objetos = reporte.objetos || [];
  const sospechosos = reporte.sospechosos || [];
  const comentarios = reporte.comentarios || [];
  const autoridades = reporte.autoridades || [];
  const recomendaciones = reporte.recomendaciones || [];
  const similares = reporte.similares || [];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: reporte.color }]}> 
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 12, top: 18 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{reporte.titulo}</Text>
        <Text style={styles.headerTime}>{reporte.tiempo}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <View style={[styles.statusDot, { backgroundColor: reporte.estado === 'Activo' ? '#ef4444' : '#22c55e' }]} />
          <Text style={styles.headerStatus}>{reporte.estado}</Text>
        </View>
      </View>
      {/* Mapa */}
      {reporte.latlng && reporte.latlng.latitude && reporte.latlng.longitude ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: reporte.latlng.latitude,
            longitude: reporte.latlng.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker coordinate={reporte.latlng}>
            <FontAwesome5 name={reporte.icon} size={32} color={reporte.color} />
          </Marker>
        </MapView>
      ) : (
        <View style={{ height: 160, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee', borderRadius: 16, margin: 10 }}>
          <Text style={{ color: '#888' }}>Ubicación no disponible</Text>
        </View>
      )}
      {/* Ubicación */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}><Ionicons name="location" size={18} color="#2563eb" /> Ubicación</Text>
        <Text style={styles.cardAddress}>{reporte.direccion}</Text>
        <Text style={styles.cardDist}><Ionicons name="navigate" size={14} color="#888" /> A {reporte.distancia} de tu ubicación</Text>
      </View>
      {/* Descripción */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}><Ionicons name="document-text-outline" size={18} color="#2563eb" /> Descripción</Text>
        <Text style={styles.cardDesc}>{reporte.descripcion}</Text>
      </View>
      {/* Validaciones */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}><Ionicons name="checkmark-done-circle" size={18} color="#2563eb" /> Validaciones</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Text style={styles.valNum}>{validaciones.confirmaciones}</Text>
          <Text style={styles.valLabel}>Confirmaciones</Text>
          <Text style={styles.valNum}>{validaciones.rechazos}</Text>
          <Text style={styles.valLabel}>Rechazos</Text>
          <Text style={styles.valNum}>{validaciones.confiabilidad}%</Text>
          <Text style={styles.valLabel}>Confiabilidad</Text>
        </View>
        <View style={styles.valBarBg}>
          <View style={[styles.valBar, { width: `${validaciones.confiabilidad}%` }]} />
        </View>
        <TouchableOpacity style={styles.confirmBtn}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#2563eb" />
          <Text style={styles.confirmBtnText}>Confirmar incidente</Text>
        </TouchableOpacity>
      </View>
      {/* Objetos sustraídos */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}><Ionicons name="cube-outline" size={18} color="#2563eb" /> Objetos sustraídos</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
          {objetos.map((obj: any, i: number) => (
            <View key={i} style={styles.objTag}>
              <Text style={styles.objTagText}>{obj}</Text>
            </View>
          ))}
        </View>
      </View>
      {/* Características de sospechosos */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}><Ionicons name="people" size={18} color="#2563eb" /> Características de los sospechosos</Text>
        {sospechosos.map((s: any, i: number) => (
          <View key={i} style={styles.sospechosoBox}>
            <Ionicons name="person-circle-outline" size={32} color="#888" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sospechosoNombre}>{s.nombre}</Text>
              <Text style={styles.sospechosoDesc}>{s.desc}</Text>
            </View>
          </View>
        ))}
      </View>
      {/* Comentarios */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}><Ionicons name="chatbubble-ellipses-outline" size={18} color="#2563eb" /> Comentarios ({comentarios.length})</Text>
        {comentarios.map((c: any, i: number) => (
          <View key={i} style={styles.comentarioBox}>
            <Ionicons name="person-circle-outline" size={28} color="#888" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.comentarioUsuario}>{c.usuario} <Text style={styles.comentarioTiempo}>{c.tiempo}</Text></Text>
              <Text style={styles.comentarioTexto}>{c.texto}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>Ver todos los comentarios</Text>
        </TouchableOpacity>
      </View>
      {/* Contacto con autoridades */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}><Ionicons name="call" size={18} color="#2563eb" /> Contacto con autoridades</Text>
        {autoridades.map((a: any, i: number) => (
          <View key={i} style={styles.autoridadBox}>
            <FontAwesome5 name={a.icon} size={20} color="#2563eb" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.autoridadNombre}>{a.nombre}</Text>
              <Text style={styles.autoridadDesc}>{a.desc}</Text>
            </View>
            <Text style={styles.autoridadTel}>{a.tel}</Text>
          </View>
        ))}
      </View>
      {/* Recomendaciones */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}><Ionicons name="shield-checkmark" size={18} color="#2563eb" /> Recomendaciones de seguridad</Text>
        {recomendaciones.map((rec: any, i: number) => (
          <Text key={i} style={styles.recomendacionItem}>• {rec}</Text>
        ))}
      </View>
      {/* Incidentes similares */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}><Ionicons name="refresh-circle" size={18} color="#2563eb" /> Incidentes similares en la zona</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {similares.map((sim: any, i: number) => (
            <View key={i} style={styles.similarBox}>
              <Text style={styles.similarTitulo}>{sim.titulo}</Text>
              <Text style={styles.similarLugar}>{sim.lugar}</Text>
              <Text style={styles.similarTiempo}>{sim.tiempo}</Text>
              <Text style={styles.similarConf}>{sim.confiabilidad}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0f2fe' },
  header: { paddingTop: 36, paddingBottom: 16, alignItems: 'center', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  headerTime: { color: '#fff', fontSize: 13, marginTop: 2 },
  headerStatus: { color: '#fff', fontWeight: 'bold', marginLeft: 6 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 4 },
  map: { width: '100%', height: 160, marginTop: 10, borderRadius: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, margin: 10, padding: 14, elevation: 2 },
  cardTitle: { fontWeight: 'bold', color: '#2563eb', fontSize: 15, marginBottom: 4 },
  cardAddress: { fontWeight: 'bold', color: '#222', fontSize: 14 },
  cardDist: { color: '#888', fontSize: 13, marginTop: 2 },
  cardDesc: { color: '#555', fontSize: 14, marginTop: 2 },
  valNum: { fontWeight: 'bold', color: '#2563eb', fontSize: 16, marginRight: 4, marginLeft: 8 },
  valLabel: { color: '#555', fontSize: 13, marginRight: 8 },
  valBarBg: { height: 8, backgroundColor: '#e0e7ff', borderRadius: 6, marginVertical: 6 },
  valBar: { height: 8, backgroundColor: '#2563eb', borderRadius: 6 },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e7ff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginTop: 8, alignSelf: 'flex-start' },
  confirmBtnText: { color: '#2563eb', fontWeight: 'bold', fontSize: 15, marginLeft: 5 },
  objTag: { backgroundColor: '#e0e7ff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8, marginBottom: 6 },
  objTagText: { color: '#2563eb', fontWeight: 'bold', fontSize: 13 },
  sospechosoBox: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  sospechosoNombre: { fontWeight: 'bold', color: '#222', fontSize: 14 },
  sospechosoDesc: { color: '#555', fontSize: 13 },
  comentarioBox: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  comentarioUsuario: { fontWeight: 'bold', color: '#222', fontSize: 13 },
  comentarioTiempo: { color: '#888', fontWeight: 'normal', fontSize: 12 },
  comentarioTexto: { color: '#555', fontSize: 13 },
  seeAllBtn: { alignSelf: 'flex-end', marginTop: 2 },
  seeAllText: { color: '#2563eb', fontWeight: 'bold', fontSize: 14 },
  autoridadBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0f2fe', borderRadius: 10, padding: 10, marginBottom: 6 },
  autoridadNombre: { fontWeight: 'bold', color: '#2563eb', fontSize: 14 },
  autoridadDesc: { color: '#555', fontSize: 12 },
  autoridadTel: { color: '#222', fontWeight: 'bold', fontSize: 15, marginLeft: 10 },
  recomendacionItem: { color: '#555', fontSize: 13, marginBottom: 2 },
  similarBox: { backgroundColor: '#f3f4f6', borderRadius: 10, padding: 10, marginRight: 10, minWidth: 140 },
  similarTitulo: { fontWeight: 'bold', color: '#222', fontSize: 13 },
  similarLugar: { color: '#555', fontSize: 12 },
  similarTiempo: { color: '#888', fontSize: 12 },
  similarConf: { color: '#047857', fontWeight: 'bold', fontSize: 13 },
}); 