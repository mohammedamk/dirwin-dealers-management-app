import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router';
import ShopDetailsStep from '../components/layout/auth/ShopDetailsStep';
import ContactDetailsStep from '../components/layout/auth/ContactDetailsStep';
import AccountDetailsStep from '../components/layout/auth/AccountDetailsStep';
import BillingDetailsStep from '../components/layout/auth/BillingDetailsStep';
import ReviewDetailsStep from '../components/layout/auth/ReviewDetailsStep';
import { validateStep } from '../utils/authUtils';
import { toastError, toastSuccess } from '../components/global/NotificationToast';

const steps = ['Shop Information', 'Account Details', 'Contact Details', 'Address', 'Review & Submit'];

const SignupForm = ({ onSignup }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    primaryContactEmail: '',
    password: '',
    confirmPassword: '',
    preferredPaymentMethod: 'credit_card',
    paymentMethodId: '',
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


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // console.log(`name: "${name}" | value: "${value}" | type: "${type}" | checked: ${checked}`);
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));

      if (name === 'useSameAddress') {
        setFormData(prev => ({
          ...prev,
          shippingAddress: {
            ...(checked ? { ...prev.billingAddress } : {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            })
          }
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



  const validateShopNameWithGoogle = async (shopName) => {
    setShopValidationLoading(true);
    setShopValidationSuccess(false);

    try {
      const googleAPIKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const serverURL = import.meta.env.VITE_SERVER_URL;
      if (googleAPIKey) {
        const response = await fetch(
          `${serverURL}/vite/getBussinessDetails`,
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ businessName: shopName })
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          // const now = new Date();
          // const formattedTime = now.toLocaleTimeString("en-US", {
          //   hour: "2-digit",
          //   minute: "2-digit",
          //   second: "2-digit"
          // }) + `.${now.getMilliseconds()}`;

          // console.log("data............", formattedTime, "   ddddddddddddddd   ", data?.results);
          setShopSuggestions(Array.isArray(data?.results) ? data.results : []);
        }
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        shopName: error?.message || 'Validation service error'
      }));
    } finally {
      setShopValidationLoading(false);
    }
  };

  const handleNext = async () => {
    // console.log("formData before next:", formData);
    const isValid = validateStep({
      step: activeStep,
      formData,
      setErrors: (errs) => setErrors(errs)
    });

    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateStep({
      step: activeStep,
      formData,
      setErrors: (errs) => setErrors(errs)
    });

    try {
      if (isValid && activeStep === steps.length - 1) {
        setIsSubmitting(true);
        // setSignupError('');
        // console.log('Submitting signup form with data:', formData);
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/vite/dealer/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.status === 200) {
          const data = await response.json();
          // console.log('Signup successful, token:', data.token);
          // if (onSignup) {
          //   onSignup();
          // }
          toastSuccess('Signup successful! Please log in.');
          navigate('/login');
        } else {
          const errorData = await response.json();
          toastError(errorData?.message || 'Signup failed. Please try again.');
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
          <ShopDetailsStep
            setFormData={setFormData}
            getError={getError}
            shopSuggestions={shopSuggestions}
            shopInput={shopInput}
            setShopInput={setShopInput}
            selectedShop={selectedShop}
            setSelectedShop={setSelectedShop}
            shopValidationLoading={shopValidationLoading}
            validateShopNameWithGoogle={validateShopNameWithGoogle}
            shopValidationSuccess={shopValidationSuccess}
            setShopValidationSuccess={setShopValidationSuccess}
            setShopSuggestions={setShopSuggestions}
            setErrors={setErrors}
          />
        );

      case 1:
        return (
          <AccountDetailsStep
            formData={formData}
            getError={getError}
            handleInputChange={handleInputChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        );

      case 2:
        return (
          <ContactDetailsStep
            formData={formData}
            getError={getError}
            handleInputChange={handleInputChange}
          />
        );

      case 3:
        return (
          <BillingDetailsStep
            formData={formData}
            getError={getError}
            handleInputChange={handleInputChange}
          />
        );

      case 4:
        return (
          <ReviewDetailsStep
            formData={formData}
            getError={getError}
            handleInputChange={handleInputChange}
          />
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Container className='auth-parent' maxWidth="md" sx={{ py: 4 }}>
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
                disabled={isSubmitting}
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
        {activeStep == 0 && <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link href="/login" variant="body2" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>
              Login
            </Link>
          </Typography>
        </Box>}
      </Paper>
    </Container>
  );
};

export default SignupForm;