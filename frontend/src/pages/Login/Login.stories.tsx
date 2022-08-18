import { ComponentMeta } from '@storybook/react'

import { Login } from './Login'

export default {
  title: 'Login',
  component: Login,
} as ComponentMeta<typeof Login>

export const Primary = <Login />