import React from "react";

import Logo from "../Logo";
import Text from "../Text";
import Title from "../Title";
import Button from "../Button";

import cn from "classnames/bind";
import styles from "./CriticalErrorPage.css";
const cx = cn.bind(styles);

const metamaskUrl =
  "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";

function reloadPage() {
  window.location.reload();
  return true;
}

const CriticalErrorPage = () => (
  <div className={cx("wibson-error-full-page-container")}>
    <div className={cx("wibson-error-page")}>
      <Logo color="black" className={cx("wibson-error-logo")} />
      <Title className={cx("wibson-error-title")}>
        Oops. We cannot load the page.
      </Title>
      <Text color="light-dark" className={cx("wibson-error-content")}>
        Maybe you are in the wrong network or you are not running{" "}
        <a target="_blank" href={metamaskUrl}>
          MetaMask
        </a>{" "}
        in your browser.
      </Text>
      <Text color="light-dark" className={cx("wibson-error-content")}>
        You must be in <b>Ropsten</b> network
      </Text>

      <Button className={cx("wibson-refresh-button")} onClick={reloadPage}>
        Please reload the page when finished
      </Button>
    </div>
  </div>
);

export default CriticalErrorPage;
