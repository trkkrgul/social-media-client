import { AspectRatio, Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import { CardBody } from "@saas-ui/react";
import { Image } from "antd";
import React from "react";
import { RxEnterFullScreen } from "react-icons/rx";

const PostBody = ({ post }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <CardBody minH={"100px"}>
      <Text fontSize="lg" wordBreak={"break-word"} whiteSpace={"pre-wrap"}>
        {post.content}
      </Text>
      {post.media.length !== 0 && (
        <Flex
          alignItems={"center"}
          flexWrap={"wrap"}
          bg={colorMode === "dark" ? "blackAlpha.100" : "whiteAlpha.100"}
          overflow={"hidden"}
          my={2}
          borderRadius={"xl"}
          border="1px"
          borderColor={
            colorMode === "light" ? "blackAlpha.100" : "whiteAlpha.100"
          }
        >
          <Image.PreviewGroup>
            {post.media
              .filter((media) => media.type === "image")
              .map((media, i) => (
                <Image
                  onError={(e) => (e.target.src = media.url)}
                  preview={{
                    mask: (
                      <Box textAlign={"center"}>
                        <RxEnterFullScreen size={64} /> <Text>Preview</Text>
                      </Box>
                    ),
                  }}
                  key={media._id}
                  src={media.url}
                  style={{
                    objectFit: "cover",
                    aspectRatio: `${post.media.length < 3 ? 1 : 2} / 1`,
                  }}
                  width={
                    post.media.length === 1
                      ? "100%"
                      : post.media.length === 2
                      ? "50%"
                      : post.media.length === 3
                      ? i > 0
                        ? "50%"
                        : "100%"
                      : "50%"
                  }
                />
              ))}
          </Image.PreviewGroup>
        </Flex>
      )}
    </CardBody>
  );
};

export default PostBody;
