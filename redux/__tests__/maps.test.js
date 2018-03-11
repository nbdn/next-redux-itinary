import mapsReducer, {
  initialMapsState,
  ADD_PLACE,
  REMOVE_PLACE,
  UPDATE_PLACES_ORDER,
  NAME
} from '../maps';
import expect from 'expect';
import Immutable from 'seamless-immutable';

const reducer = mapsReducer[NAME];

import {
  addressStepsMock,
  addressStepsOrdersMock,
  placeMock1
} from '../../mocks';

describe('maps reducer', () => {
  const placesMock = [placeMock1];

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialMapsState);
  });

  it('should handle ADD_PLACE by adding new place in places state', () => {
    const addPlaceAction = {
      type: ADD_PLACE,
      place: placeMock1
    };

    expect(reducer(undefined, addPlaceAction)).toEqual({
      ...initialMapsState,
      places: placesMock
    });
  });

  it('should handle REMOVE_PLACE by removins place in places state', () => {
    const removePlaceAction = {
      type: REMOVE_PLACE,
      placeInputId: placeMock1.inputId
    };
    const placesMock = [placeMock1];
    const stateMock = Immutable({ ...initialMapsState, places: placesMock });
    expect(reducer(stateMock, removePlaceAction)).toEqual(initialMapsState);
  });

  it('should handle UPDATE_PLACES_ORDER', () => {
    const updatePlacesOrderAction = {
      type: UPDATE_PLACES_ORDER,
      orderedPlaces: [...placesMock].reverse(),
      addressSteps: addressStepsMock,
      addressStepsOrders: addressStepsOrdersMock
    };

    const stateMock = Immutable({ ...initialMapsState, places: placesMock });
    expect(reducer(stateMock, updatePlacesOrderAction)).toEqual({
      ...initialMapsState,
      places: [...placesMock].reverse(),
      addressSteps: addressStepsMock,
      addressStepsOrders: addressStepsOrdersMock
    });
  });
});
