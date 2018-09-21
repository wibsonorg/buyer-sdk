import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

import * as authentication from "state/entities/authentication/selectors";
import * as authenticationActions from "state/entities/authentication/actions";
import { getCookie } from "../utils/cookies"

class PrivateRoute extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      token: getCookie('token')
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authenticated !== this.props.authenticated) {
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

const mapStateToProps = state => ({
  authenticated: authentication.getAuthentication(state),
});


const mapDispatchToProps = (dispatch, props) => ({
  verifyToken: () => {
    dispatch(authenticationActions.verifyToken());
  }
});

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(PrivateRoute);
