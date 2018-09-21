import { lifecycle, compose } from "recompose";
import { connect } from "react-redux";
import * as Actions from "./actions";

const withVerifyTokePolling = compose(
  connect(),
  lifecycle({
    componentWillMount() {
      this.props.dispatch(Actions.verifyToken());
    }
  })
);

export { withVerifyTokePolling };
