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
  IconButton,
  Skeleton,
  Button,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { toastError, toastSuccess } from '../../global/NotificationToast';

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
  handleOpenConfirmModal,
  isLoading
}) {

  const handleInvoiceViewAndDownload = async (type, orderId) => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;

    const url = `${baseUrl}/vite/invoice/generate/${orderId}`;

    if (type === "view") {
      window.open(url, "_blank");
    } else if (type === "download") {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `invoice_${orderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("Error downloading invoice:", error);
      }
    }
  };

  return (
    <Paper sx={{ width: '100%', overflowX: 'auto' }}>
      <TableContainer sx={{ minWidth: 900 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Products</TableCell>
              <TableCell align="center">First name</TableCell>
              <TableCell align="center">Last name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">State</TableCell>
              <TableCell align="center">City</TableCell>
              <TableCell align="center">Assembly Fee</TableCell>
              <TableCell align="center">Created at</TableCell>
              <TableCell align="center">Invoice</TableCell>
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
                      lineItems,
                      firstName,
                      lastName,
                      email,
                      phone,
                      state,
                      city,
                      assemblyFee,
                      createdAt,
                      assignment
                    }) => {
                      const products = lineItems.map(item => item.title).join(', ');
                      return (
                        <TableRow key={orderId} hover>
                          <TableCell>#{orderNumber}</TableCell>
                          <TableCell component="th" scope="row" align="center">
                            {products || "N/A"}
                          </TableCell>
                          <TableCell align="center">{firstName || "N/A"}</TableCell>
                          <TableCell align="center">{lastName || "N/A"}</TableCell>
                          <TableCell align="center">{email || "N/A"}</TableCell>
                          <TableCell align="center">{phone || "N/A"}</TableCell>
                          <TableCell align="center">{state || "N/A"}</TableCell>
                          <TableCell align="center">{city || "N/A"}</TableCell>
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
                              {(assignment === "PENDING" || !assignment) ? "--" : <>
                                <IconButton size="small" color="primary" onClick={() => { handleInvoiceViewAndDownload("view", orderId) }}>
                                  <ViewIcon />
                                </IconButton>
                                <IconButton size="small" color="primary" onClick={() => { handleInvoiceViewAndDownload("download", orderId) }}>
                                  <DownloadIcon />
                                </IconButton>
                              </>}
                            </Box>
                          </TableCell>

                          <TableCell align="center">
                            {(assignment === "PENDING" || !assignment) ? <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleOpenConfirmModal("APPROVED", orderId)}
                              >
                                Accept
                              </Button>

                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleOpenConfirmModal("REJECTED", orderId)}
                              >
                                Reject
                              </Button>
                            </Box> : "--"}
                          </TableCell>
                        </TableRow>
                      )
                    }
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
        rowsPerPageOptions={[5, 10, 25]}
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
      {Array.from({ length: 10 }).map((d, i) => {
        return (
          <TableCell key={i + 1}>
            <Skeleton animation="wave" variant="text" />
          </TableCell>
        )
      })}
    </TableRow>
  ));
};