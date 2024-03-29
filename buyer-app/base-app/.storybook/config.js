import { configure, setAddon } from '@storybook/react';
import infoAddon from '@storybook/addon-info';

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

setAddon(infoAddon);
configure(loadStories, module);
