import React, { Component } from "react";
import R from "ramda";

import Select, { SelectItem } from "base-app-src/components/Select";
import {
  InlineItem
} from "base-app-src/components/form";

import Icon from "base-app-src/components/Icon";
import Link from "base-app-src/components/Link";

import "./AudiencePicker.css";

function getVariableOptions(requestableAudience, variable) {
  return R.compose(R.prop("categories"), R.find(R.propEq("value", variable)))(
    requestableAudience
  );
}
function getFirstVariableOption(requestableAudience, variable) {
  return R.compose(R.prop("value"), R.head)(
    getVariableOptions(requestableAudience, variable)
  );
}

const FilterItemSelector = ({
  audience,
  requestableAudience,
  onRemoveRequest,
  filter,
  onChangeFilter
}) => {
  const values = getVariableOptions(requestableAudience, filter.variable);
  return (
    <InlineItem className="wibson-audience-picker-inline-item">
      <Select value={filter.variable}>
        {requestableAudience.map(({ value, label }) => (
          <SelectItem
            key={value}
            value={value}
            label={label}
            onClick={() =>
              onChangeFilter({
                variable: value,
                value: getFirstVariableOption(requestableAudience, value)
              })
            }
          />
        ))}
      </Select>
      <Select value={filter.value}>
        {values.map(({ value, label }) => (
          <SelectItem
            key={value}
            value={value}
            label={label}
            onClick={() => onChangeFilter({ ...filter, value: value })}
          />
        ))}
      </Select>
      <Icon icon="Trash" size="lg" onClick={onRemoveRequest} />
    </InlineItem>
  );
};

class AudiencePicker extends Component {
  handleAddNew = () => {
    const { audience, requestableAudience, onChange } = this.props;

    const variable = R.head(requestableAudience).value;
    const value = getFirstVariableOption(requestableAudience, variable);

    onChange(R.append({ variable, value }, audience));
  };

  handleRemoveFilter = idx => {
    const { audience, onChange } = this.props;
    onChange(R.remove(idx, 1, audience));
  };

  handleChangeFilter = (filter, idx) => {
    const { onChange, audience } = this.props;
    onChange(R.update(idx)(filter)(audience));
  };

  render() {
    const { requestableAudience, audience } = this.props;

    return (
      <div className="wibson-audience-picker-container">
        {audience.map((filter, idx) => (
          <FilterItemSelector
            key={idx}
            requestedAudience={audience}
            filter={filter}
            requestableAudience={requestableAudience}
            onRemoveRequest={this.handleRemoveFilter}
            onChangeFilter={filter => this.handleChangeFilter(filter, idx)}
          />
        ))}
        <InlineItem className="wibson-audience-picker-inline-item">
          <Link size="sm" color="regular" onClick={this.handleAddNew}>
            Add new filter
          </Link>
        </InlineItem>
      </div>
    );
  }
}


// TODO: Add again all the validations.
export default AudiencePicker;
