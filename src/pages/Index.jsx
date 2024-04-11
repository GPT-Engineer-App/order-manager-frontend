import { useState } from "react";
import { Box, Heading, Input, Button, FormControl, FormLabel, VStack, Table, Thead, Tbody, Tr, Th, Td, useToast } from "@chakra-ui/react";
import { FaSignInAlt, FaPlus } from "react-icons/fa";

const API_URL = "https://backengine-mft9.fly.dev";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [items, setItems] = useState([]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [orders, setOrders] = useState([]);
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Login Failed",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { productName, quantity, price }]);
    setProductName("");
    setQuantity(0);
    setPrice(0);
  };

  const handleCreateOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ customerName, customerEmail, items }),
      });

      if (response.ok) {
        setOrders([...orders, { customerName, customerEmail, items }]);
        setCustomerName("");
        setCustomerEmail("");
        setItems([]);
        toast({
          title: "Order Created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Order Creation Failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Create order error:", error);
    }
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Order Management System
      </Heading>

      {!isLoggedIn ? (
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button leftIcon={<FaSignInAlt />} colorScheme="blue" onClick={handleLogin}>
            Login
          </Button>
        </VStack>
      ) : (
        <>
          <VStack spacing={4} align="stretch" mb={8}>
            <FormControl>
              <FormLabel>Customer Name</FormLabel>
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Customer Email</FormLabel>
              <Input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
            </FormControl>
          </VStack>

          <Heading as="h2" size="lg" mb={4}>
            Items
          </Heading>
          <VStack spacing={4} align="stretch" mb={8}>
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Quantity</FormLabel>
              <Input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
            </FormControl>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
            </FormControl>
            <Button leftIcon={<FaPlus />} onClick={handleAddItem}>
              Add Item
            </Button>
          </VStack>

          <Button colorScheme="blue" onClick={handleCreateOrder} mb={8}>
            Create Order
          </Button>

          <Heading as="h2" size="lg" mb={4}>
            Orders
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Customer Name</Th>
                <Th>Customer Email</Th>
                <Th>Items</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order, index) => (
                <Tr key={index}>
                  <Td>{order.customerName}</Td>
                  <Td>{order.customerEmail}</Td>
                  <Td>
                    {order.items.map((item, itemIndex) => (
                      <Box key={itemIndex}>
                        {item.productName} - Qty: {item.quantity}, Price: ${item.price.toFixed(2)}
                      </Box>
                    ))}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}
    </Box>
  );
};

export default Index;
