import { LocationOn, LocalShipping } from '@mui/icons-material'
import {
    Zoom,
    Box,
    Typography,
    TextField,
    Grid,
    FormControlLabel,
    Checkbox,
    Fade
} from '@mui/material'

export default function BillingDetailsStep({
    formData,
    getError,
    handleInputChange
}) {
    return (
        <Zoom in={true}>
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Billing Details</Typography>
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
    )
}
