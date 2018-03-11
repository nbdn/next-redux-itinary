import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

export const NAME = 'MAPS';

/* ------------- Actions ------------- */

export const ADD_PLACE = `${NAME}/ADD_PLACE`;
export const REMOVE_PLACE = `${NAME}/REMOVE_PLACE`;
export const UPDATE_PLACES_ORDER = `${NAME}/UPDATE_PLACES_ORDER`;

export const ADD_ADDRESS_STEP = `${NAME}/ADD_ADDRESS_STEP`;

export const FETCH_INIT_FORM = `${NAME}/FETCH_INIT_FORM`;
export const FETCH_INIT_FORM_FAILED = `${NAME}/FETCH_INIT_FORM_FAILED`;
export const RESOLVE_INIT_FORM = `${NAME}/RESOLVE_INIT_FORM`;

export const FETCH_OPTIMIZE_ITINARY = `${NAME}/FETCH_OPTIMIZE_ITINARY`;
export const FETCH_OPTIMIZE_ITINARY_FAILED = `${NAME}/FETCH_OPTIMIZE_ITINARY_FAILED`;
export const RESOLVE_OPTIMIZE_ITINARY = `${NAME}/RESOLVE_OPTIMIZE_ITINARY`;

/* ------------- Initial State ------------- */

export const initialMapsState = Immutable({
  addressSteps: [],
  addressStepsOrders: [],
  fetching: true,
  fetchingOptimize: false,
  initError: undefined,
  optimizedError: undefined,
  places: []
});

/* ------------- Reducer ------------- */

function reducer(state = initialMapsState, action) {
  switch (action.type) {
    case ADD_ADDRESS_STEP:
      return state.merge({
        addressSteps: [...state.addressSteps, action.addressStep]
      });
    case ADD_PLACE:
      return state.merge({ places: [...state.places, action.place] });
    case FETCH_INIT_FORM:
      return state.merge({ fetching: true, initError: undefined });
    case FETCH_INIT_FORM_FAILED:
      return state.merge({ fetching: false, optimizedError: action.message });
    case FETCH_OPTIMIZE_ITINARY:
      return state.merge({ fetchingOptimize: true, optimizedError: undefined });
    case FETCH_OPTIMIZE_ITINARY_FAILED:
      return state.merge({
        fetchingOptimize: false,
        optimizedError: action.message
      });
    case REMOVE_PLACE:
      return state.merge({
        addressSteps: action.removeInput
          ? state.addressSteps.filter(adr => adr.id !== action.placeInputId)
          : state.addressSteps,
        places: state.places.filter(p => p.inputId !== action.placeInputId)
      });
    case RESOLVE_INIT_FORM:
    case RESOLVE_OPTIMIZE_ITINARY:
      return state.merge({
        addressSteps: action.addressSteps,
        addressStepsOrders: action.addressStepsOrders,
        places: action.places,
        fetching: false,
        fetchingOptimize: false
      });
    case UPDATE_PLACES_ORDER:
      return state.merge({
        places: action.orderedPlaces,
        addressSteps: action.addressSteps,
        addressStepsOrders: action.addressStepsOrders
      });
    default:
      return state;
  }
}

/* ------------- Actions creators ------------- */

export const addAddressStep = addressStep => dispatch =>
  dispatch({ type: ADD_ADDRESS_STEP, addressStep });

export const addPlace = place => dispatch =>
  dispatch({ type: ADD_PLACE, place });

export const removePlace = (placeInputId, removeInput) => dispatch =>
  dispatch({ type: REMOVE_PLACE, placeInputId, removeInput });

export const updatePlacesOrder = (
  addressSteps,
  addressStepsOrders,
  requiredFieldsCount
) => (dispatch, getState) => {
  const places = getPlaces(getState());
  const updatedAddressSteps = addressSteps.map((adr, iAdr) => {
    const stepNum = addressStepsOrders.findIndex(o => o === iAdr);

    return {
      ...adr,
      stepNum: stepNum,
      required: stepNum < requiredFieldsCount
    };
  });
  const orderedPlaces = places.map(place => {
    const stepNum = updatedAddressSteps.find(adr => adr.id === place.inputId)
      .stepNum;
    return { ...place, stepNum };
  });
  dispatch({
    type: UPDATE_PLACES_ORDER,
    addressSteps: updatedAddressSteps,
    addressStepsOrders,
    orderedPlaces
  });
};

export const initForm = (placesId = [], requiredFieldsCount) => dispatch =>
  dispatch({ type: FETCH_INIT_FORM, placesId, requiredFieldsCount });

export const optimizeItinary = requiredFieldsCount => (dispatch, getState) => {
  const places = getPlaces(getState());
  const orderedPlacesIds = getOrderedPlacesIds(getState());
  dispatch({
    type: FETCH_OPTIMIZE_ITINARY,
    places,
    orderedPlacesIds,
    requiredFieldsCount
  });
};

/* ------------- Selectors ------------- */

export const getAddressSteps = state => state[NAME].addressSteps;

export const getAddressStepsOrders = state => state[NAME].addressStepsOrders;

export const getInitError = state => state[NAME].initError;

export const getOptimizedError = state => state[NAME].optimizedError;

export const getFetching = state => state[NAME].fetching;

export const getFetchingOptimize = state => state[NAME].fetchingOptimize;

export const getPlaces = state => state[NAME].places;

export const getOrderedPlaces = createSelector(getPlaces, places =>
  [...places].sort((place1, place2) => place1.stepNum - place2.stepNum)
);

export const getOrderedPlacesIds = createSelector(getPlaces, places =>
  [...places]
    .sort((place1, place2) => place1.stepNum - place2.stepNum)
    .map(p => p.id)
);

export default { [NAME]: reducer };
