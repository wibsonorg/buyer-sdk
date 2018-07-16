# Install

## Reducers

Include base reducers in "base" key:
```javascript
import baseReducers from "base-app-src/state/reducers";

const reducers = {
  ...yourReducers
  base: baseReducers
};

const finalReducers = combineReducers(reducers);
```

## Sagas

Import base app sagas
```javascript
import baseSagas from "base-app-src/state/sagas";
```

Add them to your root sagas
```javascript
export default function* rootSaga() {
  yield all([baseSagas()]);
}
```


# Balance

## Start polling

In order to have always the last balace, the saga must be initialized.

Just wrap the outermost component with this HOC:
```javascript
import { withBalancePolling } from "base-app-src/state/balance/hoc";

const Routes = () => (
  <div>
    <Route path="/" render={() => <Buyer />} />
  </div>
);

const MainPage = props => {
  return (
    <Router>
      <Routes {...props} />
    </Router>
  );
};

export default withBalancePolling(MainPage);

```