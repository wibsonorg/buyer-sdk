import React from "react";
import { HashRouter as Router } from "react-router-dom";
import { compose } from "recompose";

import Buyer from "./buyer/Buyer";

import { withAccountPolling } from "state/entities/account/hoc";
import { withVerifyTokenPolling } from "state/entities/authentication/hoc";


const MainPage = props => {
  return (
    <Router>
      <Buyer {...props} />
    </Router>
  );
};

export default compose(withAccountPolling, withVerifyTokenPolling)(MainPage);
