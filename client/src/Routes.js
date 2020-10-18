import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';

import App from './App';
import Signup from './auth/Signup';
import Signin from './auth/Signin';
import Activate from './auth/Activate';
import Private from './core/Private';
import Admin from './core/Admin';

const Routes = () => (
  <Router>
    <Switch>
      <Route path='/' exact component={App} />
      <Route path='/signup' exact component={Signup} />
      <Route path='/signin' exact component={Signin} />
      <Route path='/auth/activate/:token' exact component={Activate} />
      <PrivateRoute path='/private' exact component={Private} />
      <AdminRoute path='/admin' exact component={Admin} />
    </Switch>
  </Router>
);

export default Routes;
