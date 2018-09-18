import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import * as authentication from "state/entities/authentication/selectors";

import Login from "./Login";

class PrivateRoute extends React.Component {

  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          this.props.authentication && 
          this.props.authentication.authenticated ? (
            <Component {...props} />
          ) : (
            <Login {...props} />
          )
        }
      />
    );
  }
}

const mapStateToProps = state => ({
    authentication: authentication.getAuthenticated(state)
  });
  
export default connect(
  mapStateToProps,
  null
)(PrivateRoute);
