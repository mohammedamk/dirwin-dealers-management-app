import React, { useState } from 'react';
import {
    Box,
    Typography,
} from '@mui/material';
import DataTable from '../components/layout/dashboard/DataTable';

const testOrders = [
    {
        id: 'ORD-001',
        customer: 'John Doe',
        product: 'Office Chair',
        quantity: 5,
        status: 'completed',
        total: 1250.00,
        date: '2024-01-15',
    },
    {
        id: 'ORD-002',
        customer: 'Jane Smith',
        product: 'Desk Assembly',
        quantity: 2,
        status: 'pending',
        total: 800.00,
        date: '2024-01-16',
    },
    {
        id: 'ORD-003',
        customer: 'Bob Johnson',
        product: 'Bookshelf',
        quantity: 3,
        status: 'in-progress',
        total: 450.00,
        date: '2024-01-14',
    },
    {
        id: 'ORD-004',
        customer: 'Alice Brown',
        product: 'Wardrobe',
        quantity: 1,
        status: 'completed',
        total: 1200.00,
        date: '2024-01-13',
    },
    {
        id: 'ORD-005',
        customer: 'Charlie Wilson',
        product: 'Table Set',
        quantity: 4,
        status: 'pending',
        total: 1600.00,
        date: '2024-01-17',
    },
];



export default function Orders() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orders, setOrders] = useState(testOrders);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Orders
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    All assembly orders.
                </Typography>
            </Box>

            <DataTable
                orders={orders}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Box>
    );
}