import "babel-polyfill";
import "regenerator-runtime/runtime";

import { createStore, applyMiddleware, compose } from "redux";

import appReducer from "../reducer";
import createSagaMiddleware from "redux-saga";

import rootSaga from "../sagas";

const sagaMiddleware = createSagaMiddleware();

const finalCreateStore = compose(applyMiddleware(sagaMiddleware))(createStore);
const store = finalCreateStore(appReducer);

sagaMiddleware.run(rootSaga);

export default store;
