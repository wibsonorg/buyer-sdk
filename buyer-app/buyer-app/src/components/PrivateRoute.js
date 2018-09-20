import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

import * as verifyTokenActions from "state/entities/verifyToken/actions";
import { getCookie } from "../utils/cookies"

class PrivateRoute extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      token: getCookie('token')
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.props.verifyToken();
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          this.state.token ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
          )
        }
      />
    );
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  verifyToken: () => {
    dispatch(verifyTokenActions.verifyToken());
  }
});

export default connect(null, mapDispatchToProps)(PrivateRoute);