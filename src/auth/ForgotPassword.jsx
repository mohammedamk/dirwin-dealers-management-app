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
  Checkbox
} from '@mui/material';
import {
  Email as EmailIcon,
  VpnKey as VpnKeyIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { toastError, toastSuccess } from '../components/global/NotificationToast';
import { useNavigate } from 'react-router';

const ForgotPassword = () => {
  const [step, setStep] = useState('enterEmail');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');
  const [serverSeverity, setServerSeverity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (value) => {
    if (!value || !value.trim()) return 'Email is required';
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return isEmail ? '' : 'Please enter a valid email address';
  };

  const validateOtp = (value) => {
    if (!value || !value.trim()) return 'OTP is required';
    return value.length < 3 ? 'Enter a valid OTP' : '';
  };

  const validatePassword = (value) => {
    if (!value || !value.trim()) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const clearMessages = () => {
    setServerMessage('');
    setServerSeverity('');
    setErrors({});
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    clearMessages();

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/vite/dealer/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = payload?.message || 'Failed to send OTP. Please try again.';
        toastError(msg);
        setServerSeverity('error');
        setServerMessage(msg);
      } else {
        const msg = payload?.message || 'OTP sent to your email.';
        toastSuccess(msg);
        setServerSeverity('success');
        setServerMessage(msg);
        setStep('enterOTP');
      }
    } catch (err) {
      const msg = err?.message || 'Network error. Please try again.';
      toastError(msg);
      setServerSeverity('error');
      setServerMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    clearMessages();

    const otpError = validateOtp(otp);
    if (otpError) {
      setErrors({ otp: otpError });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/vite/dealer/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = payload?.message || 'OTP verification failed. Please try again.';
        toastError(msg);
        setServerSeverity('error');
        setServerMessage(msg);
      } else {
        const token = payload?.resetToken || payload?.token;
        if (!token) {
          const msg = 'Server did not return a reset token.';
          toastError(msg);
          setServerSeverity('error');
          setServerMessage(msg);
        } else {
          toastSuccess(payload?.message || 'OTP verified. You can set a new password.');
          setServerSeverity('success');
          setResetToken(token);
          setStep('enterNewPassword');
          setTermsAccepted(payload?.termsAccepted);
        }
      }
    } catch (err) {
      const msg = err?.message || 'Network error. Please try again.';
      toastError(msg);
      setServerSeverity('error');
      setServerMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e?.preventDefault();
    clearMessages();

    const passError = validatePassword(password);
    if (passError) {
      setErrors({ password: passError });
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    if (!resetToken) {
      setServerMessage('Missing reset token. Please restart the flow.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/vite/dealer/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password })
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = payload?.message || 'Failed to reset password. Please try again.';
        toastError(msg);
        setServerSeverity('error');
        setServerMessage(msg);
      } else {
        const msg = payload?.message || 'Password reset successful. Redirecting to login...';
        toastSuccess(msg);
        setServerSeverity('success');
        setServerMessage(msg);
        setStep('success');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      const msg = err?.message || 'Network error. Please try again.';
      toastError(msg);
      setServerSeverity('error');
      setServerMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await handleSendOtp();
  };

  return (
    <Container
      className="auth-parent"
      component="main"
      sx={{
        py: 6,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          maxWidth: 460,
          width: '100%',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography component="h1" variant="h4" fontWeight="bold" color="primary" gutterBottom>
            {step === 'enterEmail' && 'Forgot Password'}
            {step === 'enterOTP' && 'Enter OTP'}
            {step === 'enterNewPassword' && 'Set New Password'}
            {step === 'success' && 'Password Reset'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {step === 'enterEmail' && "Enter your account email and we'll send a one-time code (OTP)."}
            {step === 'enterOTP' && 'Enter the OTP we sent to your email.'}
            {step === 'enterNewPassword' && 'Choose a new secure password for your account.'}
            {step === 'success' && 'Your password has been reset. You will be redirected to login.'}
          </Typography>
        </Box>

        {serverMessage && (
          <Alert severity={serverSeverity || (errors && Object.keys(errors).length ? 'error' : 'info')} sx={{ mb: 2 }}>
            {serverMessage}
          </Alert>
        )}

        {step === 'enterEmail' && (
          <Box component="form" onSubmit={handleSendOtp} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="forgot-email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: '' })); if (serverMessage) setServerMessage(''); }}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Remembered your password? <a href="/login" style={{ textDecoration: 'none', fontWeight: 700 }}>Sign in</a>
              </Typography>
            </Box>
          </Box>
        )}

        {step === 'enterOTP' && (
          <Box component="form" onSubmit={handleVerifyOtp} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="OTP"
              name="otp"
              autoFocus
              value={otp}
              onChange={(e) => { setOtp(e.target.value); if (errors.otp) setErrors(prev => ({ ...prev, otp: '' })); if (serverMessage) setServerMessage(''); }}
              error={!!errors.otp}
              helperText={errors.otp}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon />
                  </InputAdornment>
                )
              }}
            />

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 3,
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  flex: { sm: 1 },
                  width: { xs: '100%', sm: 'auto' },
                  minHeight: 48,
                  py: 1.5,
                }}
              >
                {isLoading ? <CircularProgress size={20} /> : 'Verify OTP'}
              </Button>

              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={handleResendOtp}
                disabled={isLoading}
                sx={{
                  width: { xs: '100%', sm: 160 },
                  minHeight: 48,
                  py: 1.5,
                }}
              >
                Resend OTP
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Incorrect email? <a href="/forgot-password" style={{ textDecoration: 'none', fontWeight: 700 }}>Change email</a>
              </Typography>
            </Box>
          </Box>
        )}

        {step === 'enterNewPassword' && (
          <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              id="new-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: '' })); if (serverMessage) setServerMessage(''); }}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(s => !s)}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' })); if (serverMessage) setServerMessage(''); }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                )
              }}
            />

            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="termsAccepted"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2">
                    I accept the{' '}
                    <Button
                      variant="text"
                      size="small"
                      sx={{ textTransform: 'none' }}
                      target='_blank'
                      href={`${import.meta.env.VITE_SERVER_URL}/uploads/external-site/dirwin_bike_assembly_service_dealer_terms_of_service.pdf`}>
                      Terms and Conditions
                    </Button>
                  </Typography>
                }
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || !termsAccepted}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Need to change email? <a href="/forgot-password" style={{ textDecoration: 'none', fontWeight: 700 }}>Start over</a>
              </Typography>
            </Box>
          </Box>
        )}

        {step === 'success' && (
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Password successfully reset
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;