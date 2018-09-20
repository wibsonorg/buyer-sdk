import React from "react";
import { compose } from "recompose";

import Buyer from "./buyer/Buyer";

import { withAccountPolling } from "state/entities/account/hoc";
import { withverifyTokePolling } from "state/entities/verifyToken/hoc";


const MainPage = props => {
  return (
    <Buyer {...props} />
  );
};

export default compose(withAccountPolling, withverifyTokePolling)(MainPage);