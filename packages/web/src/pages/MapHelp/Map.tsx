import React from 'react';

// Focado 100% para funcionar no Navegador (Safari/Chrome)
export default function MapHelp() {
  // Coordenadas de Castanhal
  const lat = -1.2935;
  const lon = -47.9245;

  return (
    <div style={styles.container}>
      {/* Cabeçalho Profissional */}
      <div style={styles.header}>
        <div style={styles.badge}>AJ</div>
        <h2 style={styles.headerTitle}>Mapa de Ajuda - Castanhal</h2>
      </div>

      {/* Barra de Filtros (Visual da sua foto) */}
      <div style={styles.filterBar}>
        <button style={{...styles.filterBtn, backgroundColor: '#7B42F6', color: '#fff'}}>🟣 Todos</button>
        <button style={styles.filterBtn}>🤍 Pedidos</button>
        <button style={styles.filterBtn}>🤍 Pontos</button>
      </div>

      {/* O MAPA (Uso do OpenStreetMap via Iframe - Super leve e sem bugs) */}
      <div style={styles.mapWrapper}>
        <iframe
          title="map"
          width="100%"
          height="100%"
          frameBorder="0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.02},${lat-0.01},${lon+0.02},${lat+0.01}&layer=mapnik&marker=${lat},${lon}`}
          style={{ border: 'none' }}
        />
      </div>

      {/* Legenda do Mapa */}
      <div style={styles.legend}>
        <strong style={{ display: 'block', marginBottom: '10px' }}>Legenda do Mapa</strong>
        <div style={styles.legendItem}><span style={{...styles.dot, backgroundColor: '#E74C3C'}}></span> Pedidos de ajuda</div>
        <div style={styles.legendItem}><span style={{...styles.dot, backgroundColor: '#F39C12'}}></span> Em atendimento</div>
        <div style={styles.legendItem}><span style={{...styles.dot, backgroundColor: '#27AE60'}}></span> Pontos de acesso</div>
      </div>
    </div>
  );
}

// Estilos que o navegador entende perfeitamente
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    height: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee'
  },
  badge: {
    backgroundColor: '#7B42F6',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '8px',
    fontWeight: 'bold' as 'bold',
    marginRight: '15px'
  },
  headerTitle: { fontSize: '18px', margin: 0 },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px',
    borderBottom: '1px solid #ddd'
  },
  filterBtn: {
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    width: '30%'
  },
  mapWrapper: { flex: 1, backgroundColor: '#e5e3df' },
  legend: {
    position: 'absolute' as 'absolute',
    bottom: '40px',
    left: '20px',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    zIndex: 1000
  },
  legendItem: { display: 'flex', alignItems: 'center', margin: '5px 0', fontSize: '14px' },
  dot: { width: '12px', height: '12px', borderRadius: '50%', marginRight: '10px' }
};