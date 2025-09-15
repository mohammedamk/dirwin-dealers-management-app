import { Assignment } from '@mui/icons-material'
import {
    Zoom,
    Box,
    Typography,
    Paper,
    Divider,
    FormControlLabel,
    Checkbox,
    Button
} from '@mui/material'

export default function ReviewDetailsStep({
    formData,
    getError,
    handleInputChange
}) {
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
                    <Typography>Contact Name: {formData.firstName} {formData.lastName}</Typography>
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
                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{ textTransform: 'none' }}
                                    target='_blank'
                                    href={`${import.meta.env.VITE_SERVER_URL}/external-site/dirwin_bike_assembly_service_dealer_terms_of_service.pdf`}>
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
    )
}
