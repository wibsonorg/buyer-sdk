import React, { Component } from 'react';
import { connect } from 'react-redux';

import './css/museo-sans.css';
import './css/open-sans.css';
import './App.css';

import Main from './components/Main';
import Login from './components/Login';

import * as authentication from 'state/entities/authentication/selectors';

class App extends Component {
  render() {
    return this.props.auth.authenticated ? (
      <Main {...this.props} />
    ) : (
      <Login {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  auth: authentication.getAuthentication(state),
});

export default connect(mapStateToProps, null)(App);
