const parseGooglePlace = (googlePlace, stepNum, inputId) => {
  const parsedPlace = {
    address: '',
    id: googlePlace.place_id,
    inputId: inputId,
    stepNum: stepNum
  };

  if (googlePlace.address_components) {
    parsedPlace.address = [
      (googlePlace.address_components[0] &&
        googlePlace.address_components[0].short_name) ||
        '',
      (googlePlace.address_components[1] &&
        googlePlace.address_components[1].short_name) ||
        '',
      (googlePlace.address_components[2] &&
        googlePlace.address_components[2].short_name) ||
        ''
    ].join(' ');
  }

  parsedPlace.geometry = {
    lat: googlePlace.geometry.location.lat(),
    lng: googlePlace.geometry.location.lng()
  };

  return parsedPlace;
};

export { parseGooglePlace };
