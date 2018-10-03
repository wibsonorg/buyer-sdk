import React from "react";

import cn from "classnames/bind";
import styles from "./RequestedDataDetail.css";
const cx = cn.bind(styles);

const SingleRequestedData = ({
  dataConnected,
  requestedData,
  requestableData,
  notarized
}) => {
  const requestedDataInfo = requestableData.options.find(
    option => option.value === requestedData
  );

  return (
    <div className={cx("requested-data")}>
      <span>{requestedDataInfo ? requestedDataInfo.label : "None"}</span>
      {notarized && <span className={cx("notarized")}>Notarized</span>}
      {!dataConnected && (
        <span className={cx("not-connected")}>Not connected</span>
      )}
    </div>
  );
};

const RequestedDataDetail = ({
  dataConnected,
  requestedData,
  requestableData,
  notarized
}) => {

  // Warning: only shows the first.
  return (
    <div>
      {requestedData.map((singleRequestedData, idx) => (
        <SingleRequestedData
          key={idx}
          dataConnected={dataConnected}
          requestedData={singleRequestedData}
          requestableData={requestableData}
          notarized={notarized}
        />
      ))}
    </div>
  );
};

RequestedDataDetail.defaultProps = {
  dataConnected: true
};

export default RequestedDataDetail;
