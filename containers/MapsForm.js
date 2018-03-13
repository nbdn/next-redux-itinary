import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change, getFormValues, Field, reduxForm, untouch } from 'redux-form';

import {
  Close,
  Container,
  Heading,
  Link,
  Flex,
  Group,
  Relative,
  Subhead,
  Text
} from 'rebass';

// Theme
import Colors from '../theme/Colors';

// Components
import AutoCompleteInput from '../components/AutoCompleteInput';
import DraggableList from '../components/DraggableList';
import Drawer from '../components/Drawer';
import Page from '../components/Page';

import ButtonOutlineWithCustomStyles from '../components/styled/ButtonOutlineWithCustomStyles';
import ButtonWithCustomStyles from '../components/styled/ButtonWithCustomStyles';

// Redux
import {
  addAddressStep,
  addPlace,
  getAddressSteps,
  getAddressStepsOrders,
  getInitError,
  getOptimizedError,
  getFetching,
  getFetchingOptimize,
  initForm,
  isFormValid,
  optimizeItinary,
  removePlace,
  updatePlacesOrder
} from '../redux/maps';

const REQUIRED_FIELDS_COUNT = 2;

class MapsForm extends Component {
  state = {
    formError: undefined
  };

  attemptOptimize = false;

  componentWillMount() {
    const { initialAddresses, initForm } = this.props;
    initForm(initialAddresses, REQUIRED_FIELDS_COUNT);
  }

  componentWillReceiveProps({ fetchingOptimize }) {
    if (this.attemptOptimize && !fetchingOptimize) {
      this.props.reset();
      this.attemptOptimize = false;
    }
  }

  addItinaryStep = () => {
    const { addAddressStep, isFormValid } = this.props;

    if (!isFormValid) {
      this.setState({
        formError: 'You must fill all fields before adding new step.'
      });
    } else {
      const { addressSteps } = this.props;
      const lastNum = addressSteps.length - 1;
      addAddressStep({
        required: false,
        stepNum: lastNum + 1,
        id: Date.now().toString()
      });
    }
  };

  removeStep = adrId => {
    const { addressSteps, dispatch } = this.props;
    const removedAddressStep = addressSteps.find(adr => adr.id === adrId);
    if (removedAddressStep) {
      const inputName = `adr_${adrId}`;
      dispatch(change('mapsForm', inputName, ''));
      dispatch(untouch('mapsForm', inputName));
      this.onPlaceRemove(removedAddressStep.id, true);
    }
  };

  onPlaceComplete = place => {
    const { addPlace } = this.props;
    this.removeFormErrors();
    addPlace(place);
  };

  onPlaceRemove = (placeInputId, removeInput = false) => {
    const { removePlace } = this.props;
    this.removeFormErrors();
    removePlace(placeInputId, removeInput);
  };

  buildInputs = addressSteps =>
    addressSteps.map(adr => (
      <Flex key={`adr_children_${adr.id}`} order={adr.stepNum}>
        <Flex flex={7}>
          <Field
            key={`adr_${adr.id}`}
            id={adr.id}
            name={`adr_${adr.id}`}
            component={AutoCompleteInput}
            formError={this.state.formError}
            initialValue={adr.initialValue}
            onPlaceComplete={this.onPlaceComplete}
            onPlaceRemove={this.onPlaceRemove}
            type="text"
            required={adr.required}
            stepNum={adr.stepNum}
            placeholder={this.getInputPlaceholder(adr.stepNum)}
          />
        </Flex>
        {!adr.required && (
          <Flex flex={1}>
            <Relative left={15} top={48}>
              <Link
                onClick={() => this.removeStep(adr.id)}
                bg={Colors.error}
                p={1}
                pb={2}
                color={Colors.snow}
              >
                <Close fontSize={25} />
              </Link>
            </Relative>
          </Flex>
        )}
      </Flex>
    ));

  getInputPlaceholder(stepNum) {
    switch (stepNum) {
      case 0:
        return 'Starting address';
      case 1:
        return 'Ending address';
      default:
        return `Step ${stepNum - 1}`;
    }
  }

  optimizeItinary = () => {
    const { isFormValid, formValues, optimizeItinary } = this.props;

    if (!isFormValid) {
      this.setState({
        formError: 'You must fill all fields before optimize your itinary.'
      });
    } else if (Object.keys(formValues).length <= 3) {
      this.setState({
        formError: 'You must have fill at least 2 steps for optimizing routes.'
      });
    } else {
      this.attemptOptimize = true;
      this.removeFormErrors();
      optimizeItinary(REQUIRED_FIELDS_COUNT);
    }
  };

