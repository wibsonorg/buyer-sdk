import React from "react";
import Async from "react-promise";

import Loading from "base-app-src/components/Loading";
import Panel from "base-app-src/components/Panel";
import PanelText from "base-app-src/components/Panel/PanelText";

import cn from "classnames/bind";
import styles from "./info-panel.css";
const cx = cn.bind(styles);

const InfoPanel = ({ title, data, units }) => (
  <Panel title={title}>
    <PanelText>
      <Async
        promise={Promise.resolve(data)}
        pending={<Loading size="xs" center={false} />}
        then={result => <span>{result}</span>}
      />
    </PanelText>
    {units && <div className={cx("panel-units")}>{units}</div>}
  </Panel>
);

export default InfoPanel;
