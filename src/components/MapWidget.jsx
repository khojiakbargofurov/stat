import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapWidget = ({ data }) => {
  // Center of Tashkent Region approximately
  const center = [41.3, 69.8];

  return (
    <div className="glass-panel">
      <div className="section-header">
        <MapPin size={24} />
        <h2>Turizm xaritasi</h2>
      </div>
      <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <MapContainer center={center} zoom={8} scrollWheelZoom={true} style={{ height: '500px', width: '100%', borderRadius: '12px' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {data.map((place) => (
            <Marker key={place.id} position={[place.lat, place.lng]}>
              <Popup>
                <div style={{ color: '#0f172a' }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{place.name}</h3>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold' }}>{place.category} | {place.type}</p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>{place.address}, {place.region}</p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>{place.description}</p>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    fontSize: '11px', 
                    background: '#e0e7ff',
                    color: '#3b82f6',
                    marginTop: '5px'
                  }}>Mashhurlik: {place.popularity}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapWidget;
