import React from "react";
import PropTypes from "prop-types";

import TagList from "./TagList";

import R from "ramda";

const toCatalog = R.compose(
  R.fromPairs,
  R.map(({ value, label }) => [value, label])
);

const NotariesDetail = ({ value, notariesSchema }) => {
  const notariesCatalog = toCatalog(notariesSchema);
  return (
    <TagList
      tags={value.map(address => ({
        label: notariesCatalog[address],
        hint: address
      }))}
    />
  );
};

NotariesDetail.propTypes = {
  notariesSchema: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }).isRequired
  ),
  value: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default NotariesDetail;
