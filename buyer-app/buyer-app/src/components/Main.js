import React from "react";
import { HashRouter as Router } from "react-router-dom";

import Buyer from "./buyer/Buyer";

import { withBalancePolling } from "base-app-src/state/balance/hoc";


const MainPage = props => {
  return (
    <Router>
      <Buyer {...props} />
    </Router>
  );
};

export default withBalancePolling(MainPage);
