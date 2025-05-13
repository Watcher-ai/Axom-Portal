import { RouteObject } from 'react-router-dom';
import DashboardPage from './../dashboard/dashboard-page.component';
import HomePage from '../Home.component';
import Header from '../Header.component';
import Settings from '../settings/settings.component';

const routes: RouteObject[] = [
  {
    path: '/',
    element: (<Header>
                <HomePage/>
              </Header>),
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/settings',
    element: <Settings/>,
  }
  // Add more routes here as needed
];

export default routes;