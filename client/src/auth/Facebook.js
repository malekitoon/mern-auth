import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.min.css';

const Facebook = ({ informParent }) => {
  const responseFacebook = response => {
    console.log(informParent);
    console.log(response);
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/facebook-login`,
      data: { idToken: response.tokenId },
    })
      .then(response => {
        console.log('FACEBOOK SIGNIN SUCCESS', response);
        informParent(response);
      })
      .catch(err => {
        console.log('FACEBOOK SIGNIN ERROR', err.response);
      });
  };

  // Error!!! FB login does NOT work since 2018
  // The method FB.login can no longer be called from http pages. https://developers.facebook.com/blog/post/2018/06/08/enforce-https-facebook-login/
  // FB.login() called before FB.init().
  return (
    <div className='pb-3'>
      <FacebookLogin
        appId={process.env.REACR_APP_FACEBOOK_APP_ID}
        autoLoad={false}
        fields='name,email,picture'
        callback={responseFacebook}
        render={renderProps => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className='btn btn-lg btn-block btn-primary'
            type='button'
          >
            <i className='fab fa-facebook pr-3' />
            {' '}
            Login with Facebook
          </button>
        )}
      />
    </div>
  );
};

Facebook.propTypes = { informParent: PropTypes.func };

Facebook.defaultProps = { informParent: () => {} };

export default withRouter(Facebook);
