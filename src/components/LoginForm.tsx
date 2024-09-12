import React from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../globals.css';
import Cookies from 'js-cookie';

function LoginForm({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('Logging you in');

    try {
      // Directly use the `credentials` state instead of `FormData`
      const loginData = {
        username: credentials.username,
        password: credentials.password,
      };

      console.log(loginData);

      const response = await axios.post(
        'https://career-dashboard-9b2b8318a630.herokuapp.com/api/auth/login',
        loginData,
        {
          withCredentials: true, // Send cookies with the request
        }
      );

      if (response.data.success) {
        // Redirect to dashboard on successful login
        console.log('Successful login');
        onLoginSuccess(response.data.token);
        Cookies.set('jwt', response.data.token, { sameSite: 'strict' });
        localStorage.setItem('jwt', response.data.token);
        navigate('/dashboard');
      } else {
        // Log login failure with the error message
        console.log('Login failed:', response.data.message);
      }
    } catch (error) {
      // Log any other errors that occur during the login process
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Server error during login:', error.response.data);
      } else if (error.request) {
        // Request was made, but no response was received
        console.error('No response received:', error.request);
      } else {
        // Other errors (client-side, etc.)
        console.error('Error during login:', error.message);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="login-form">
      <Typography component="h1" variant="h4">
        Login:
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          value={credentials.username}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={credentials.password}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
}

export default LoginForm;
