import { Avatar, Box, Flex, Text, VStack } from "@chakra-ui/react";

const Receiver = ({ img, message }) => {
  return (
    <Flex align="center" justifyContent="flex-end" w="full">
      <Box bg="blue.500" p={2} rounded="lg" maxW={"250"}>
        <Text wordBreak={"break-word"} color="white">
          {message}
        </Text>
      </Box>
      <Avatar src={img} ml={3} />
    </Flex>
  );
};

const Sender = ({ img, message }) => {
  return (
    <Flex align="center" w="full">
      <Avatar src={img} mr={3} />
      <Box bg="gray.200" p={2} rounded="lg" maxW={"250"}>
        <Text wordBreak={"break-word"}>{message}</Text>
      </Box>
    </Flex>
  );
};

const MessageList = () => {
  return (
    <VStack align="start" spacing={4} flex={1}>
      <Sender message={"Hello!"} img={"https://example.com/avatar1.png"} />
      <Receiver message={"Hi there!"} img={"https://example.com/avatar2.png"} />
    </VStack>
  );
};

export default MessageList;
