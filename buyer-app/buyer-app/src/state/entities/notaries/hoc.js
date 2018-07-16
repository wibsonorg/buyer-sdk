import { lifecycle, compose, branch, renderNothing } from "recompose";
import { connect } from "react-redux";
import * as Actions from "./actions";

import * as Selectors from "./selectors";

const mapStateToProps = state => ({
  availableNotaries: Selectors.getNotaries(state)
});

/**
 *
 * Ensures that the notaries are available for inner components.
 * This MUST be in the outermost component of the application.
 * 
 * @param  {[type]}
 * @return {[type]}
 */
const withNotaries = compose(
  connect(mapStateToProps),
  lifecycle({
    componentWillMount() {
      this.props.dispatch(Actions.fetchNotaries());
    }
  }),
  branch(
    props => !props.availableNotaries || props.availableNotaries.pending,
    renderNothing
  )
);

export { withNotaries };
