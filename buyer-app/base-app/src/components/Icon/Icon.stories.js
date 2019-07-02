import React from "react";
import Icon from "./Icon";
import { storiesOf } from "@storybook/react";
import { withKnobs, select } from '@storybook/addon-knobs';
import PropTypes from 'prop-types';

const story = storiesOf('Icons', module);

story.addDecorator(withKnobs);

const IconGallery = ({ size }) =>
  (<div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      flexDirection: 'row',
      maxHeight: '100vh',
    }}
  >
    <Icon icon="ArrowDown" size={size} />
    <Icon icon="ArrowRight" size={size} />
    <Icon icon="ArrowUp" size={size} />
    <Icon icon="BrowsingHistory" size={size} />
    <Icon icon="Close" size={size} />
    <Icon icon="Copy" size={size} />
    <Icon icon="Plus" size={size} />
    <Icon icon="Trash" size={size} />
  </div>);

IconGallery.propTypes = {
  size: PropTypes.string,
};

story.add('Icon gallery', () => {
  const sizeSelect = select('Size', { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }, 'md');
  return <IconGallery size={sizeSelect} />;
});
