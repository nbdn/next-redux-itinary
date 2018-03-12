/*global google:true*/
/*eslint no-undef: "error"*/
import { call, put, takeLatest } from 'redux-saga/effects';

import {
  FETCH_INIT_FORM,
  FETCH_INIT_FORM_FAILED,
  RESOLVE_INIT_FORM,
  FETCH_OPTIMIZE_ITINARY,
  FETCH_OPTIMIZE_ITINARY_FAILED,
  RESOLVE_OPTIMIZE_ITINARY
} from '../redux/maps';

import { parseGooglePlace } from '../helpers/';
import PlacesService from '../services/Places';

function* fetchInitForm({ placesId = [], requiredFieldsCount = 2 }) {
  try {
    if (requiredFieldsCount < 2) {
      throw new Error('Required fields count must be at least 2.');
    }
    const geocoder = new google.maps.Geocoder();
    const addressSteps = [];
    const places = [];
    const addressStepsOrders = [];

    // Geocode place ids with Google geocode API
    for (let i = 0; i < placesId.length; i++) {
      const inputId = (Date.now() + i).toString();
      const { error, response } = yield call(
        PlacesService.fetchPlaceInfos,
        geocoder,
        placesId[i]
      );
      if (error) {
        throw new Error(`Invalid place id : ${placesId[i]}`);
      } else if (response) {
        const parsedPlace = parseGooglePlace(response, i, inputId);
        addressStepsOrders.push(i);
        addressSteps.push({
          required: i < requiredFieldsCount,
          stepNum: i,
          id: inputId,
          initialValue: parsedPlace.address
        });
        places.push(parsedPlace);
      }
    }

    // Fill required fields if needing
    if (placesId.length < requiredFieldsCount) {
      for (let i = placesId.length; i < requiredFieldsCount; i++) {
        addressStepsOrders.push(i);
        addressSteps.push({
          required: true,
          stepNum: i,
          id: (Date.now() + i).toString()
        });
      }
    }

    yield put({
      type: RESOLVE_INIT_FORM,
      addressSteps,
      addressStepsOrders,
      places
    });
  } catch (e) {
    /* eslint-disable no-console */
    console.error('=> Err init form', e);
    /* eslint-enable */
    yield put({ type: FETCH_INIT_FORM_FAILED, message: e.message });
  }
}

function* fetchOptimizeItinary({
  places = [],
  orderedPlacesIds = [],
  requiredFieldsCount = 2
}) {
  try {
    if (places.length < 4) {
      throw new Error(
        'You must have fill at least 2 steps for optimizing routes.'
      );
    }
    const { error, response } = yield call(
      PlacesService.optimizeItinary,
      orderedPlacesIds
    );
    if (response) {
      const addressSteps = [];
      const addressStepsOrders = [];
      const orderedPlaces = [];
      for (let i = 0; i < response.length; i++) {
        const inputId = (Date.now() + i).toString();
        const parsedPlace = {
          ...places.find(p => p.id === response[i]),
          inputId,
          stepNum: i
        };
        addressStepsOrders.push(i);
        addressSteps.push({
          required: i < requiredFieldsCount,
          stepNum: i,
          id: inputId,
          initialValue: parsedPlace.address
        });
        orderedPlaces.push(parsedPlace);
      }
      yield put({
        type: RESOLVE_OPTIMIZE_ITINARY,
        addressSteps,
        addressStepsOrders,
        places: orderedPlaces
      });
    } else if (error) {
      yield put({
        type: FETCH_OPTIMIZE_ITINARY_FAILED,
        message: error.message
      });
    }
  } catch (e) {
    /* eslint-disable no-console */
    console.error('=> Err optimizing itinary', e);
    /* eslint-enable */
    yield put({ type: FETCH_OPTIMIZE_ITINARY_FAILED, message: e.message });
  }
}

function* mapsSaga() {
  yield takeLatest(FETCH_INIT_FORM, fetchInitForm);
  yield takeLatest(FETCH_OPTIMIZE_ITINARY, fetchOptimizeItinary);
}

export default mapsSaga;
