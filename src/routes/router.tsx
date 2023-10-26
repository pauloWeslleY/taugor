import { Routes, Route } from 'react-router-dom';

import Login from '../pages/login';
import NotFound from '../pages/notFound';
import Home from '../pages/home';

export default function RoutesApp() {

  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/home' element={<Home />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}