import { ComponentMeta } from '@storybook/react';

import { Home } from './Home';

export default {
  title: 'Home',
  component: Home,
} as ComponentMeta<typeof Home>;

export const Primary = <Home />;