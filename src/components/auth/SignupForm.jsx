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
  Autocomplete
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signupSchema = z.object({
  shopName: z.string().min(1, 'Shop name is required'),
  email: z.email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  primaryContactName: z.string().min(1, 'Primary contact name is required'),
  primaryContactEmail: z.email('Invalid email address').optional().or(z.literal('')),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  billingAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'Zip code must be at least 5 digits'),
    country: z.string().min(1, 'Country is required')
  }),
  shippingAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'Zip code must be at least 5 digits'),
    country: z.string().min(1, 'Country is required')
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const steps = ['Shop Information', 'Account Details', 'Contact Details', 'Address', 'Review & Submit'];

const SignupForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shopValidationLoading, setShopValidationLoading] = useState(false);
  const [shopValidationError, setShopValidationError] = useState('');
  const [shopValidationSuccess, setShopValidationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [shopSuggestions, setShopSuggestions] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopInput, setShopInput] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
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
      useSameAddress: true
    }
  });

  const useSameAddress = watch('useSameAddress', true);
  // const shopNameValue = watch('shopName');
  // const passwordValue = watch('password');

  const validateShopNameWithGoogle = async (shopName) => {
    setShopValidationLoading(true);
    setShopValidationError('');
    setShopValidationSuccess(false);

    try {
      const googleAPIKey = import.meta.env.VITE_GOOGLE_API_KEY
      const serverURL = import.meta.env.VITE_SERVER_URL
      if (googleAPIKey) {
        const response = await fetch(
          `${serverURL}/api/getBussinessDetails`,
          {
            method: "POST",
            body: JSON.stringify({ businessName: shopName })
          }
        );
        if (!response.ok) {
          throw new Error("error occured while validating shop name")
        }

        const data = await response.json();
        console.log("data............", data.predictions)
        setShopSuggestions(Array.isArray(data?.predictions) ? data.predictions : []);
      }

    } catch (error) {
      setShopValidationError(error?.message || 'Validation service error');
      setError('shopName', { message: error?.message || 'Validation service error' });
    } finally {
      setShopValidationLoading(false);
    }
  };


  const handleNext = async () => {
    let isValid = false;

    if (activeStep === 0) {
      isValid = await trigger(['shopName']);
      if (isValid && shopValidationSuccess) {
        setActiveStep((prevStep) => prevStep + 1);
      } else {
        setError('shopName', { message: 'Please search and select your shop from the list' });
      }
    } else if (activeStep === 1) {
      isValid = await trigger(['email', 'password', 'confirmPassword']);
      if (isValid) setActiveStep((prevStep) => prevStep + 1);
    } else if (activeStep === 2) {
      isValid = await trigger(['phone', 'primaryContactName', 'primaryContactEmail']);
      if (isValid) setActiveStep((prevStep) => prevStep + 1);
    } else if (activeStep === 3) {
      isValid = await trigger(['billingAddress.street', 'billingAddress.city',
        'billingAddress.state', 'billingAddress.zipCode', 'billingAddress.country']);
      if (!useSameAddress) {
        isValid = await trigger(['shippingAddress.street', 'shippingAddress.city',
          'shippingAddress.state', 'shippingAddress.zipCode', 'shippingAddress.country']);
      }
      if (isValid) setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data) => {
    console.log('Form data:', data);
    await new Promise(resolve => setTimeout(resolve, 2000));
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

              <Controller
                name="shopName"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={shopSuggestions}
                    value={selectedShop}
                    inputValue={shopInput}
                    loading={shopValidationLoading}
                    onInputChange={(_, newInput) => {
                      setShopInput(newInput);
                      setSelectedShop(null);
                      setShopValidationSuccess(false);
                      setValue('shopName', '');
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
                        field.onChange(mainText);
                        clearErrors('shopName');
                        setShopValidationSuccess(true);
                      } else {
                        field.onChange('');
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
                        error={!!errors.shopName}
                        helperText={
                          errors.shopName?.message ||
                          "Type at least 3 characters, then select your shop from the list"
                        }
                        // slotProps={{
                        //   input: {
                        //     ...params.InputProps,
                        //     endAdornment: (
                        //       <InputAdornment position="end">
                        //         {shopValidationLoading ? (
                        //           <CircularProgress size={20} />
                        //         ) : (
                        //           <IconButton aria-label="search" edge="end" onClick={() => validateShopNameWithGoogle(field.value)}>
                        //             <Search />
                        //           </IconButton>
                        //         )}
                        //       </InputAdornment>
                        //     )
                        //   }
                        // }}
                        sx={{ mb: 2 }}
                      />
                    )}
                    noOptionsText={shopInput.length < 3 ? 'Keep typing your business name..' : 'No matches found'}
                  />
                )}
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
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        error={!!errors.password}
                        helperText={errors.password?.message || "Must be at least 8 characters with uppercase, lowercase, number, and special character"}
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
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
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
                    )}
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
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone"
                        type="tel"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 2 }}>
                <Person color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Primary Contact</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="primaryContactName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Primary Contact Name"
                        error={!!errors.primaryContactName}
                        helperText={errors.primaryContactName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="primaryContactEmail"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Primary Contact Email (if different)"
                        type="email"
                        error={!!errors.primaryContactEmail}
                        helperText={errors.primaryContactEmail?.message || "Optional"}
                      />
                    )}
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
                  <Controller
                    name="billingAddress.street"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Street Address"
                        error={!!errors.billingAddress?.street}
                        helperText={errors.billingAddress?.street?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="billingAddress.city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="City"
                        error={!!errors.billingAddress?.city}
                        helperText={errors.billingAddress?.city?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="billingAddress.state"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="State"
                        error={!!errors.billingAddress?.state}
                        helperText={errors.billingAddress?.state?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="billingAddress.zipCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Zip Code"
                        error={!!errors.billingAddress?.zipCode}
                        helperText={errors.billingAddress?.zipCode?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="billingAddress.country"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Country"
                        error={!!errors.billingAddress?.country}
                        helperText={errors.billingAddress?.country?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      onChange={(e) => {
                        setValue('useSameAddress', e.target.checked);
                        if (e.target.checked) {
                          setValue('shippingAddress', watch('billingAddress'));
                        }
                      }}
                    />
                  }
                  label="Use same address for shipping"
                />
              </Box>

              {!useSameAddress && (
                <Fade in={!useSameAddress}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 2 }}>
                      <LocalShipping color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Shipping Address</Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Controller
                          name="shippingAddress.street"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Street Address"
                              error={!!errors.shippingAddress?.street}
                              helperText={errors.shippingAddress?.street?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Controller
                          name="shippingAddress.city"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="City"
                              error={!!errors.shippingAddress?.city}
                              helperText={errors.shippingAddress?.city?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Controller
                          name="shippingAddress.state"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="State"
                              error={!!errors.shippingAddress?.state}
                              helperText={errors.shippingAddress?.state?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Controller
                          name="shippingAddress.zipCode"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Zip Code"
                              error={!!errors.shippingAddress?.zipCode}
                              helperText={errors.shippingAddress?.zipCode?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name="shippingAddress.country"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Country"
                              error={!!errors.shippingAddress?.country}
                              helperText={errors.shippingAddress?.country?.message}
                            />
                          )}
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
                <Typography>{watch('shopName')}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Account Details
                </Typography>
                <Typography>Email: {watch('email')}</Typography>
                <Typography>Password: {"•".repeat(8)}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Contact Information
                </Typography>
                <Typography>Phone: {watch('phone')}</Typography>
                <Typography>Contact: {watch('primaryContactName')}</Typography>
                {watch('primaryContactEmail') && (
                  <Typography>Contact Email: {watch('primaryContactEmail')}</Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Billing Address
                </Typography>
                <Typography>{watch('billingAddress.street')}</Typography>
                <Typography>
                  {watch('billingAddress.city')}, {watch('billingAddress.state')} {watch('billingAddress.zipCode')}
                </Typography>
                <Typography>{watch('billingAddress.country')}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Shipping Address
                </Typography>
                {useSameAddress ? (
                  <Typography>Same as billing address</Typography>
                ) : (
                  <>
                    <Typography>{watch('shippingAddress.street')}</Typography>
                    <Typography>
                      {watch('shippingAddress.city')}, {watch('shippingAddress.state')} {watch('shippingAddress.zipCode')}
                    </Typography>
                    <Typography>{watch('shippingAddress.country')}</Typography>
                  </>
                )}
              </Paper>

              <Box sx={{ mt: 3 }}>
                <Controller
                  name="termsAccepted"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
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
                  )}
                />
                {errors.termsAccepted && (
                  <Typography color="error" variant="caption">
                    {errors.termsAccepted.message}
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

        <form onSubmit={handleSubmit(onSubmit)}>
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