import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { BarChart, ProgressChart } from 'react-native-chart-kit';
import { ENDPOINTS } from '../config/api';

const screenWidth = Dimensions.get('window').width;

const periods = [
  { label: 'Semana', value: 'week' },
  { label: 'Mes', value: 'month' },
  { label: 'Año', value: 'year' },
];

export default function StatsScreen() {
  const [period, setPeriod] = useState('week');
  const [statsData, setStatsData] = useState({
    securityLevel: 62,
    securityLabel: 'Medio',
    securityTrend: -5,
    incidentsByType: {
      labels: ['Robos', 'Extorsiones', 'Sospechosos', 'Accidentes'],
      data: [32, 16, 24, 6],
      colors: ['#ef4444', '#a21caf', '#f59e42', '#3b82f6'],
    },
    activityByHour: {
      labels: ['0h', '2h', '4h', '6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'],
      data: [2, 1, 1, 2, 4, 6, 8, 7, 5, 6, 9, 10],
    },
    metrics: [
      { value: 78, title: 'Total incidentes', trend: 12, trendType: 'increase' },
      { value: 32, title: 'Robos', trend: 8, trendType: 'increase' },
      { value: 16, title: 'Extorsiones', trend: 25, trendType: 'increase' },
      { value: 24, title: 'Sospechosos', trend: -5, trendType: 'decrease' },
    ],
    hotspots: [
      { rank: 1, name: 'Av. Principal / Jr. Libertad', incidents: 12, trend: 15 },
      { rank: 2, name: 'Mercado Central', incidents: 10, trend: 8 },
      { rank: 3, name: 'Parque Las Américas', incidents: 8, trend: -12 },
      { rank: 4, name: 'Estación Central', incidents: 7, trend: 0 },
    ],
    alert: {
      title: 'Alerta oficial',
      desc: 'La policía ha incrementado patrullaje en el sector norte. Mayor presencia entre 8PM y 2AM.',
      time: 'Hace 2 horas',
    },
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const response = await fetch(ENDPOINTS.ESTADISTICAS);
      if (response.ok) {
        const data = await response.json();
        setStatsData(prev => ({
          ...prev,
          metrics: [
            { value: data.total, title: 'Total incidentes', trend: 12, trendType: 'increase' },
            { value: data.robos, title: 'Robos', trend: 8, trendType: 'increase' },
            { value: data.extorsiones, title: 'Extorsiones', trend: 25, trendType: 'increase' },
            { value: data.sospechosos, title: 'Sospechosos', trend: -5, trendType: 'decrease' },
          ],
          incidentsByType: {
            ...prev.incidentsByType,
            data: [data.robos, data.extorsiones, data.sospechosos, 6] // Accidentes fijo por ahora
          }
        }));
      }
    } catch (error) {
      console.log('Error cargando estadísticas:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado y selector de periodo */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Estadísticas de Seguridad</Text>
        <TouchableOpacity style={styles.filterBtn}><Ionicons name="options-outline" size={20} color="#2563eb" /></TouchableOpacity>
      </View>
      <View style={styles.periodRow}>
        {periods.map((p) => (
          <TouchableOpacity
            key={p.value}
            style={[styles.periodBtn, period === p.value && styles.periodBtnActive]}
            onPress={() => setPeriod(p.value)}
          >
            <Text style={[styles.periodBtnText, period === p.value && styles.periodBtnTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Nivel de seguridad */}
      <View style={styles.securityCard}>
        <Text style={styles.securityTitle}>Nivel de Seguridad</Text>
        <View style={styles.securityGaugeRow}>
          <ProgressChart
            data={{ data: [statsData.securityLevel / 100] }}
            width={120}
            height={120}
            strokeWidth={12}
            radius={48}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: () => '#2563eb',
              strokeWidth: 2,
            }}
            hideLegend={true}
          />
          <View style={styles.securityGaugeValueBox}>
            <Text style={styles.securityGaugeValue}>{statsData.securityLevel}</Text>
            <Text style={styles.securityGaugeLabel}>{statsData.securityLabel}</Text>
          </View>
        </View>
        <Text style={[styles.securityTrend, statsData.securityTrend < 0 ? styles.trendDown : styles.trendUp]}>
          {statsData.securityTrend < 0 ? '↓' : '↑'} {Math.abs(statsData.securityTrend)}% esta semana
        </Text>
      </View>
      {/* Gráfico de incidentes por tipo */}
      <View style={styles.statsCard}>
        <Text style={styles.statsCardTitle}>Incidentes por tipo</Text>
        <BarChart
          data={{
            labels: statsData.incidentsByType.labels,
            datasets: [{ data: statsData.incidentsByType.data }],
          }}
          width={screenWidth - 32}
          height={180}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
            barPercentage: 0.6,
            fillShadowGradient: '#2563eb',
            fillShadowGradientOpacity: 1,
            labelColor: () => '#222',
          }}
          fromZero
          showValuesOnTopOfBars
          style={{ borderRadius: 12, marginTop: 8 }}
        />
      </View>
      {/* Gráfico de actividad por hora */}
      <View style={styles.statsCard}>
        <Text style={styles.statsCardTitle}>Actividad por hora</Text>
        <BarChart
          data={{
            labels: statsData.activityByHour.labels,
            datasets: [{ data: statsData.activityByHour.data }],
          }}
          width={screenWidth - 32}
          height={180}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(251, 113, 133, ${opacity})`,
            barPercentage: 0.7,
            fillShadowGradient: '#fb7185',
            fillShadowGradientOpacity: 1,
            labelColor: () => '#222',
          }}
          fromZero
          showValuesOnTopOfBars
          style={{ borderRadius: 12, marginTop: 8 }}
        />
        <View style={styles.chartLegendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#DB4437' }]} />
          <Text style={styles.legendLabel}>Alto riesgo</Text>
          <View style={[styles.legendDot, { backgroundColor: '#F4B400' }]} />
          <Text style={styles.legendLabel}>Riesgo moderado</Text>
          <View style={[styles.legendDot, { backgroundColor: '#0F9D58' }]} />
          <Text style={styles.legendLabel}>Bajo riesgo</Text>
        </View>
      </View>
      {/* Métricas rápidas */}
      <View style={styles.metricsRow}>
        {statsData.metrics.map((m, i) => (
          <View key={i} style={styles.metricCard}>
            <Text style={styles.metricValue}>{m.value}</Text>
            <Text style={styles.metricTitle}>{m.title}</Text>
            <Text style={[styles.metricTrend, m.trendType === 'increase' ? styles.trendUp : styles.trendDown]}>
              <Ionicons name={m.trendType === 'increase' ? 'arrow-up' : 'arrow-down'} size={14} /> {Math.abs(m.trend)}%
            </Text>
          </View>
        ))}
      </View>
      {/* Zonas de mayor incidencia */}
      <View style={styles.statsCard}>
        <Text style={styles.statsCardTitle}>Zonas de mayor incidencia</Text>
        {statsData.hotspots.map((h, i) => (
          <View key={i} style={styles.hotspotItem}>
            <View style={styles.hotspotRank}>
              <Text style={styles.hotspotRankText}>{h.rank}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hotspotName}>{h.name}</Text>
              <View style={styles.hotspotStatsRow}>
                <Text style={styles.hotspotIncidents}>{h.incidents} incidentes</Text>
                <Text style={[styles.hotspotTrend, h.trend > 0 ? styles.trendUp : h.trend < 0 ? styles.trendDown : styles.trendNeutral]}>
                  {h.trend > 0 ? '↑' : h.trend < 0 ? '↓' : ''} {Math.abs(h.trend)}%
                </Text>
              </View>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.viewOnMapBtn}>
          <FontAwesome5 name="map-marked-alt" size={18} color="#2563eb" />
          <Text style={styles.viewOnMapText}>Ver en mapa</Text>
        </TouchableOpacity>
      </View>
      {/* Alerta oficial */}
      <View style={styles.alertCard}>
        <Ionicons name="megaphone-outline" size={32} color="#f59e42" style={{ marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.alertTitle}>{statsData.alert.title}</Text>
          <Text style={styles.alertDesc}>{statsData.alert.desc}</Text>
          <Text style={styles.alertTime}>{statsData.alert.time}</Text>
        </View>
      </View>
      {/* Botón flotante para reportar */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, marginHorizontal: 16 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#2563eb' },
  filterBtn: { backgroundColor: '#e0e7ff', borderRadius: 8, padding: 6 },
  periodRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 8 },
  periodBtn: { paddingHorizontal: 18, paddingVertical: 7, borderRadius: 16, backgroundColor: '#fff', marginHorizontal: 4, borderWidth: 1, borderColor: '#e0e7ff' },
  periodBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  periodBtnText: { color: '#222', fontWeight: 'bold', fontSize: 15 },
  periodBtnTextActive: { color: '#fff' },
  securityCard: { backgroundColor: '#fff', borderRadius: 18, margin: 14, padding: 18, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  securityTitle: { fontWeight: 'bold', color: '#2563eb', fontSize: 18, marginBottom: 8 },
  securityGaugeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  securityGaugeValueBox: { position: 'absolute', left: 44, top: 36, alignItems: 'center' },
  securityGaugeValue: { fontSize: 36, fontWeight: 'bold', color: '#2563eb' },
  securityGaugeLabel: { color: '#888', fontWeight: 'bold', fontSize: 16 },
  securityTrend: { fontWeight: 'bold', fontSize: 15, marginTop: 2, textAlign: 'center' },
  trendUp: { color: '#22c55e' },
  trendDown: { color: '#ef4444' },
  trendNeutral: { color: '#888' },
  statsCard: { backgroundColor: '#fff', borderRadius: 18, margin: 14, padding: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  statsCardTitle: { fontWeight: 'bold', color: '#2563eb', fontSize: 17, marginBottom: 8 },
  chartLegendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, flexWrap: 'wrap' },
  legendDot: { width: 18, height: 18, borderRadius: 9, marginRight: 8 },
  legendLabel: { color: '#555', fontSize: 15, marginRight: 18 },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: 8, marginTop: 8 },
  metricCard: { backgroundColor: '#fff', borderRadius: 14, padding: 18, alignItems: 'center', flexBasis: '47%', minWidth: 150, maxWidth: '48%', marginHorizontal: 4, marginVertical: 6, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
  metricValue: { fontSize: 28, fontWeight: 'bold', color: '#2563eb', marginBottom: 2 },
  metricTitle: { color: '#555', fontSize: 15, marginTop: 2, textAlign: 'center' },
  metricTrend: { fontWeight: 'bold', fontSize: 15, marginTop: 6, flexDirection: 'row', alignItems: 'center' },
  hotspotItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  hotspotRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  hotspotRankText: { color: '#fff', fontWeight: 'bold', fontSize: 17, textAlign: 'center', lineHeight: 32 },
  hotspotName: { fontWeight: 'bold', color: '#222', fontSize: 15 },
  hotspotStatsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  hotspotIncidents: { color: '#555', fontSize: 14, marginRight: 8 },
  hotspotTrend: { fontWeight: 'bold', fontSize: 14 },
  viewOnMapBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 12, backgroundColor: '#e0e7ff', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10, minWidth: 180, justifyContent: 'center' },
  viewOnMapText: { color: '#2563eb', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  alertCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbe6', borderRadius: 16, margin: 14, padding: 18, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  alertTitle: { fontWeight: 'bold', color: '#f59e42', fontSize: 16 },
  alertDesc: { color: '#555', fontSize: 14, marginTop: 2 },
  alertTime: { color: '#888', fontSize: 13, marginTop: 2 },
  fab: { position: 'absolute', bottom: 32, right: 24, backgroundColor: '#2563eb', borderRadius: 32, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
}); 