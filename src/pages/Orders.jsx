import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    TextField,
} from '@mui/material';
import DataTable from '../components/layout/dashboard/DataTable';
import { useUser } from '../context/UserContext';
import { authUtils } from '../utils/authUtils';

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
                isLoading={isLoading}
            />
        </Box>
    );
}
