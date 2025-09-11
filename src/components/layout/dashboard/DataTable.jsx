import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in-progress': return 'warning';
    case 'pending': return 'error';
    default: return 'default';
  }
};

export default function DataTable({
  orders, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage
}) {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Product</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell align="center">{order.quantity}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                  <TableCell align="center">{order.date}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton size="small" color="primary">
                        <ViewIcon />
                      </IconButton>
                      {/* <IconButton size="small" color="success">
                        <PrintIcon />
                      </IconButton> */}
                      <IconButton size="small" color="info">
                        <DownloadIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
