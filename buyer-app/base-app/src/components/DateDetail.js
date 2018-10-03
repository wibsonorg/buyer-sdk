import React from "react";
import {
  format as formatDate,
  distanceInWordsToNow,
  differenceInDays,
  parse as parseDate
} from "date-fns";

const DateDetail = ({ value }) => {
  const date = parseDate(value);

  if (differenceInDays(date, new Date()) < 1) {
    return <span>{distanceInWordsToNow(date)} ago</span>;
  } else {
    return <span>{formatDate(date, "MM/DD/YYYY")}</span>;
  }
};

export default DateDetail;