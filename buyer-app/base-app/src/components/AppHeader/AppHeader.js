import React from "react";
import PropTypes from 'prop-types';

import copy from 'copy-to-clipboard';

import cn from 'classnames/bind';
import styles from './AppHeader.css';
const cx = cn.bind(styles);

import Logo from "../Logo";
import Button from "../Button"

import Icon from '../Icon';

class AppHeader extends React.Component {
  handleCopyClick = () => copy(this.props.account)

  render() {
    const { name, account, userRole, panels, logOut } = this.props;

    const description = name ? `${name} (${userRole})` : userRole;
    const theme = userRole ? userRole.toLowerCase() : 'seller';
    return (
      <header className={cx('wibson-header', theme)}>
        <div className={cx('info-section')}>
          <Logo className={cx("wibson-logo")}/>
          <div className={cx('account-info')}>
            <div className={cx('account-name')}>
              {description}
            </div>
            <div className={cx('account-address')}>
              <span>{account}</span>
              <Icon size="xs" icon="Copy" onClick={this.handleCopyClick} />
            </div>
          </div>
          <div className={cx('log-out')}>
            <Button
              onClick={() => {logOut()}}
              size={'sm'}
              buttonStyle={'outline'}
              className={cx('wibson-header-button')}
            >
            <span className={cx('wibson-header-textButton')}>Log Out</span>
            </Button>
          </div>
        </div>

        {panels && panels.length > 0 && (
          <div className={cx("panels-section")}>
            {panels}
          </div>
        )}

      </header>
    );
  }
}

AppHeader.propTypes = {
  userRole: PropTypes.oneOf(['buyer', 'seller', 'notary'])
};

export default AppHeader;
