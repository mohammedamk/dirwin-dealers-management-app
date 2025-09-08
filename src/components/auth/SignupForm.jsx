import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  IconButton,
  Autocomplete,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Person,
  Business,
  LocalShipping,
  Assignment,
  Visibility,
  VisibilityOff,
  Lock,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

const steps = ['Shop Information', 'Account Details', 'Contact Details', 'Address', 'Review & Submit'];

const SignupForm = ({ onSignup }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    phone: '',
    primaryContactName: '',
    primaryContactEmail: '',
    password: '',
    confirmPassword: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    termsAccepted: false,
    useSameAddress: false
  });
  const [errors, setErrors] = useState({});
  const [shopValidationLoading, setShopValidationLoading] = useState(false);
  const [shopValidationError, setShopValidationError] = useState('');
  const [shopValidationSuccess, setShopValidationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [shopSuggestions, setShopSuggestions] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopInput, setShopInput] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

    return {
      isValid: hasMinLength && hasLowercase && hasUppercase && hasNumber && hasSpecialChar,
      errors: {
        minLength: !hasMinLength ? 'Password must be at least 8 characters' : null,
        lowercase: !hasLowercase ? 'Password must contain at least one lowercase letter' : null,
        uppercase: !hasUppercase ? 'Password must contain at least one uppercase letter' : null,
        number: !hasNumber ? 'Password must contain at least one number' : null,
        specialChar: !hasSpecialChar ? 'Password must contain at least one special character' : null
      }
    };
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'shopName':
        if (!value.trim()) error = 'Shop name is required';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!validateEmail(value)) error = 'Invalid email address';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (value.length < 10) error = 'Phone number must be at least 10 digits';
        break;
      case 'primaryContactName':
        if (!value.trim()) error = 'Primary contact name is required';
        break;
      case 'primaryContactEmail':
        if (value && !validateEmail(value)) error = 'Invalid email address';
        break;
      case 'password':
        const passwordValidation = validatePassword(value);
        if (!value.trim()) error = 'Password is required';
        else if (!passwordValidation.isValid) {
          const firstError = Object.values(passwordValidation.errors).find(err => err !== null);
          error = firstError || '';
        }
        break;
      case 'confirmPassword':
        if (!value.trim()) error = 'Please confirm your password';
        else if (value !== formData.password) error = "Passwords don't match";
        break;
      case 'billingAddress.street':
        if (!value.trim()) error = 'Street address is required';
        break;
      case 'billingAddress.city':
        if (!value.trim()) error = 'City is required';
        break;
      case 'billingAddress.state':
        if (!value.trim()) error = 'State is required';
        break;
      case 'billingAddress.zipCode':
        if (!value.trim()) error = 'Zip code is required';
        else if (value.length < 5) error = 'Zip code must be at least 5 digits';
        break;
      case 'billingAddress.country':
        if (!value.trim()) error = 'Country is required';
        break;
      case 'shippingAddress.street':
        if (!formData.useSameAddress && !value.trim()) error = 'Street address is required';
        break;
      case 'shippingAddress.city':
        if (!formData.useSameAddress && !value.trim()) error = 'City is required';
        break;
      case 'shippingAddress.state':
        if (!formData.useSameAddress && !value.trim()) error = 'State is required';
        break;
      case 'shippingAddress.zipCode':
        if (!formData.useSameAddress && !value.trim()) error = 'Zip code is required';
        else if (!formData.useSameAddress && value.length < 5) error = 'Zip code must be at least 5 digits';
        break;
      case 'shippingAddress.country':
        if (!formData.useSameAddress && !value.trim()) error = 'Country is required';
        break;
      case 'termsAccepted':
        if (!value) error = 'You must accept the terms and conditions';
        break;
      default:
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("name, value, type, checked ", name, value, type, checked);
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));

      if (name === 'useSameAddress' && checked) {
        console.log("clicked useSameAddress");

        setFormData(prev => ({
          ...prev,
          shippingAddress: { ...prev.billingAddress }
        }));
      }
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        const shopNameError = validateField('shopName', formData.shopName);
        if (shopNameError) newErrors.shopName = shopNameError;
        break;
      case 1:
        const emailError = validateField('email', formData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validateField('password', formData.password);
        if (passwordError) newErrors.password = passwordError;

        const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);
        if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
        break;
      case 2:
        const phoneError = validateField('phone', formData.phone);
        if (phoneError) newErrors.phone = phoneError;

        const primaryContactNameError = validateField('primaryContactName', formData.primaryContactName);
        if (primaryContactNameError) newErrors.primaryContactName = primaryContactNameError;

        const primaryContactEmailError = validateField('primaryContactEmail', formData.primaryContactEmail);
        if (primaryContactEmailError) newErrors.primaryContactEmail = primaryContactEmailError;
        break;
      case 3:
        const billingStreetError = validateField('billingAddress.street', formData.billingAddress.street);
        if (billingStreetError) newErrors['billingAddress.street'] = billingStreetError;

        const billingCityError = validateField('billingAddress.city', formData.billingAddress.city);
        if (billingCityError) newErrors['billingAddress.city'] = billingCityError;

        const billingStateError = validateField('billingAddress.state', formData.billingAddress.state);
        if (billingStateError) newErrors['billingAddress.state'] = billingStateError;

        const billingZipError = validateField('billingAddress.zipCode', formData.billingAddress.zipCode);
        if (billingZipError) newErrors['billingAddress.zipCode'] = billingZipError;

        const billingCountryError = validateField('billingAddress.country', formData.billingAddress.country);
        if (billingCountryError) newErrors['billingAddress.country'] = billingCountryError;

        if (!formData.useSameAddress) {
          const shippingStreetError = validateField('shippingAddress.street', formData.shippingAddress.street);
          if (shippingStreetError) newErrors['shippingAddress.street'] = shippingStreetError;

          const shippingCityError = validateField('shippingAddress.city', formData.shippingAddress.city);
          if (shippingCityError) newErrors['shippingAddress.city'] = shippingCityError;

          const shippingStateError = validateField('shippingAddress.state', formData.shippingAddress.state);
          if (shippingStateError) newErrors['shippingAddress.state'] = shippingStateError;

          const shippingZipError = validateField('shippingAddress.zipCode', formData.shippingAddress.zipCode);
          if (shippingZipError) newErrors['shippingAddress.zipCode'] = shippingZipError;

          const shippingCountryError = validateField('shippingAddress.country', formData.shippingAddress.country);
          if (shippingCountryError) newErrors['shippingAddress.country'] = shippingCountryError;
        }
        break;
      case 4:
        const termsError = validateField('termsAccepted', formData.termsAccepted);
        if (termsError) newErrors.termsAccepted = termsError;
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateShopNameWithGoogle = async (shopName) => {
    setShopValidationLoading(true);
    setShopValidationError('');
    setShopValidationSuccess(false);

    try {
      const googleAPIKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const serverURL = import.meta.env.VITE_SERVER_URL;
      if (googleAPIKey) {
        const response = await fetch(
          `${serverURL}/api/getBussinessDetails`,
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ businessName: shopName })
          }
        );

        if (!response.ok) {
          throw new Error("Error occurred while validating shop name");
        }

        const data = await response.json();
        console.log("data............", data.predictions);
        setShopSuggestions(Array.isArray(data?.predictions) ? data.predictions : []);
      }
    } catch (error) {
      setShopValidationError(error?.message || 'Validation service error');
      setErrors(prev => ({
        ...prev,
        shopName: error?.message || 'Validation service error'
      }));
    } finally {
      setShopValidationLoading(false);
    }
  };

  const handleNext = async () => {
    const isValid = validateStep(activeStep);

    if (isValid) {
      if (activeStep === 0 && !shopValidationSuccess) {
        setErrors(prev => ({
          ...prev,
          shopName: 'Please search and select your shop from the list'
        }));
        return;
      }
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateStep(activeStep);

    try {
      if (isValid && activeStep === steps.length - 1) {
        setIsSubmitting(true);
        // setSignupError('');

        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/dealer/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Signup successful, token:', data.token);
          // if (onSignup) {
          //   onSignup();
          // }
          navigate('/login');
        } else {
          const errorData = await response.json();
          // setSignupError(errorData.message || 'Signup failed. Please try again.');
        }
      } else if (isValid) {
        handleNext();
      }
    } catch (error) {
      // setSignupError('Signup failed. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getError = (fieldName) => {
    return errors[fieldName] || '';
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Zoom in={true}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Business color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Shop Information</Typography>
              </Box>

              <Autocomplete
                options={shopSuggestions}
                value={selectedShop}
                inputValue={shopInput}
                loading={shopValidationLoading}
                onInputChange={(_, newInput) => {
                  setShopInput(newInput);
                  setSelectedShop(null);
                  setShopValidationSuccess(false);
                  setFormData(prev => ({ ...prev, shopName: '' }));
                  if (newInput && newInput.trim().length > 2) {
                    validateShopNameWithGoogle(newInput.trim());
                  } else {
                    setShopSuggestions([]);
                  }
                }}
                onChange={(_, newValue) => {
                  setSelectedShop(newValue);
                  if (newValue) {
                    const mainText =
                      newValue?.structured_formatting?.main_text ||
                      newValue?.terms?.[0]?.value ||
                      '';
                    setFormData(prev => ({ ...prev, shopName: mainText }));
                    setErrors(prev => ({ ...prev, shopName: '' }));
                    setShopValidationSuccess(true);
                  } else {
                    setFormData(prev => ({ ...prev, shopName: '' }));
                    setShopValidationSuccess(false);
                  }
                }}
                freeSolo={false}
                isOptionEqualToValue={(opt, val) => opt.place_id === val.place_id}
                getOptionLabel={(opt) => {
                  if (typeof opt === 'string') return opt;
                  const main = opt?.structured_formatting?.main_text ?? '';
                  const desc = opt?.description ?? '';
                  return main ? main : desc;
                }}
                renderOption={(props, option) => {
                  const main = option?.structured_formatting?.main_text ?? '';
                  const desc = option?.description ?? '';
                  return (
                    <li {...props} key={option.place_id}>
                      <Box>
                        <Typography fontWeight={600}>{main}</Typography>
                        <Typography variant="caption">{desc}</Typography>
                      </Box>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search your shop on Google"
                    fullWidth
                    error={!!getError('shopName')}
                    helperText={getError('shopName') || "Type at least 3 characters, then select your shop from the list"}
                    sx={{ mb: 2 }}
                  />
                )}
                noOptionsText={shopInput.length < 3 ? 'Keep typing your business name..' : 'No matches found'}
              />
              {shopValidationSuccess && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  Shop name validated successfully!
                </Alert>
              )}
              {shopValidationError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {shopValidationError}
                </Alert>
              )}
            </Box>
            {/* <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link href="/login" variant="body2" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>
                  Login
                </Link>
              </Typography>
            </Box> */}
          </Zoom>
        );

      case 1:
        return (
          <Zoom in={true}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Lock color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Account Details</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getError('email')}
                    helperText={getError('email')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getError('password')}
                    helperText={getError('password') || "Must be at least 8 characters with uppercase, lowercase, number, and special character"}
                    slotProps={{
                      input: {
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
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getError('confirmPassword')}
                    helperText={getError('confirmPassword')}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Zoom>
        );

      case 2:
        return (
          <Zoom in={true}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Contact Information</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="phone"
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getError('phone')}
                    helperText={getError('phone')}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 2 }}>
                <Person color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Primary Contact</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="primaryContactName"
                    label="Primary Contact Name"
                    value={formData.primaryContactName}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getError('primaryContactName')}
                    helperText={getError('primaryContactName')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="primaryContactEmail"
                    label="Primary Contact Email (if different)"
                    type="email"
                    value={formData.primaryContactEmail}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getError('primaryContactEmail')}
                    helperText={getError('primaryContactEmail') || "Optional"}
                  />
                </Grid>
              </Grid>
            </Box>
          </Zoom>
        );

      case 3:
        return (
          <Zoom in={true}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Billing Address</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="billingAddress.street"
                    label="Street Address"
                    value={formData.billingAddress.street}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getError('billingAddress.street')}
                    helperText={getError('billingAddress.street')}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="billingAddress.city"
                    label="City"
                    value={formData.billingAddress.city}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getError('billingAddress.city')}
                    helperText={getError('billingAddress.city')}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="billingAddress.state"
                    label="State"
                    value={formData.billingAddress.state}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getError('billingAddress.state')}
                    helperText={getError('billingAddress.state')}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="billingAddress.zipCode"
                    label="Zip Code"
                    value={formData.billingAddress.zipCode}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getError('billingAddress.zipCode')}
                    helperText={getError('billingAddress.zipCode')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="billingAddress.country"
                    label="Country"
                    value={formData.billingAddress.country}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!getError('billingAddress.country')}
                    helperText={getError('billingAddress.country')}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="useSameAddress"
                      checked={formData.useSameAddress}
                      onChange={handleInputChange}
                    />
                  }
                  label="Use same address for shipping"
                />
              </Box>

              {!formData.useSameAddress && (
                <Fade in={!formData.useSameAddress}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 2 }}>
                      <LocalShipping color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Shipping Address</Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          name="shippingAddress.street"
                          label="Street Address"
                          value={formData.shippingAddress.street}
                          onChange={handleInputChange}
                          fullWidth
                          error={!!getError('shippingAddress.street')}
                          helperText={getError('shippingAddress.street')}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="shippingAddress.city"
                          label="City"
                          value={formData.shippingAddress.city}
                          onChange={handleInputChange}
                          fullWidth
                          error={!!getError('shippingAddress.city')}
                          helperText={getError('shippingAddress.city')}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="shippingAddress.state"
                          label="State"
                          value={formData.shippingAddress.state}
                          onChange={handleInputChange}
                          fullWidth
                          error={!!getError('shippingAddress.state')}
                          helperText={getError('shippingAddress.state')}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="shippingAddress.zipCode"
                          label="Zip Code"
                          value={formData.shippingAddress.zipCode}
                          onChange={handleInputChange}
                          fullWidth
                          error={!!getError('shippingAddress.zipCode')}
                          helperText={getError('shippingAddress.zipCode')}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="shippingAddress.country"
                          label="Country"
                          value={formData.shippingAddress.country}
                          onChange={handleInputChange}
                          fullWidth
                          error={!!getError('shippingAddress.country')}
                          helperText={getError('shippingAddress.country')}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              )}
            </Box>
          </Zoom>
        );

      case 4:
        return (
          <Zoom in={true}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Review Information</Typography>
              </Box>

              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Shop Information
                </Typography>
                <Typography>{formData.shopName}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Account Details
                </Typography>
                <Typography>Email: {formData.email}</Typography>
                <Typography>Password: {"•".repeat(8)}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Contact Information
                </Typography>
                <Typography>Phone: {formData.phone}</Typography>
                <Typography>Contact: {formData.primaryContactName}</Typography>
                {formData.primaryContactEmail && (
                  <Typography>Contact Email: {formData.primaryContactEmail}</Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Billing Address
                </Typography>
                <Typography>{formData.billingAddress.street}</Typography>
                <Typography>
                  {formData.billingAddress.city}, {formData.billingAddress.state} {formData.billingAddress.zipCode}
                </Typography>
                <Typography>{formData.billingAddress.country}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Shipping Address
                </Typography>
                {formData.useSameAddress ? (
                  <Typography>Same as billing address</Typography>
                ) : (
                  <>
                    <Typography>{formData.shippingAddress.street}</Typography>
                    <Typography>
                      {formData.shippingAddress.city}, {formData.shippingAddress.state} {formData.shippingAddress.zipCode}
                    </Typography>
                    <Typography>{formData.shippingAddress.country}</Typography>
                  </>
                )}
              </Paper>

              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I accept the{' '}
                      <Button variant="text" size="small" sx={{ textTransform: 'none' }}>
                        Terms and Conditions
                      </Button>
                    </Typography>
                  }
                />
                {getError('termsAccepted') && (
                  <Typography color="error" variant="caption">
                    {getError('termsAccepted')}
                  </Typography>
                )}
              </Box>
            </Box>
          </Zoom>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold" color="primary">
          Dealer Signup
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }} align="center">
          Create your dealer account to get started with our exclusive services
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{!isMobile && label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={onSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 3 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />

            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting || !shopValidationSuccess}
                sx={{ minWidth: 140 }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Create Account'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                size="large"
              >
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default SignupForm;