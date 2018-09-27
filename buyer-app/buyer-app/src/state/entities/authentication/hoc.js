import { lifecycle, compose } from "recompose";
import * as Actions from "./actions";

const withVerifyTokenPolling = compose(
  lifecycle({
    componentWillMount() {
      this.props.dispatch(Actions.verifyToken());
    }
  })
);

export { withVerifyTokenPolling };
