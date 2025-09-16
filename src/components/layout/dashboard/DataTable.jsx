import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Skeleton,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

const getStatusColor = (status) => {
  switch (status) {
    case 'paid': return 'success';
    case 'in-progress': return 'warning';
    case 'pending': return 'error';
    default: return 'default';
  }
};

export default function DataTable({
  orders,
  pagination,
  handleChangePage,
  handleChangeRowsPerPage,
  isLoading
}) {
  return (
    <Paper sx={{ width: '100%', overflowX: 'auto' }}>
      <TableContainer sx={{ minWidth: 900 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell align="center">First name</TableCell>
              <TableCell align="center">Last name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">State</TableCell>
              <TableCell align="center">City</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Financial status</TableCell>
              <TableCell align="center">Assembly Fee</TableCell>
              <TableCell align="center">Created at</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? <TableRowsLoader rowsNum={pagination.itemsPerPage} />
              :
              <>
                {orders?.length > 0 ? (
                  orders.map(
                    ({
                      orderId,
                      orderNumber,
                      firstName,
                      lastName,
                      email,
                      phone,
                      state,
                      city,
                      totalPrice,
                      currency,
                      fulfillmentStatus,
                      assemblyFee,
                      financialStatus,
                      createdAt,
                    }) => (
                      <TableRow key={orderId} hover>
                        <TableCell>#{orderNumber}</TableCell>
                        <TableCell align="center">{firstName || "N/A"}</TableCell>
                        <TableCell align="center">{lastName || "N/A"}</TableCell>
                        <TableCell align="center">{email || "N/A"}</TableCell>
                        <TableCell align="center">{phone || "N/A"}</TableCell>
                        <TableCell align="center">{state || "N/A"}</TableCell>
                        <TableCell align="center">{city || "N/A"}</TableCell>
                        <TableCell align="center">
                          {totalPrice
                            ? `${Number(totalPrice).toFixed(2)} ${currency}`
                            : "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={financialStatus}
                            color={getStatusColor(financialStatus)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {assemblyFee
                            ? `${Number(assemblyFee).toFixed(2)}`
                            : "N/A"}
                        </TableCell>
                        <TableCell align="right">
                          {new Date(createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <IconButton size="small" color="primary">
                              <ViewIcon />
                            </IconButton>
                            <IconButton size="small" color="info">
                              <DownloadIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </>}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[1, 2, 5, 10, 25]}
        component="div"
        count={pagination.totalItems || 0}
        rowsPerPage={pagination.itemsPerPage}
        page={pagination.currentPage - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}


const TableRowsLoader = ({ rowsNum }) => {
  return [...Array(rowsNum)].map((row, index) => (
    <TableRow key={index}>
      <TableCell component="th" scope="row">
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      {Array.from({ length: 10 }).map(() => {
        return (
          <TableCell>
            <Skeleton animation="wave" variant="text" />
          </TableCell>
        )
      })}
    </TableRow>
  ));
};