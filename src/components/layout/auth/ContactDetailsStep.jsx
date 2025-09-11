import { Person } from '@mui/icons-material'
import {
    Zoom,
    Box,
    Typography,
    TextField,
    Grid,
} from '@mui/material'

export default function ContactDetailsStep({
    formData,
    getError,
    handleInputChange
}) {
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
    )
}
