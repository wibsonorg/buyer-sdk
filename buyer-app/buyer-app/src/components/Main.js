import React from "react";

import Buyer from "./buyer/Buyer";

import { withAccountPolling } from "state/entities/account/hoc";


const MainPage = props => {
  return (
      <Buyer {...props} />
  );
};

export default withAccountPolling(MainPage);
