/*global google:true*/
/*eslint no-undef: "error"*/

import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Input from './Input';
import { parseGooglePlace } from '../helpers/';

class AutoCompleteInput extends Component {
  state = {
    complete: false
  };

  autocomplete = undefined;
  hasCompletePlace = false;

  componentDidMount() {
    this.initAutocomplete();
  }

  componentWillMount() {
    const { initialValue, input } = this.props;
    if (initialValue) {
      this.handleInputChange(initialValue, input, true);
    }
  }

  initAutocomplete = () => {
    try {
      const input = document.getElementById(this.props.id);

      this.autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['address'],
        componentRestrictions: { country: 'fr' }
      });

      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        const parsedPlace = parseGooglePlace(
          place,
          this.props.stepNum,
          this.props.id
        );
        this.handleInputChange(input.value, this.props.input, true);
        this.props.onPlaceComplete(parsedPlace);
        this.hasCompletePlace = true;
      });
    } catch (e) {
      /* eslint-disable no-console */
      console.error('Err initializing google maps api', e);
      /* eslint-enable */
    }
  };

  handleInputChange = (e, input, complete) => {
    input.onChange(e);
    if (!complete && this.hasCompletePlace) {
      const { id, onPlaceRemove } = this.props;
      onPlaceRemove && onPlaceRemove(id);
      this.hasCompletePlace = false;
    }
    this.setState({ complete });
  };

  render() {
    const { formError, id, meta, placeholder, required } = this.props;
    const { complete } = this.state;
    const input = {
      ...this.props.input,
      onChange: e => this.handleInputChange(e, this.props.input, false)
    };

    return (
      <Fragment>
        <Input
          forceError={formError}
          id={id}
          isValid={complete}
          input={input}
          meta={meta}
          placeholder={placeholder}
          required={required}
        />
      </Fragment>
    );
  }
}

AutoCompleteInput.propTypes = {
  formError: PropTypes.string,
  id: PropTypes.string,
  initialValue: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  onPlaceComplete: PropTypes.func,
  onPlaceRemove: PropTypes.func,
  required: PropTypes.bool,
  stepNum: PropTypes.number
};

AutoCompleteInput.defaultProps = {
  id: '',
  stepNum: 0,
  input: null,
  onPlaceComplete: null,
  onPlaceRemove: null
};

export default AutoCompleteInput;
