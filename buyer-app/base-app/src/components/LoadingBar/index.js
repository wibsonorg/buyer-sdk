import React from "react";

import "./LoadingBar.css";

const LoadingBar = ({loading}) => <div className={loading ? "progress-line" : "progress-line-fixed"} />;
export default LoadingBar;
