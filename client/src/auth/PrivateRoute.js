import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { isAuth } from './helpers';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
    props => (isAuth()
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />)
  }
  />
);

PrivateRoute.propTypes = {};

export default PrivateRoute;
