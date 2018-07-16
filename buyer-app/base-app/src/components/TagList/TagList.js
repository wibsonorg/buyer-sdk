import React from "react";

import PropTypes from "prop-types";

import cn from "classnames/bind";
import styles from "./TagList.css";
const cx = cn.bind(styles);

import Tag from "../Tag";

const TagList = ({ labels, tags, emptyLabel }) => {
  const emptyTag = emptyLabel && <Tag label={emptyLabel} />;

  let tagsProps;
  if (tags) {
    tagsProps = tags;
  } else {
    tagsProps = labels.map(label => ({
      label
    }));
  }

  return (
    <div className={cx("wibson-tag-list")}>
      {tagsProps && tagsProps.length > 0
        ? tagsProps.map((props, idx) => <Tag key={idx} {...props} />)
        : emptyTag}
    </div>
  );
};

TagList.propTypes = {
  emptyLabel: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.string),
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      hint: PropTypes.string
    })
  )
};

export default TagList;
