import React from 'react';
import PropTypes from 'prop-types';

import TagList from './TagList';

class AudienceDetail extends React.Component {
  getLabel(options, value) {
    const selection = options.find(option => option.value === value);
    return selection ? selection.label : value;
  }

  render() {
    const { audience, requestableAudience } = this.props;

    const audienceItems = audience.reduce((labels, group) => {
      const requestedFilter = requestableAudience.filters.find(option => option.value === group.filter);
      if (!requestedFilter) {
        return labels;
      }
      const groupLabels = group.values.map(value => this.getLabel(requestedFilter.categories, value));
      return [...labels, ...groupLabels];
    }, []);

    return <TagList labels={audienceItems} emptyLabel="Everyone" />;
  }
}

AudienceDetail.propTypes = {
  requestableAudience: PropTypes.object
};

export default AudienceDetail;
