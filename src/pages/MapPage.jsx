import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation, Map as MapIcon, Route, Globe } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to center map on selection
const MapController = ({ center }) => {
  const map = useMap();
  if (center) {
    map.flyTo(center, 12, { animate: true });
  }
  return null;
};

const MapPage = ({ data }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [viewType, setViewType] = useState('satellite'); // 'standard', 'roads', 'satellite'
  const tplCenter = [41.3, 69.8];

  const mapLayers = {
    standard: {
      url: 'http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps'
    },
    roads: {
      url: 'http://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps'
    },
    satellite: {
      url: 'http://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps'
    }
  };

  const handleSelect = (place) => {
    setSelectedPlace(place);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="section-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MapPin size={28} />
          <h1>Raqamli Xarita</h1>
        </div>

        <div className="glass-panel" style={{ padding: '4px', display: 'flex', gap: '4px', borderRadius: '12px' }}>
          <button 
            onClick={() => setViewType('standard')}
            className={`btn ${viewType === 'standard' ? 'btn-primary' : ''}`}
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.8rem', 
              borderRadius: '8px',
              background: viewType === 'standard' ? '' : 'transparent',
              boxShadow: viewType === 'standard' ? '' : 'none',
              color: viewType === 'standard' ? 'white' : 'var(--text-secondary)'
            }}
          >
            <MapIcon size={16} />
            <span className="hide-mobile" style={{ marginLeft: '8px' }}>Oddiy</span>
          </button>
          <button 
            onClick={() => setViewType('roads')}
            className={`btn ${viewType === 'roads' ? 'btn-primary' : ''}`}
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.8rem', 
              borderRadius: '8px',
              background: viewType === 'roads' ? '' : 'transparent',
              boxShadow: viewType === 'roads' ? '' : 'none',
              color: viewType === 'roads' ? 'white' : 'var(--text-secondary)'
            }}
          >
            <Route size={16} />
            <span className="hide-mobile" style={{ marginLeft: '8px' }}>Yo'llar</span>
          </button>
          <button 
            onClick={() => setViewType('satellite')}
            className={`btn ${viewType === 'satellite' ? 'btn-primary' : ''}`}
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.8rem', 
              borderRadius: '8px',
              background: viewType === 'satellite' ? '' : 'transparent',
              boxShadow: viewType === 'satellite' ? '' : 'none',
              color: viewType === 'satellite' ? 'white' : 'var(--text-secondary)'
            }}
          >
            <Globe size={16} />
            <span className="hide-mobile" style={{ marginLeft: '8px' }}>Sputnik</span>
          </button>
        </div>
      </div>

      <div className="map-page-layout">
        <div className="map-list-panel glass-panel">
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
             Toshkent Hududlari ({data.length})
          </h3>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
            {data.map(place => (
              <div 
                key={place.id} 
                className={`location-card ${selectedPlace?.id === place.id ? 'selected' : ''}`}
                onClick={() => handleSelect(place)}
              >
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{place.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{place.region}</span>
                  <span style={{ color: 'var(--accent)' }}>{place.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="map-view-panel">
          <MapContainer 
            key={viewType} // Force re-render map container when layer changes to refresh tiles
            center={tplCenter} 
            zoom={8} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution={mapLayers[viewType].attribution}
              url={mapLayers[viewType].url}
            />
            {selectedPlace && <MapController center={[selectedPlace.lat, selectedPlace.lng]} />}
            
            {data.map((place) => (
              <Marker key={place.id} position={[place.lat, place.lng]}>
                <Popup>
                  <div style={{ color: '#0f172a', minWidth: '200px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>{place.name}</h3>
                    <p style={{ margin: '0 0 5px 0', fontSize: '13px', fontWeight: 'bold' }}>{place.category}</p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}><Navigation size={12} style={{verticalAlign: 'middle', marginRight: '4px'}}/> {place.address}</p>
                    <p style={{ margin: '8px 0', fontSize: '12px', fontStyle: 'italic' }}>{place.description}</p>
                    
                    <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', background: '#dbeafe', color: '#1e40af' }}>
                        {place.popularity} popularity
                      </span>
                      <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', background: '#fef3c7', color: '#b45309' }}>
                        {place.season}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapPage;


