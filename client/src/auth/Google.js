import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.min.css';

const Google = ({ informParent }) => {
  const responseGoogle = response => {
    console.log(response.tokenId);
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/google-login`,
      data: { idToken: response.tokenId },
    })
      .then(response => {
        console.log('GOOGLE SIGNIN SUCCESS', response);
        informParent(response);
      })
      .catch(err => {
        console.log('GOOGLE SIGNIN ERROR', err.response);
      });
  };

  return (
    <div className='pb-3'>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText='Login'
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy='single_host_origin'
        render={renderProps => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className='btn btn-lg btn-block btn-danger'
            type='button'
          >
            <i className='fab fa-google pr-3' />
            {' '}
            Login with Google
          </button>
        )}
      />
    </div>
  );
};

Google.propTypes = { informParent: PropTypes.func };

Google.defaultProps = { informParent: () => {} };

export default withRouter(Google);
