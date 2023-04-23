import ImageGallery from "@/components/images/ImageGallery";
import { AspectRatio, Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import { CardBody } from "@saas-ui/react";
import Image from "next/image";
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
        <>
          <ImageGallery images={post.media.map((media) => media.url)} />
        </>
      )}
    </CardBody>
  );
};

export default PostBody;
