import React from 'react';
import Dashboard from './Dashboard';
import * as Icon from '@mui/icons-material'
import Lab from './Lab';

export interface ScreenProps {
  path: string
  name: string
  icon: JSX.Element
  component: React.ReactNode
}

const screens: ScreenProps[] = [
  {
    name: 'Dashboard',
    path: '/',
    component: <Dashboard/>,
    icon: <Icon.Home/>
  },
  {
    name: 'Láboratórios',
    path: '/lab',
    component: <Lab/>,
    icon: <Icon.Biotech/>
  }
];
export default screens;
