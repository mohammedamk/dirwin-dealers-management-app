import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import {
    Box,
    Typography,
    Grid,
    Chip,
    Avatar,
    Stack,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
} from "@mui/material";
import {
    Business,
    Person,
    Email,
    Phone,
    Payment,
    CheckCircle,
    LocationOn,
    LocalShipping,
    Edit,
} from "@mui/icons-material";
import LoadingScreen from "../components/global/LoadingScreen";
import { styled } from "@mui/material/styles";
import { authUtils } from "../utils/authUtils";
import { toastSuccess, toastError } from "../components/global/NotificationToast";

const ProfileHeader = styled(Box)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(3),
}));

const InfoCard = styled(Card)(({ theme }) => ({
    height: '100%',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.light,
    color: 'white',
    marginRight: theme.spacing(2),
}));

const StatusChip = styled(Chip)(({ theme }) => ({
    fontWeight: 'bold',
    '&.MuiChip-colorSuccess': {
        backgroundColor: '#e8f5e8',
        color: '#2e7d32',
    },
    '&.MuiChip-colorError': {
        backgroundColor: '#ffebee',
        color: '#c62828',
    },
}));

const EditButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

export default function Profile() {
    const { userData, setUserData } = useUser();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!userData) {
        return <LoadingScreen />;
    }

    const {
        shopName,
        email,
        phone,
        primaryContactEmail,
        firstName,
        lastName,
        preferredPaymentMethod,
        billingAddress,
        shippingAddress,
        useSameAddress,
        termsAccepted,
        createdAt,
        updatedAt,
    } = userData;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleEditClick = (section, data) => {
        setEditingSection(section);
        setEditFormData(data);
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setEditingSection(null);
        setEditFormData({});
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "preferredPaymentMethod" && (value !== "zelle" && value !== "paypal")) {
            setEditFormData(prev => ({
                ...prev,
                paymentMethodId: ''
            }));
        }

        if (type === 'checkbox') {
            setEditFormData(prev => ({
                ...prev,
                [name]: checked
            }));

            if (name === 'useSameAddress' && checked) {
                setEditFormData(prev => ({
                    ...prev,
                    shippingAddress: { ...prev.billingAddress }
                }));
            }
        } else if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setEditFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setEditFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        try {
            const token = authUtils.getToken()
            const updateData = {
                ...userData,
                ...editFormData,
            };

            // console.log('Update Data:', updateData);
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/vite/update/dealer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUserData((prevData) => ({
                    ...prevData,
                    ...updatedUser?.data,
                }));
                toastSuccess('Profile updated successfully!');
            } else {
                const errorData = await response.json();
                toastError(errorData?.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update error:', error);
            toastError('Failed to update profile. Please try again.', 'error');
        } finally {
            handleEditClose();
            setIsSubmitting(false);
        }
    };

    const renderEditDialog = () => {
        const getDialogTitle = () => {
            switch (editingSection) {
                case 'contact':
                    return 'Edit Contact Information';
                case 'account':
                    return 'Edit Account Details';
                case 'billing':
                    return 'Edit Billing Address';
                case 'shipping':
                    return 'Edit Shipping Address';
                default:
                    return 'Edit Profile';
            }
        };

        return (
            <Dialog
                open={editDialogOpen}
                onClose={handleEditClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>{getDialogTitle()}</DialogTitle>
                <DialogContent>
                    {editingSection === 'contact' && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="firstName"
                                    label="First Name"
                                    value={editFormData.firstName || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="lastName"
                                    label="Last Name"
                                    value={editFormData.lastName || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="phone"
                                    label="Phone"
                                    value={editFormData.phone || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={editFormData.email || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="primaryContactEmail"
                                    label="Primary Contact Email"
                                    type="email"
                                    value={editFormData.primaryContactEmail || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    helperText="Optional"
                                />
                            </Grid>
                        </Grid>
                    )}

                    {editingSection === 'account' && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Preferred Payment Method</InputLabel>
                                    <Select
                                        name="preferredPaymentMethod"
                                        value={editFormData.preferredPaymentMethod || ''}
                                        onChange={handleInputChange}
                                        label="Preferred Payment Method"
                                    >
                                        <MenuItem value="zelle">Zelle</MenuItem>
                                        <MenuItem value="paypal">Paypal</MenuItem>
                                        <MenuItem value="credit_card">Credit Card (Online Invoice)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {(editFormData.preferredPaymentMethod === "zelle" || editFormData.preferredPaymentMethod === "paypal") && (
                                <Grid item xs={12}>
                                    <TextField
                                        name="paymentMethodId"
                                        label={editFormData.preferredPaymentMethod === "paypal" ? "PayPal ID" : "Zelle ID"}
                                        value={editFormData.paymentMethodId || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid>
                            )}
                        </Grid>
                    )}

                    {editingSection === 'billing' && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    name="billingAddress.street"
                                    label="Street Address"
                                    value={editFormData.billingAddress?.street || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="billingAddress.city"
                                    label="City"
                                    value={editFormData.billingAddress?.city || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="billingAddress.state"
                                    label="State"
                                    value={editFormData.billingAddress?.state || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="billingAddress.zipCode"
                                    label="Zip Code"
                                    value={editFormData.billingAddress?.zipCode || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="billingAddress.country"
                                    label="Country"
                                    value={editFormData.billingAddress?.country || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="useSameAddress"
                                            checked={editFormData.useSameAddress || false}
                                            onChange={handleInputChange}
                                        />
                                    }
                                    label="Use same address for shipping"
                                />
                            </Grid>
                        </Grid>
                    )}

                    {editingSection === 'shipping' && !editFormData.useSameAddress && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    name="shippingAddress.street"
                                    label="Street Address"
                                    value={editFormData.shippingAddress?.street || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="shippingAddress.city"
                                    label="City"
                                    value={editFormData.shippingAddress?.city || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="shippingAddress.state"
                                    label="State"
                                    value={editFormData.shippingAddress?.state || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="shippingAddress.zipCode"
                                    label="Zip Code"
                                    value={editFormData.shippingAddress?.zipCode || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="shippingAddress.country"
                                    label="Country"
                                    value={editFormData.shippingAddress?.country || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button
                        onClick={handleSaveChanges}
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <ProfileHeader>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'white',
                            color: 'primary.main',
                            fontSize: '2rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {shopName ? shopName.charAt(0).toUpperCase() : `${firstName?.charAt(0)}${lastName?.charAt(0)}`}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {shopName || `${firstName} ${lastName}`}
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            {firstName} {lastName}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                            <StatusChip
                                icon={<CheckCircle />}
                                label={termsAccepted ? "Terms Accepted" : "Terms Pending"}
                                color={termsAccepted ? "success" : "error"}
                                size="small"
                            />
                            <Chip
                                icon={<Business />}
                                label="Business Account"
                                variant="outlined"
                                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                                size="small"
                            />
                        </Stack>
                    </Box>
                </Box>
            </ProfileHeader>

            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Account Information
            </Typography>

            <Grid container spacing={3}>
                {/* Contact Information Card */}
                <Grid item xs={12} md={6}>
                    <InfoCard>
                        <CardContent sx={{ p: 3, position: 'relative' }}>
                            <EditButton
                                size="small"
                                onClick={() => handleEditClick('contact', {
                                    firstName,
                                    lastName,
                                    phone,
                                    email,
                                    primaryContactEmail
                                })}
                            >
                                <Edit fontSize="small" />
                            </EditButton>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconWrapper>
                                    <Person />
                                </IconWrapper>
                                Contact Information
                            </Typography>
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Email sx={{ mr: 2, color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {email}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Phone
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {phone || 'Not provided'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </CardContent>
                    </InfoCard>
                </Grid>

                {/* Account Details Card */}
                <Grid item xs={12} md={6}>
                    <InfoCard>
                        <CardContent sx={{ p: 3, position: 'relative' }}>
                            <EditButton
                                size="small"
                                onClick={() => handleEditClick('account', {
                                    preferredPaymentMethod,
                                    paymentMethodId: userData.paymentMethodId
                                })}
                            >
                                <Edit fontSize="small" />
                            </EditButton>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconWrapper>
                                    <Payment />
                                </IconWrapper>
                                Account Details
                            </Typography>
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Preferred Payment Method
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {preferredPaymentMethod || 'Not set'}
                                    </Typography>
                                    {userData.paymentMethodId && (
                                        <Typography variant="body2" color="text.secondary">
                                            {preferredPaymentMethod === 'paypal' ? 'PayPal' : 'Zelle'} ID: {userData.paymentMethodId}
                                        </Typography>
                                    )}
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Member Since
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {formatDate(createdAt)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {formatDate(updatedAt)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </InfoCard>
                </Grid>

                {/* Billing Address Card */}
                <Grid item xs={12} md={6}>
                    <InfoCard>
                        <CardContent sx={{ p: 3, position: 'relative' }}>
                            <EditButton
                                size="small"
                                onClick={() => handleEditClick('billing', {
                                    billingAddress,
                                    useSameAddress
                                })}
                            >
                                <Edit fontSize="small" />
                            </EditButton>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconWrapper>
                                    <LocationOn />
                                </IconWrapper>
                                Billing Address
                            </Typography>
                            {billingAddress ? (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {billingAddress.street}
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" gutterBottom>
                                        {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" gutterBottom>
                                        {billingAddress.country}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                                    No billing address provided
                                </Typography>
                            )}
                        </CardContent>
                    </InfoCard>
                </Grid>

                {/* Shipping Address Card */}
                <Grid item xs={12} md={6}>
                    <InfoCard>
                        <CardContent sx={{ p: 3, position: 'relative' }}>
                            {!useSameAddress && <EditButton
                                size="small"
                                onClick={() => handleEditClick('shipping', {
                                    shippingAddress,
                                    useSameAddress
                                })}
                            >
                                <Edit fontSize="small" />
                            </EditButton>}
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconWrapper>
                                    <LocalShipping />
                                </IconWrapper>
                                Shipping Address
                                {useSameAddress && (
                                    <Chip
                                        label="Same as billing"
                                        size="small"
                                        sx={{ ml: 2 }}
                                        color="primary"
                                        variant="outlined"
                                    />
                                )}
                            </Typography>
                            {shippingAddress ? (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {shippingAddress.street}
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" gutterBottom>
                                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" gutterBottom>
                                        {shippingAddress.country}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                                    No shipping address provided
                                </Typography>
                            )}
                        </CardContent>
                    </InfoCard>
                </Grid>
            </Grid>

            {renderEditDialog()}
        </Box>
    );
}