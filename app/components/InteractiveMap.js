'use client';

import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const InteractiveMap = () => {
  const [mapCenter, setMapCenter] = useState({ lat: -6.200000, lng: 106.816666 });
  const [zoom, setZoom] = useState(12);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Load settings from localStorage on the client side
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.mapLatitude && settings.mapLongitude) {
        setMapCenter({
          lat: settings.mapLatitude,
          lng: settings.mapLongitude
        });
      }
      if (settings.mapZoom) {
        setZoom(settings.mapZoom);
      }
      if (settings.mapMarkers) {
        setMarkers(settings.mapMarkers);
      }
    }
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={zoom}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.name}
        />
      ))}
    </GoogleMap>
  );
};

export default InteractiveMap;