import HomePage from './pages/home';
import MetricDetails from './pages/metric-details';
import Settings from './pages/settings';

interface PageRoute {
  path: `/${string}`;
  component: JSX.Element;
  label: string;
}

export const routes: PageRoute[] = [
  {
    component: <HomePage />,
    label: 'Home',
    path: '/',
  },
  {
    path: '/:metric/:_id',
    component: <MetricDetails />,
    label: 'Details',
  },
  {
    path: '/settings',
    component: <Settings />,
    label: 'Settings',
  },
];
