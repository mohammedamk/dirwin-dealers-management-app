import React from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import {
  Assignment as OrdersIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const Dashboard = () => {

  const stats = [
    {
      title: 'Total Orders',
      value: '0',
      icon: <OrdersIcon sx={{ fontSize: 35, color: 'primary.main' }} />,
      color: 'primary',
    },
    {
      title: 'Pending Orders',
      value: '0',
      icon: <PendingIcon sx={{ fontSize: 35, color: 'warning.main' }} />,
      color: 'warning',
    },
    {
      title: 'Completed Orders',
      value: '0',
      icon: <CompletedIcon sx={{ fontSize: 35, color: 'success.main' }} />,
      color: 'success',
    },
    {
      title: 'Total Revenue',
      value: '$0',
      icon: <RevenueIcon sx={{ fontSize: 35, color: 'info.main' }} />,
      color: 'info',
    },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: '$1,250', status: 'Completed' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: '$800', status: 'Pending' },
    { id: 'ORD-003', customer: 'Bob Johnson', amount: '$450', status: 'In Progress' },
    { id: 'ORD-004', customer: 'Alice Brown', amount: '$1,200', status: 'Completed' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom >
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome to your dashboard! Here you can find a summary of your orders and revenue.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: (theme) => theme.shadows[8],
                }
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: (theme) => alpha(theme.palette[stat.color].main, 0.12),
                      mr: 2
                    }}
                  >
                    {React.cloneElement(stat.icon, {
                      sx: { fontSize: 28 }
                    })}
                  </Box>
                  <Typography
                    variant="h6"
                    className="card-content"
                    sx={{
                      fontWeight: 500,
                      color: 'text.secondary'
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  className="card-content"
                  sx={{
                    mt: 'auto',
                    fontWeight: 700,
                    textAlign: 'right',
                    color: `${stat.color}.main`
                  }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <Box>
              {recentOrders.map((order, index) => (
                <Box
                  key={order.id}
                  sx={{
                    p: 2,
                    borderBottom: index < recentOrders.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">{order.id}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {order.customer}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1">{order.amount}</Typography>
                    <Typography
                      variant="body2"
                      color={
                        order.status === 'Completed' ? 'success.main' :
                          order.status === 'Pending' ? 'warning.main' : 'info.main'
                      }
                    >
                      {order.status}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid> */}
    </Box>
  );
};

export default Dashboard;