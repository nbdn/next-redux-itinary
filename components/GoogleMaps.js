import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  withGoogleMap
} from 'react-google-maps';

const GoogleMapsComponent = withGoogleMap(({ directions, places, zoom }) => {
  return (
    <GoogleMap
      defaultZoom={zoom}
      defaultCenter={{
        lat: 48.864716,
        lng: 2.329014
      }}
    >
      {directions && <DirectionsRenderer directions={directions} />}
      {places.map(place => (
        <Marker
          key={`marker_place_${place.id}`}
          position={{
            lat: place.geometry.lat,
            lng: place.geometry.lng
          }}
        />
      ))}
    </GoogleMap>
  );
});

GoogleMapsComponent.defaultProps = {
  containerElement: <div style={{ height: '100vh', width: '80vw' }} />,
  mapElement: <div style={{ height: '100%' }} />,
  zoom: 13,
  places: []
};

export default GoogleMapsComponent;
