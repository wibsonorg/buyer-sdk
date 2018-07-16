import { lifecycle, compose } from "recompose";
import { connect } from "react-redux";
import * as Actions from "./actions";

const withAccountPolling = compose(
  connect(),
  lifecycle({
    componentWillMount() {
      this.props.dispatch(Actions.startAccountPolling());
    }
  })
);

export { withAccountPolling };
