import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { isAuth, signout } from '../auth/helpers';

const Layout = ({ children, match, history }) => {
  const isActive = path => {
    if (match.path === path) {
      return { color: '#000' };
    }
    return { color: '#fff' };
  };

  const nav = () => (
    <ul className='nav nav-tabs bg-primary'>
      <li className='nav-item'>
        <Link to='/' className='nav-link' style={isActive('/')}>Home</Link>
      </li>
      {isAuth()
        ? (
          <>
            <li className='nav-item'>
              <Link
                to={isAuth().role === 'admin' ? '/admin' : '/private'}
                className='nav-link'
                style={isActive(isAuth().role === 'admin' ? '/admin' : '/private')}
              >
                {isAuth().name}

              </Link>
            </li>
            <li className='nav-item'>
              <span
                className='nav-link'
                style={{ cursor: 'pointer', color: '#fff' }}
                onClick={() => {
                  signout(() => {
                    history.push('/');
                  });
                }}
              >
                Sign out
              </span>
            </li>
          </>
        )
        : (
          <>
            <li className='nav-item'>
              <Link to='/signin' className='nav-link' style={isActive('/signin')}>Sign in</Link>
            </li>
            <li className='nav-item'>
              <Link to='/signup' className='nav-link' style={isActive('/signup')}>Sign up</Link>
            </li>
          </>
        )}
    </ul>
  );

  return (
    <>
      {nav()}
      <div className='container'>{children}</div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.shape({}),
  match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};
Layout.defaultProps = { children: null };

export default withRouter(Layout);
