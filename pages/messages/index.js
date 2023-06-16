import ListUser from "@/components/messages/ListUser";
import MessageList from "@/components/messages/MessageList";
import PageLayout from "@/views/Layout";
import { Box, Button, Flex, Input, VStack, useColorMode } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { BsSend } from "react-icons/bs";
import { useSelector } from "react-redux";

const MessagesPage = () => {
  const token = useSelector((state) => state.auth.token);
  const { colorMode } = useColorMode();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState();

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
        <Flex minH={"calc(100vh - 60px)"}>
          <Box flex={0.4} overflowY={"auto"} borderRight={"1px solid"} borderRightColor={colorMode === "dark" ? "whiteAlpha.300" : "gray.200"}>
            <VStack align="start" spacing={4}>
              {users.map((user) => (
                <ListUser user={user} />
              ))}
              <button style={{ color: "green" }} onClick={getUsers}>
                Get users
              </button>
            </VStack>
          </Box>
          <Flex direction={"column"} px={3} py={3} flex={0.6}>
              {/* Placeholder for chat messages */}
              <MessageList />
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
                <BsSend fontSize={24} />
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </PageLayout>
    </>
  );
};

export default MessagesPage;
