import React, { useState } from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';

const mapStyles = {
  height: '400px',
  position: 'relative',
  width: '100%'
};

function VaxMap({ locations, reports, google }) {
  const [activeMarker, setActiveMarker] = useState({});
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const [selectedPlace, selectPlace] = useState({ name: '' });
  const [showMarkerInfo, toggleInfoWindow] = useState(false);

  const updateMarker = (props, marker, markerId) => {
    selectPlace(props);
    setActiveMarker(marker);
    setActiveMarkerId(markerId);
    toggleInfoWindow(true);
  }

  return (
      <Map
        google={google}
        zoom={12}
        style={mapStyles}
        initialCenter={
          {
            lat: 37.7749,
            lng: -122.4194
          }
        }
    >
      {
        locations.map((location, idx) => {
          return (
            <Marker
              key={idx}
              name={location.name}
              onClick={(props, marker) => updateMarker(props, marker, location.id)}
              position={location.position}>
              </Marker>
          );
        })
      }
      <InfoWindow visible={showMarkerInfo} marker={activeMarker} onClose={() => toggleInfoWindow(false)}>
        <div className="marker-info">
          <h3>{selectedPlace.name || 'Vaccination Center'}</h3>
          <p>Attempts: {reports?.filter(report => report.locationId === activeMarkerId).length || 0}</p>
          <p>Success: {reports?.filter(report => report.locationId === activeMarkerId && report.success).length || 0}</p>
          <p>Failures: {reports?.filter(report => report.locationId === activeMarkerId && !report.success).length || 0}</p>
        </div>
      </InfoWindow>
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GAPI_KEY
})(VaxMap);