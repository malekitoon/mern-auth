import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const nav = () => (
    <ul className='nav nav-tabs bg-primary'>
      <li className='nav-item'>
        <Link to='/' className='nav-link text-light'>Home</Link>
      </li>
      <li className='nav-item'>
        <Link to='/signup' className='nav-link text-light'>Sign up</Link>
      </li>
    </ul>
  );

  return (
    <>
      {nav()}
      <div className='container'>{children}</div>
    </>
  );
};

Layout.propTypes = { children: PropTypes.shape({}) };
Layout.defaultProps = { children: null };

export default Layout;
