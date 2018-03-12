import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// Containers
import MapsContainer from '../containers/Maps';
import MapsForm from '../containers/MapsForm';

// Components
import GoogleScriptProvider from '../components/GoogleScriptProvider';

// Styles
import './styles/MapsStyles';

class Maps extends Component {
  state = {
    addresses: []
  };

  componentDidCatch(error) {
    /* eslint-disable no-console */
    console.error('Error initializing map', error);
    /* eslint-enable */
  }

  componentWillMount() {
    const { url: { query: { addresses } } } = this.props;

    if (addresses && typeof addresses === 'string') {
      this.setState({ addresses: addresses.split(',') });
    }
  }

  showResults = () => {
    // ...
  };

  render() {
    const { addresses } = this.state;
    return (
      <Fragment>
        <GoogleScriptProvider>
          <MapsForm initialAddresses={addresses} onSubmit={this.showResults} />
          <MapsContainer />
        </GoogleScriptProvider>
      </Fragment>
    );
  }
}

Maps.propTypes = {
  url: PropTypes.object
};

export default Maps;
