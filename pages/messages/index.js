import PageLayout from "@/views/Layout";
import { Avatar, Box, Button, Flex, Input, SimpleGrid, Stack, Text, VStack, useColorMode } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { BsSend } from "react-icons/bs";
import { useSelector } from "react-redux";

const Sender = () => {
  return <Flex align="center" w='full'>
    <Avatar src="https://example.com/avatar1.png" mr={3} />
    <Box bg="gray.200" p={2} rounded="lg" maxW={"250"}>
      <Text wordBreak={'break-word'}>Hello!</Text>
    </Box>
  </Flex>;
};

const Receiver = () => {
  return <Flex align="center" justifyContent="flex-end" w='full'>
    <Box bg="blue.500" p={2} rounded="lg" maxW={"250"}>
      <Text color="white">Hi there!</Text>
    </Box>
    <Avatar src="https://example.com/avatar2.png" ml={3} />
  </Flex>;
};

const MessagesPage = () => {
  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const { colorMode } = useColorMode();

  const handleSendMessage = () => {
    // Logic to handle sending the message
    console.log("Sending message:", message);
    setMessage("");
  };

  const getUsers = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}api/user/usersTop10`)
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Head>
        <title>Messages | DeFiTalks</title>
      </Head>
      <PageLayout title={"Messages"}>
        <Flex maxH={'calc(100vh - 90px)'}>
          <Box flex={0.4} overflow={'scroll'}>
            <VStack align="start" spacing={4}>
              {users.map((user) => (
                <Flex
                  key={user._id}
                  align="center"
                  w="full"
                  _hover={{
                    background: "gray.100",
                  }}
                  padding={3}
                >
                  <Avatar src={user.profilePicturePath} w={'10'} h={'10'} />
                  <VStack align="start" spacing={0} ml={3}>
                    <Text fontWeight="bold">{user.username}</Text>
                    <Text color="gray.500">@{user.username}</Text>
                  </VStack>
                </Flex>
              ))}
            </VStack>
          </Box>
          <Flex
            direction={"column"}
            px="3"
            pt='3'
            flex={0.6}
            borderLeft={"1px solid"}
            borderLeftColor={colorMode === "dark" ? "whiteAlpha.300" : "gray.200"}
          >
            <VStack align="start" spacing={4} flex={1}>
              {/* Placeholder for chat messages */}
              <Sender />
              <Receiver />
            </VStack>
            <Flex mt={4} align="center">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Start a new message"
                size="lg"
                variant="filled"
                focusBorderColor="blue.400"
                rounded="xl"
                bg="gray.100"
                _hover={{ bg: "gray.200" }}
                _focus={{ bg: "gray.200" }}
                _placeholder={{ color: "gray.500" }}
                _selection={{ bg: "blue.100" }}
                paddingInlineStart={"10"}
                mr="3"
              />
              <Button
                colorScheme="blue"
                px={6}
                py={2}
                rounded="xl"
                onClick={handleSendMessage}
                disabled={message.trim().length === 0}
                height={"full"}
              >
                <BsSend />
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <button style={{ color: "white" }} onClick={getUsers}>
          Get users
        </button>
      </PageLayout>
    </>
  );
};

export default MessagesPage;
