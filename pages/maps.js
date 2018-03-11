import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectGlobal } from 'styled-components';

// Containers
import MapsContainer from '../containers/Maps';
import MapsForm from '../containers/MapsForm';

// Components
import GoogleScriptProvider from '../components/GoogleScriptProvider';

injectGlobal`
  * { 
    box-sizing: border-box; 
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }
  html,
  body {
    margin: 0;
    font-family: 'Roboto';
  }
  `;

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
