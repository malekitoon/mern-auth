import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Layout from '../core/Layout';
import { isAuth } from './helpers';

const Signup = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    bottomText: 'Submit',
  });

  const { name, email, password, bottomText } = values;

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, bottomText: 'Submitting' });

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/signup`,
      data: { name, email, password },
    })
      .then(response => {
        console.log('SIGNUP SUCCESS', response);
        setValues({ ...values, name: '', email: '', password: '', bottomText: 'Submitted' });
        toast.success(response.data.message);
      })
      .catch(err => {
        console.log('SIGNUP ERROR', err);
        setValues({ ...values, bottomText: 'Submit' });
        toast.error(err.response.data.error);
      });
  };

  const signupForm = () => (
    <form>
      <div className='form-group'>
        <label htmlFor='name' className='text-muted'>Name</label>
        <input
          type='text'
          id='name'
          className='form-control'
          value={name}
          onChange={handleChange('name')}
        />
      </div>

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

      <div className='form-group'>
        <label htmlFor='password' className='text-muted'>Password</label>
        <input
          type='password'
          id='password'
          className='form-control'
          value={password}
          onChange={handleChange('password')}
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
        {isAuth() ? <Redirect to='/' /> : null}
        <h1 className='p-5 text-center'>Sign Up</h1>
        {signupForm()}
        <br />
        <Link
          to='/auth/password/forgot'
          className='btn btn-sm btn-outline-danger'
        >
          Forgot password
        </Link>
      </div>
    </Layout>
  );
};

Signup.propTypes = {};

export default Signup;
