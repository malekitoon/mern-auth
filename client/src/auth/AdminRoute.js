import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { isAuth } from './helpers';

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
    props => (isAuth() && isAuth().role === 'admin'
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />)
  }
  />
);

AdminRoute.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  component: PropTypes.any.isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string }),
};

AdminRoute.defaultProps = { location: null };

export default AdminRoute;
