import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import "./css/museo-sans.css";
import "./css/open-sans.css";
import "./App.css";

import Main from "./components/Main";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login"

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <PrivateRoute path="/" component={Main} />
        </Switch>
      </Router>
    )
  }
}

export default App;

