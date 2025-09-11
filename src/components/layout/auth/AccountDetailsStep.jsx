import { Lock, Visibility, VisibilityOff } from '@mui/icons-material'
import { Zoom,
    Box,
    Typography,
    TextField,
    Grid,
    InputAdornment,
    IconButton,
 } from '@mui/material'

export default function AccountDetailsStep({
    formData,
    getError,
    handleInputChange,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword
}) {
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
    )
}
