const PlacesService = {
  fetchPlaceInfos: (geocoder, placeId) => {
    return new Promise(resolve => {
      geocoder.geocode({ placeId: placeId }, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            resolve({ response: results[0] });
          } else {
            resolve({ error: 'No results found' });
          }
        } else {
          resolve({ error: 'Geocoder failed due to: ' + status });
        }
      });
    });
  },

  optimizeItinary: orderedPlacesIds => {
    return new Promise(resolve => {
      fetch(`./itinary/optimize?placesIds=${orderedPlacesIds.join(',')}`)
        .then(res => res.json())
        .then(resJson => {
          try {
            const { optimizedPlacesIds } = resJson;
            resolve({ response: optimizedPlacesIds });
          } catch (e) {
            resolve({ error: e });
          }
        });
    });
  }
};

export default PlacesService;
