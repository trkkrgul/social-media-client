import { Avatar, Flex, Text, VStack } from "@chakra-ui/react";

const ListUser = ({ user }) => {
  const handleUserClick = () => {};

  return (
    <Flex
      key={user._id}
      align="center"
      w="full"
      _hover={{
        background: "gray.100",
      }}
      padding={3}
      cursor={"pointer"}
    >
      <Avatar src={user.profilePicturePath} w={"10"} h={"10"} />
      <VStack align="start" spacing={0} ml={3}>
        <Text fontWeight="bold">{user.username}</Text>
        <Text color="gray.500">@{user.username}</Text>
      </VStack>
    </Flex>
  );
};

export default ListUser;
