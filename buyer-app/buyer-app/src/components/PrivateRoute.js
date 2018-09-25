import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { getCookie } from "../utils/cookies";

import * as authentication from "state/entities/authentication/selectors";

class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: getCookie('token')
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth !== this.props.authenticated) {
      this.setState({
       ...this.state,
       token: false, 
      })
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          this.state.token? (
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
  auth: authentication.getAuthentication(state),
});

export default connect(
  mapStateToProps, 
  null
)(PrivateRoute);
