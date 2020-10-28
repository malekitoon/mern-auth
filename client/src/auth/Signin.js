import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Layout from '../core/Layout';
import { authenticate, isAuth } from './helpers';
import Google from './Google';

const Signin = ({ history }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    bottomText: 'Submit',
  });

  const { email, password, bottomText } = values;

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const informParent = response => {
    console.log('SIGNIN SUCCESS', response);
    authenticate(response, () => {
      if (isAuth() && isAuth().role === 'admin') {
        history.push('/admin');
      } else {
        history.push('/private');
      }
    });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, bottomText: 'Submitting' });

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password },
    })
      .then(response => {
        console.log('SIGNIN SUCCESS', response);
        authenticate(response, () => {
          setValues({ ...values, email: '', password: '', bottomText: 'Submitted' });
          // toast.success(`Hey ${response.data.user.name}, welcome back!`);
          if (isAuth() && isAuth().role === 'admin') {
            history.push('/admin');
          } else {
            history.push('/private');
          }
        });
      })
      .catch(err => {
        console.log('SIGNIN ERROR', err);
        setValues({ ...values, bottomText: 'Submit' });
        toast.error(err.response.data.error);
      });
  };

  const signinForm = () => (
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
        <h1 className='p-5 text-center'>Sign In</h1>
        <Google informParent={informParent} />
        {signinForm()}
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

Signin.propTypes = { history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired };

export default withRouter(Signin);