  updateInputOrders = addressStepsOrders => {
    const { addressSteps, updatePlacesOrder } = this.props;
    updatePlacesOrder(addressSteps, addressStepsOrders, REQUIRED_FIELDS_COUNT);
  };

  removeFormErrors = () => {
    this.setState({ formError: undefined });
  };

  render() {
    const {
      addressSteps,
      initFormError,
      fetchingInit,
      fetchingOptimize,
      handleSubmit,
      optimizedFormError
    } = this.props;

    const { formError } = this.state;
    return (
      <Fragment>
        <Drawer>
          <Heading
            bg={Colors.primary}
            color="white"
            mb={20}
            p={20}
            textAlign={'center'}
          >
            React / Redux itinary :
          </Heading>
          <Container>
            {fetchingInit || fetchingOptimize ? (
              <p> Loading... </p>
            ) : initFormError ? (
              <p>
                Error initializing form : <br />
                {initFormError}
              </p>
            ) : (
              <Fragment>
                <Subhead fontSize={3} mb={15}>
                  Your itinary :
                </Subhead>
                <Subhead mb={15}>
                  <Text color={Colors.secondary} fontSize={1}>
                    You can reorder inputs by dragging the labels.
                  </Text>
                </Subhead>
                <form onSubmit={handleSubmit}>
                  <DraggableList
                    draggableHeight={'30px'}
                    draggableWidth={'100%'}
                    updateOrders={this.updateInputOrders}
                  >
                    {this.buildInputs(addressSteps)}
                  </DraggableList>
                  {(formError || optimizedFormError) && (
                    <Text color={Colors.error}>
                      {formError || optimizedFormError}
                    </Text>
                  )}
                </form>
                <Flex justifyContent="center" mt={5} mb={30} mr={30}>
                  <Group>
                    <ButtonOutlineWithCustomStyles
                      color={Colors.primary}
                      width={1 / 2}
                      onClick={this.addItinaryStep}
                    >
                      <Text>Add step</Text>
                    </ButtonOutlineWithCustomStyles>
                    <ButtonWithCustomStyles
                      bg={Colors.primary}
                      width={1 / 2}
                      onClick={this.optimizeItinary}
                    >
                      <Text>Optimize</Text>
                    </ButtonWithCustomStyles>
                  </Group>
                </Flex>
                <Subhead mb={30}>
                  <Text color={Colors.secondary} fontSize={1}>
                    See the Github repository{' '}
                    <a
                      href="https://github.com/nbdn/next-redux-itinary"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      here
                    </a>.
                  </Text>
                </Subhead>
              </Fragment>
            )}
          </Container>
        </Drawer>
      </Fragment>
    );
  }
}

MapsForm.propTypes = {
  addAddressStep: PropTypes.func,
  addPlace: PropTypes.func,
  addressSteps: PropTypes.array,
  dispatch: PropTypes.func,
  fetchingInit: PropTypes.bool,
  fetchingOptimize: PropTypes.bool,
  formValues: PropTypes.object,
  handleSubmit: PropTypes.func,
  initialAddresses: PropTypes.array,
  initForm: PropTypes.func,
  initFormError: PropTypes.string,
  isFormValid: PropTypes.bool,
  optimizeItinary: PropTypes.func,
  optimizedFormError: PropTypes.string,
  removePlace: PropTypes.func,
  reset: PropTypes.func,
  updatePlacesOrder: PropTypes.func
};

MapsForm.defaultProps = {};

const mapStateToProps = state => {
  return {
    addressSteps: getAddressSteps(state),
    getAddressStepsOrders: getAddressStepsOrders(state),
    initFormError: getInitError(state),
    isFormValid: isFormValid(state),
    optimizedFormError: getOptimizedError(state),
    fetchingInit: getFetching(state),
    fetchingOptimize: getFetchingOptimize(state),
    formValues: getFormValues('mapsForm')(state)
  };
};

const mapDispatchToProps = {
  addAddressStep,
  addPlace,
  initForm,
  optimizeItinary,
  removePlace,
  updatePlacesOrder
};

/* eslint-disable no-class-assign */
MapsForm = connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'mapsForm',
    destroyOnUnmount: true
  })(MapsForm)
);
/* eslint-enable */

export default Page(MapsForm);
