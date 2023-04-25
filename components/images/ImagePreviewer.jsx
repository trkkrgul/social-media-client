import { Box, Flex, useColorMode } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

const ImagePreviewer = ({ image, isOpen, setOpen }) => {
  const { colorMode } = useColorMode();
  if (!isOpen) return null;
  return (
    <Flex
      zIndex={"overlay"}
      position={"fixed"}
      left={"0"}
      top={"0px"}
      width={"100%"}
      height={"100%"}
      justify={"center"}
      align={"center"}
      onClick={() => setOpen(false)}
      bg={colorMode === "dark" ? "blackAlpha.800" : "whiteAlpha.800"}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        w={"100%"}
        maxW={"600px"}
        borderRadius={"lg"}
        shadow={"lg"}
        bg={colorMode === "dark" ? "gray.800" : "white"}
      >
        <Image
          src={image}
          width={700}
          height={700}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </Box>
    </Flex>
  );
};

export default ImagePreviewer;
