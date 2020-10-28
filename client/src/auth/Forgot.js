import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Layout from '../core/Layout';

const defaultBtnText = 'Request reset password link';

const Forgot = () => {
  const [values, setValues] = useState({
    email: '',
    bottomText: defaultBtnText,
  });

  const { email, bottomText } = values;

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, bottomText: 'Submitting' });

    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/forgot-password`,
      data: { email },
    })
      .then(response => {
        console.log('FORGOT PASSWORD SUCCESS', response);
        toast.success(response.data.message);
        setValues({ ...values, email: '', bottomText: defaultBtnText });
      })
      .catch(err => {
        console.log('FORGOT PASSWORD ERROR', err);
        setValues({ ...values, bottomText: defaultBtnText });
        toast.error(err.response.data.error);
      });
  };

  const forgotForm = () => (
    <form>
      <div className='form-group'>
        <label htmlFor='email' className='text-muted'>Email</label>
        <input
          type='email'
          id='email'
          className='form-control'
          value={email}
          onChange={handleChange('email')}
        />
      </div>

      <div>
        <button type='submit' className='btn btn-primary' onClick={clickSubmit}>{bottomText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className='col-md-6 offset-md-3'>
        <ToastContainer />
        <h1 className='p-5 text-center'>Forgot Password</h1>
        {forgotForm()}
      </div>
    </Layout>
  );
};

Forgot.propTypes = {};

export default Forgot;
