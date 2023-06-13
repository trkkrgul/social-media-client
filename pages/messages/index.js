import PageLayout from "@/views/Layout";
import { Box, Flex, SimpleGrid, Stack } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import React from "react";
import { useSelector } from "react-redux";

const MessagesPage = () => {
  const token = useSelector((state) => state.auth.token);

  const getUsers = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}api/user/usersTop10`)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>Messages | DeFiTalks</title>
      </Head>
      <PageLayout title={"Messages"}>
        <button style={{ color: "white" }} onClick={getUsers}>
          Get users
        </button>
        <Flex>
          <Box flex={0.4} backgroundColor={'blue'} height=''>
            Chat List
          </Box>
          <Box flex={0.6} backgroundColor={'green'} height='100vh'>
            Messages
          </Box>
        </Flex>
      </PageLayout>
    </>
  );
};

export default MessagesPage;
