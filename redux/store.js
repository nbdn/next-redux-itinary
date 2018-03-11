import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';

// Reducers
import mapsReducer from './maps';

// Sagas
import mapsSaga from '../sagas/maps';

let reduxStore = null;
let sagaMiddleware = null;
const rootReducer = combineReducers({
  form: formReducer,
  ...mapsReducer
});

const isProd = process.env.NODE_ENV === 'production';

const createMiddleware = () => {
  sagaMiddleware = createSagaMiddleware();
  const universalMiddleware = applyMiddleware(thunk, sagaMiddleware);
  if (process.browser && window.devToolsExtension && !isProd) {
    return compose(universalMiddleware, window.devToolsExtension());
  }
  return universalMiddleware;
};

const getStore = initialState => {
  let store;
  if (!process.browser || !reduxStore) {
    const middleware = createMiddleware();
    store = createStore(rootReducer, initialState, middleware);
    if (!process.browser) {
      return store;
    }
    sagaMiddleware.run(mapsSaga);
    reduxStore = store;
  }
  return reduxStore;
};

export default getStore;
