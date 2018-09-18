import React from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import cn from 'classnames/bind';
import styles from './Login.css';
const cx = cn.bind(styles);

import Logo from 'base-app-src/components/Logo';
import TextInput from 'base-app-src/components/TextInput';
import Button from 'base-app-src/components/Button';
import * as authentication from "state/entities/authentication/selectors";
import * as authenticationActions from "state/entities/authentication/actions";

class Login extends React.Component {

  onHandleSubmit = e => {
    e.preventDefault();
    let data = {
      "password": e.target.password.value
    }
    this.props.logInUser(data)
  };

  render() {
    if (this.props.authentication && this.props.authentication.authenticated){
      return <Redirect to={{ pathname: "/" }} />
    }
    return (
      <div className={cx("wibson-login-body")}>      
        <form onSubmit={this.onHandleSubmit} 
              className={cx("wibson-login-container")}>
          <Logo className={cx("wibson-login-logo")} />
          <TextInput
            id={"password"}
            name={"password"}
            type={"password"}
            placeholder={"password"}
          />
          <Button
            type={"submit"}
            buttonStyle={"outline"} 
            className={cx("wibson-login-button")}
            size={"lg"}
            style={{"width":"20%", "textAlign":"center"}}
          > <span> Submit </span>
          </Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authentication: authentication.getAuthenticated(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  logInUser: (data) => {
    dispatch(authenticationActions.fethAuthentication(data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);