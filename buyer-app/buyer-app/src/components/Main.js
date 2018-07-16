import React from "react";
import { HashRouter as Router } from "react-router-dom";

import Buyer from "./buyer/Buyer";

import { withAccountPolling } from "state/entities/account/hoc";


const MainPage = props => {
  return (
    <Router>
      <Buyer {...props} />
    </Router>
  );
};

export default withAccountPolling(MainPage);
