"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const InteractiveMap = () => {
  const initialPosition = [-2.5489, 118.0149]; // Center of Indonesia
  const locations = [
    {
      position: [-6.2088, 106.8456],
      name: "Basecamp MAPALA Jakarta",
      description: "Titik kumpul utama untuk semua kegiatan di area Jabodetabek.",
    },
    {
      position: [-7.9425, 112.9533],
      name: "Gunung Bromo",
      description: "Salah satu destinasi pendakian paling ikonik di Jawa Timur.",
    },
    {
      position: [-8.4103, 116.4053],
      name: "Gunung Rinjani",
      description: "Gunung berapi tertinggi kedua di Indonesia, terletak di Lombok.",
    },
    {
      position: [-8.5833, 119.5],
      name: "Taman Nasional Komodo",
      description: "Habitat asli Komodo dan spot diving kelas dunia.",
    },
  ];

  return (
    <MapContainer center={initialPosition} zoom={5} style={{ height: '450px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((loc, index) => (
        <Marker key={index} position={loc.position}>
          <Popup>
            <b>{loc.name}</b><br />{loc.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default InteractiveMap;