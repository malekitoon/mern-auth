import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Layout from '../core/Layout';

const Activate = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    token: '',
  });

  useEffect(() => {
    console.log('qaqaqaqaqa');
    const { token } = match.params;
    console.log('token=', token);
    const { name } = jwt.decode(token);
    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);

  const { name, token } = values;

  const clickSubmit = event => {
    event.preventDefault();

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token },
    })
      .then(response => {
        console.log('ACTIVATE SUCCESS', response);
        // save the response to localStorage/cookies
        toast.success(response.data.message);
      })
      .catch(err => {
        console.log('ACTIVATE ERROR', err);
        toast.error(err.response.data.error);
      });
  };

  const activationLink = () => (
    <div className='text-center'>
      <h1 className='p-5'>
        Hey
        {' '}
        {name}
        , ready to activate your account?
      </h1>
      <button
        type='button'
        className='btn btn-outline-primary'
        onClick={clickSubmit}
      >
        Activate Account
      </button>
    </div>
  );

  return (
    <Layout>
      <div className='col-md-6 offset-md-3'>
        <ToastContainer />
        {activationLink()}
      </div>
    </Layout>
  );
};

Activate.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ token: PropTypes.string }).isRequired,
    dummy: PropTypes.string,
  }).isRequired,
};

export default Activate;
