import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Link,
} from '@mui/material';
import DataTable from '../components/layout/dashboard/DataTable';
import { useUser } from '../context/UserContext';
import { authUtils } from '../utils/authUtils';
import ConfirmationModal from '../components/global/ConfirmationModal';
import { toastError, toastSuccess } from '../components/global/NotificationToast';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const { userData } = useUser();
    const [pagination, setPagination] = useState({
        hasPrevious: false,
        hasNext: true,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 5,
        totalItems: 0,
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        actionType: '',
        orderId: '',
        estAssemblyCompDate: null,
        editedEstCompDate: '',
    });

    const handleOpenConfirmModal = (actionType, orderId, estAssemblyCompDate) => {
        const editedDate = estAssemblyCompDate ? new Date(estAssemblyCompDate).toISOString().split('T')[0] : '';
        setConfirmModal({ open: true, actionType, orderId, estAssemblyCompDate, editedEstCompDate: editedDate });
    };

    const handleCloseConfirmModal = () => {
        setConfirmModal({ open: false, actionType: '', orderId: '', estAssemblyCompDate: null, editedEstCompDate: '' });
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/vite/get_assembly_orders`,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authUtils.getToken()}`,
                    },
                    body: JSON.stringify({
                        dealerId: userData._id,
                        pagination,
                        searchQuery,
                    }),
                }
            );

            if (response.status === 401) {
                authUtils.removeToken();
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setOrders(data.orderData || []);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error("error occurred on fetchOrders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [pagination.currentPage, pagination.itemsPerPage, searchQuery]);

    const handleChangePage = (_, newPage) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: newPage + 1,
        }));
    };

    const handleChangeRowsPerPage = (event) => {
        setPagination((prev) => ({
            ...prev,
            itemsPerPage: parseInt(event.target.value, 10),
            currentPage: 1,
        }));
    };

    const handleAssignment = async () => {
        const { actionType, orderId, editedEstCompDate } = confirmModal;
        try {
            handleCloseConfirmModal();
            const baseUrl = import.meta.env.VITE_SERVER_URL;
            const url = `${baseUrl}/vite/order/manage`;

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actionType, orderId, dealerId: userData._id, estAssemblyCompDate: editedEstCompDate || null }),
            });

            if (!response.ok) {
                throw new Error("Failed to process order action");
            }

            fetchOrders();
            toastSuccess(`Successfully ${actionType.toLowerCase()} order request.`);
        } catch (error) {
            console.log("error occured on handleAssignment", error);
            toastError('Error occurred while processing action');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Orders
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    All assembly orders.
                </Typography>
                <TextField
                    placeholder="Search orders..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPagination((prev) => ({ ...prev, currentPage: 1 }));
                    }}
                    sx={{ maxWidth: 300 }}
                />
            </Box>

            <DataTable
                orders={orders}
                pagination={pagination}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleOpenConfirmModal={handleOpenConfirmModal}
                isLoading={isLoading}
            />
            <ConfirmationModal
                title={
                    confirmModal.actionType === "APPROVED" ? "Confirm Acceptance" :
                    confirmModal.actionType === "UPDATE_DATE" ? "Update Completion Date" :
                    "Confirm Rejection"
                }
                isOpen={confirmModal.open}
                onClose={handleCloseConfirmModal}
                primaryText={
                    confirmModal.actionType === "APPROVED" ? "Accept" :
                    confirmModal.actionType === "UPDATE_DATE" ? "Update Date" :
                    "Reject"
                }
                isSuccessColor={confirmModal.actionType === "APPROVED"}
                secondaryText={"Cancel"}
                primaryAction={handleAssignment}
                secondaryAction={handleCloseConfirmModal}
                content={
                    confirmModal.actionType === "UPDATE_DATE" ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: '#fff8e1', border: '1px solid #ffe082', borderRadius: 1 }}>
                                <Typography variant="body2" color="warning.dark">
                                    ⚠️ Changing the completion date will notify the customer by email with the new date. Make sure this is correct before confirming.
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    New Completion Date
                                </Typography>
                                <TextField
                                    type="date"
                                    value={confirmModal.editedEstCompDate}
                                    onChange={(e) => setConfirmModal(prev => ({ ...prev, editedEstCompDate: e.target.value }))}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        </Box>
                    ) : confirmModal.actionType === "APPROVED" ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Typography variant="body1">
                                By clicking <strong>'Accept,'</strong> you confirm your agreement to assemble and fulfill this order at the stated assembly rate.
                                This acceptance creates a binding obligation under the{' '}
                                <Link
                                    href={`${import.meta.env.VITE_SERVER_URL}/uploads/external-site/dirwin_bike_assembly_service_dealer_terms_of_service.pdf`}
                                    target="_blank"
                                    rel="noopener"
                                    underline="hover"
                                >
                                    Terms of Service
                                </Link>
                            </Typography>
                            <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Estimated Completion Date
                                </Typography>
                                <TextField
                                    type="date"
                                    value={confirmModal.editedEstCompDate}
                                    onChange={(e) => {
                                        setConfirmModal(prev => ({
                                            ...prev,
                                            editedEstCompDate: e.target.value
                                        }));
                                    }}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Typography variant="body1">
                            Are you sure you want to reject this order?
                        </Typography>
                    )
                }
            />
        </Box>
    );
}
