import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Link
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock
} from '@mui/icons-material';
import { authUtils } from '../utils/authUtils';
import { useNavigate } from 'react-router';
import { toastSuccess } from '../components/global/NotificationToast';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else {
          const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          if (!isEmail) {
            error = 'Please enter a valid email address';
          }
        }
        break;
      case 'password':
        if (!value.trim()) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      default:
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validateField('password', formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setLoginError('');
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/vite/dealer/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        console.log('Login successful, token:', data.token);
        toastSuccess('Login successful!');
        if (formData.rememberMe) {
          localStorage.setItem("myapp-email", formData.email); localStorage.setItem("myapp-password", password)
        }
        else {
          localStorage.setItem("myapp-email", ""); localStorage.setItem("myapp-password", "")
        }

        authUtils.setToken(data.token);

        if (onLogin) {
          onLogin();
        }

        navigate('/dashboard');

      } catch (error) {
        setLoginError(error.message || 'Login failed. Please check your credentials and try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };


  const getError = (fieldName) => {
    return errors[fieldName] || '';
  };

  return (
    <Container className='auth-parent' component="main" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography component="h1" variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to your account to continue
          </Typography>
        </Box>

        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleInputChange}
            error={!!getError('email')}
            helperText={getError('email')}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!getError('password')}
            helperText={getError('password')}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link href="/signup" variant="body2" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;