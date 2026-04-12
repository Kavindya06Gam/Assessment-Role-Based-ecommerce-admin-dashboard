import React from "react";
import { Box, H2, H5, Text, Badge } from "@adminjs/design-system";
import { useCurrentAdmin } from "adminjs";

const Dashboard = (props) => {
  const data = props?.data || {};
  const [currentAdmin] = useCurrentAdmin();

  return (
    <Box variant="grey">
      <Box variant="white" marginBottom="xl" padding="xl">
        <H2>Welcome, {currentAdmin?.name}</H2>
        <Text>
          Role: <Badge variant="primary">{currentAdmin?.role}</Badge>
        </Text>
      </Box>

      {currentAdmin?.role === "admin" ? (
        <Box flex flexDirection="row" flexWrap="wrap">
          <Box
            variant="white"
            padding="lg"
            margin="md"
            flexGrow={1}
            textAlign="center"
          >
            <H5>Total Users</H5>
            <Text fontSize="h2">{data.totalUsers || 0}</Text>
          </Box>

          <Box
            variant="white"
            padding="lg"
            margin="md"
            flexGrow={1}
            textAlign="center"
          >
            <H5>Total Products</H5>
            <Text fontSize="h2">{data.totalProducts || 0}</Text>
          </Box>

          <Box
            variant="white"
            padding="lg"
            margin="md"
            flexGrow={1}
            textAlign="center"
          >
            <H5>Total Orders</H5>
            <Text fontSize="h2">{data.totalOrders || 0}</Text>
          </Box>
        </Box>
      ) : (
        <Box variant="white" padding="lg">
          <H5>My Activity</H5>
          <Text>Orders Placed: {data.myOrders || 0}</Text>
          <Text>Total Spent: ${Number(data.mySpent || 0).toFixed(2)}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
