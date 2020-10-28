import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Layout from '../core/Layout';

const defaultBtnText = 'Reset password';

const Reset = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    token: '',
    newPassword: '',
    bottomText: defaultBtnText,
  });

  const { name, token, newPassword, bottomText } = values;

  useEffect(() => {
    const { token } = match.params;
    const { name } = jwt.decode(token);

    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, bottomText: 'Submitting' });

    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/reset-password`,
      data: {
        resetPasswordLink: token,
        newPassword,
      },
    })
      .then(response => {
        console.log('RESET PASSWORD SUCCESS', response);
        toast.success(response.data.message);
        setValues({ ...values, email: '', bottomText: defaultBtnText });
      })
      .catch(err => {
        console.log('RESET PASSWORD ERROR', err);
        setValues({ ...values, bottomText: defaultBtnText });
        toast.error(err.response.data.error);
      });
  };

  // TODO check link is valid when page is loaded before user even try to change password
  const resetForm = () => (
    <form>
      <div className='form-group'>
        <label htmlFor='password' className='text-muted'>Password</label>
        <input
          type='password'
          id='password'
          className='form-control'
          value={newPassword}
          onChange={handleChange('newPassword')}
          placeholder='Type new password'
          required
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
        <h1 className='p-5 text-center'>{`Hey ${name}, type your new password`}</h1>
        {resetForm()}
      </div>
    </Layout>
  );
};

Reset.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string,
      dummy: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Reset;
