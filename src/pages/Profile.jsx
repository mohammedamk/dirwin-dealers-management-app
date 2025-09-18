import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Divider,
    Chip,
} from "@mui/material";
import LoadingScreen from "../components/global/LoadingScreen";
import styled from "@emotion/styled";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    // textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

export default function Profile() {
    const { userData } = useUser();

    // useEffect(() => {
    //     console.log("userData ", userData);
    // }, [userData]);

    if (!userData) {
        return (
            <LoadingScreen />
        );
    }

    const {
        shopName,
        email,
        phone,
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

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                Here is your account information
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
                <Typography variant="h6" gutterBottom>
                    Basic Information
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Item>
                            <Typography>
                                <strong>Shop Name:</strong> {shopName}
                            </Typography>
                            <Typography>
                                <strong>Owner:</strong> {firstName} {lastName}
                            </Typography>
                            <Typography>
                                <strong>Email:</strong> {email}
                            </Typography>
                            <Typography>
                                <strong>Phone:</strong> {phone}
                            </Typography>
                        </Item>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Item>
                            <Typography>
                                <strong>Preferred Payment:</strong> {preferredPaymentMethod}
                            </Typography>
                            <Typography>
                                <strong>Terms Accepted:</strong>{" "}
                                {termsAccepted ? "Yes ✅" : "No ❌"}
                            </Typography>
                            <Typography>
                                <strong>Created At:</strong>{" "}
                                {new Date(createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography>
                                <strong>Last Updated:</strong>{" "}
                                {new Date(updatedAt).toLocaleDateString()}
                            </Typography>
                        </Item>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
                <Typography variant="h6" gutterBottom>
                    Address Information
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Item>
                            <Typography variant="subtitle1" gutterBottom>
                                Billing Address
                            </Typography>
                            {billingAddress ? (
                                <Box>
                                    <Typography>{billingAddress.street}</Typography>
                                    <Typography>
                                        {billingAddress.city}, {billingAddress.state}{" "}
                                        {billingAddress.zipCode}
                                    </Typography>
                                    <Typography>{billingAddress.country}</Typography>
                                </Box>
                            ) : (
                                <Typography>No billing address available</Typography>
                            )}
                        </Item>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} >
                        <Item>
                            <Typography variant="subtitle1" gutterBottom>
                                Shipping Address{" "}
                                {useSameAddress && (
                                    <Chip
                                        label="Same as billing"
                                        size="small"
                                        sx={{ ml: 1 }}
                                        color="primary"
                                    />
                                )}
                            </Typography>
                            {shippingAddress ? (
                                <Box>
                                    <Typography>{shippingAddress.street}</Typography>
                                    <Typography>
                                        {shippingAddress.city}, {shippingAddress.state}{" "}
                                        {shippingAddress.zipCode}
                                    </Typography>
                                    <Typography>{shippingAddress.country}</Typography>
                                </Box>
                            ) : (
                                <Typography>No shipping address available</Typography>
                            )}
                        </Item>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
