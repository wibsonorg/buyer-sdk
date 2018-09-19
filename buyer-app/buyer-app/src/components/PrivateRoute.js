import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

import * as authentication from "state/entities/authentication/selectors";

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
            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
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
  mapStateToProps
)(PrivateRoute);