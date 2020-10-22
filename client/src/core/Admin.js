import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Layout from './Layout';
import { isAuth, getCookie, signout, updateUser } from '../auth/helpers';

const Admin = ({ history }) => {
  const [values, setValues] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    bottomText: 'Submit',
  });

  const loadProfile = () => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: { Authorization: `Bearer ${getCookie('token')}` },
    })
      .then(response => {
        const { role, name, email } = response.data;
        setValues({ ...values, role, name, email });
      })
      .catch(err => {
        console.log('PRIVATE PROFILE UPDATE ERROR', err.response.data.error);

        if (err.response.status === 401) {
          signout();
          history.push('/');
        }
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const { role, name, email, password, bottomText } = values;

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, bottomText: 'Submitting' });

    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/admin/update`,
      headers: { Authorization: `Bearer ${getCookie('token')}` },
      data: { name, password },
    })
      .then(response => {
        console.log('PRIVATE PROFILE UPDATE SUCCESS', response);
        updateUser(response, () => {
          setValues({ ...values, bottomText: 'Submitted' });
          toast.success('Profile updated successfully');
        });
      })
      .catch(err => {
        console.log('PRIVATE PROFILE UPDATE ERROR', err);
        setValues({ ...values, bottomText: 'Submit' });
        toast.error(err.response.data.error);
      });
  };

  const adminForm = () => (
    <form>
      <div className='form-group'>
        <label htmlFor='role' className='text-muted'>Role</label>
        <input
          type='text'
          id='role'
          className='form-control'
          defaultValue={role}
          disabled
        />
      </div>

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
          defaultValue={email}
          disabled
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
        <h1 className='pt-5 text-center'>Admin</h1>
        <p className='lead text-center'>Profile Update</p>
        {adminForm()}
      </div>
    </Layout>
  );
};

Admin.propTypes = { history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired };

export default Admin;
