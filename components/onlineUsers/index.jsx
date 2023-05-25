import { setOnlineUsers } from "@/state/slices/users";
import { Box, Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { Card, CardBody, CardHeader, Divider } from "@saas-ui/react";
import axios from "axios";
import Link from "next/link";
import React, { useEffect } from "react";
import { MdVerified } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const OnlineUsers = () => {
  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}api/user/onlineUsers`)
      .then((res) => {
        dispatch(setOnlineUsers(res.data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(setOnlineUsers([]));
      });
  }, []);

  return (
    <Card py={2} w={"100%"} bg={"transparent"}>
      <CardHeader py={2}>
        <Text fontSize={"lg"} fontWeight={"bold"}>
          Online Users
        </Text>
      </CardHeader>
      <CardBody height={"200px"} overflowY={"auto"}>
        <Flex gap={4} flexDir={"column"} align={"left"} p={2}>
          {onlineUsers.map((user) => (
            <Link href={`/profile/${user?.walletAddress}`}>
              <HStack key={user.id} spacing={0}>
                <img
                  src={user.profilePicturePath || "/icons/user-placeholder.png"}
                  width={"36"}
                  height={"36"}
                  style={{
                    height: "36px",
                    width: "36px",
                    borderRadius: "36px",
                    objectFit: "cover",
                  }}
                />
                <VStack maxW={"200px"} px={2}>
                  <HStack spacing={"1"} justify={"flex-start"} w={"100%"}>
                    <Text
                      lineHeight={"1"}
                      overflow={"hidden"}
                      textOverflow={"ellipsis"}
                      whiteSpace={"nowrap"}
                    >
                      @{user?.username}
                    </Text>
                    {user?.isVerified && (
                      <Icon as={MdVerified} color={"primary.400"} />
                    )}
                  </HStack>

                  <Text
                    opacity={"0.5"}
                    lineHeight={"1"}
                    overflow={"hidden"}
                    textOverflow={"ellipsis"}
                    whiteSpace={"nowrap"}
                    w={"100%"}
                    fontSize={"xs"}
                  >
                    {user?.walletAddress}
                  </Text>
                </VStack>
              </HStack>
            </Link>
          ))}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default OnlineUsers;
