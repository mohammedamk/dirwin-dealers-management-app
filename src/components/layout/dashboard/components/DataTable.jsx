// components/DataTable.jsx
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';

function createData(id, name, email, role, status) {
  return { id, name, email, role, status };
}

const rows = [
  createData(1, 'John Doe', 'john@example.com', 'Admin', 'Active'),
  createData(2, 'Jane Smith', 'jane@example.com', 'User', 'Active'),
  createData(3, 'Bob Johnson', 'bob@example.com', 'Editor', 'Inactive'),
  createData(4, 'Alice Brown', 'alice@example.com', 'User', 'Active'),
  createData(5, 'Charlie Wilson', 'charlie@example.com', 'Viewer', 'Inactive'),
];

export default function DataTable() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Assembly orders
      </Typography>
      {/* <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </Box>
  );
}