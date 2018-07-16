import React from "react";

import { connect } from "react-redux";

import Toast from "../../components/Toast";

import * as NotificationsSelectors from "../../state/notifications/selectors";
import * as NotificationsActions from "../../state/notifications/actions";

const mapStateToProps = state => {
  return {
    notifications: NotificationsSelectors.getNotifications(state)
  };
};

const mapDispatchToProps = dispatch => ({
  popOutNotification: () => {
    dispatch(NotificationsActions.popOutNotification());
  }
});

const AppNotifications = ({ notifications, popOutNotification }) => {
  if (notifications.length > 0) {
    const topNotification = notifications[0];
    return (
      <Toast onCloseRequested={() => popOutNotification()} status={topNotification.status}>
        {topNotification.message}
      </Toast>
    );
  }
  return <div/>
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNotifications);
