import { Routes, Route } from 'react-router-dom';

import Login from '../pages/login';
import NotFound from '../pages/notFound';
import Home from '../pages/home';
import PrivateRoutes from './private';
import Register from '../pages/register';

export default function RoutesApp() {

  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route
        path='/home'
        element={
          <PrivateRoutes>
            <Home />
          </PrivateRoutes>}
      />
      <Route
        path='/register'
        element={
          <PrivateRoutes>
            <Register />
          </PrivateRoutes>}
      />

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}