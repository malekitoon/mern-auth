import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Layout from '../core/Layout';

const Signup = props => (
  <Layout>
    <ToastContainer />
    <h1>sign up</h1>
  </Layout>
);

Signup.propTypes = {};

export default Signup;
