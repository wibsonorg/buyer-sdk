import React from "react";
import Panel from "base-app-src/components/Panel";
import PanelText from "base-app-src/components/Panel/PanelText";

import cn from "classnames/bind";
import styles from "./info-panel.css";
const cx = cn.bind(styles);

const InfoPanel = ({ title, data, units }) => (
  <Panel title={title}>
    <PanelText>
      {data}
    </PanelText>
    {units && <div className={cx("panel-units")}>{units}</div>}
  </Panel>
);

export default InfoPanel;
