import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./css/museo-sans.css";
import "./css/open-sans.css";
import "./App.css";

import PrivateRoute from "./components/PrivateRoute";
import Main from "./components/Main";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Main} />
        </Switch>
      </Router>
    )
  }
}

export default App;
