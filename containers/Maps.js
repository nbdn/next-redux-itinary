/*global google:true*/
/*eslint no-undef: "error"*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import GoogleMapsComponent from '../components/GoogleMaps';

import { getOrderedPlaces } from '../redux/maps';

import Page from '../components/Page';

class MapsContainer extends PureComponent {
  state = {};

  componentWillReceiveProps({ places }) {
    if (Array.isArray(places) && places.length >= 2) {
      this.computeDirections(places);
    }
  }

  computeDirections(places) {
    const DirectionsService = new google.maps.DirectionsService();
    const start = places.shift();
    const end = places.shift();
    const waypoints = places.map(p => {
      return { location: p.address, stopover: true };
    });
    DirectionsService.route(
      {
        origin: start.address,
        destination: end.address,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
        } else {
          /* eslint-disable no-console */
          console.error(`error fetching directions ${result}`);
          /* eslint-enable */
        }
      }
    );
  }

  render() {
    const { places } = this.props;
    const { directions } = this.state;

    return (
      <GoogleMapsComponent
        directions={directions}
        places={directions ? [] : places}
      />
    );
  }
}

MapsContainer.propTypes = {
  places: PropTypes.array
};

const mapStateToProps = createStructuredSelector({
  places: getOrderedPlaces
});

export default Page(connect(mapStateToProps)(MapsContainer));
