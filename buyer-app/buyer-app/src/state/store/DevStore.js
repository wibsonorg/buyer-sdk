import createSagaMiddleware from "redux-saga";

import { createStore, applyMiddleware, compose } from "redux";

import appReducer from "../reducer";
import rootSaga from "../sagas";

const sagaMiddleware = createSagaMiddleware();

const finalCreateStore = compose(
  applyMiddleware(sagaMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
)(createStore);

const store = finalCreateStore(appReducer);

sagaMiddleware.run(rootSaga);

// Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
if (module.hot) {
  module.hot.accept("../reducer", () =>
    store.replaceReducer(require("../reducer"))
  );
}
export default store;
