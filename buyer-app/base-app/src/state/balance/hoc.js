import { lifecycle, compose } from "recompose";
import { connect } from "react-redux";
import * as Actions from "./actions";

const withBalancePolling = compose(
  connect(),
  lifecycle({
    componentWillMount() {
      this.props.dispatch(Actions.startBalancePolling());
    }
  })
);

export { withBalancePolling };
