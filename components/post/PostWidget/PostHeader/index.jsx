import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
import { CardHeader, MenuItem, Persona } from "@saas-ui/react";
import { Web3Address } from "@saas-ui/web3";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsBookmarkCheck } from "react-icons/bs";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoShareOutline } from "react-icons/io5";
import { MdReport } from "react-icons/md";

const PostHeader = ({ post }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <CardHeader bg={colorMode === "dark" ? "blackAlpha.100" : "blackAlpha.50"}>
      <Flex alignItems={"center"} width={"100%"}>
        <Persona
          me="1"
          src="https://sakaivault.io/512.png"
          name={`@${post.user.username}`}
          fontWeight={"bold"}
          size={"xs"}
        />

        <Web3Address
          color={colorMode === "dark" ? "whiteAlpha.600" : "blackAlpha.600"}
          address={post.user.walletAddress}
        />
        <Spacer />
        <Menu orientation="horizontal">
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HiMenuAlt3 />}
            variant="outline"
          />
          <MenuList>
            <MenuItem
              _hover={{ bgColor: "blackAlpha.300" }}
              icon={<IoShareOutline size={16} />}
            >
              Share Post
            </MenuItem>
            <MenuItem
              _hover={{ bgColor: "blackAlpha.300" }}
              icon={<BsBookmarkCheck size={16} />}
            >
              Add to Bookmarks
            </MenuItem>
            <Divider my={1} />
            <MenuItem
              _hover={{ bgColor: "blackAlpha.300" }}
              icon={<MdReport size={16} />}
            >
              Report
            </MenuItem>
            <MenuItem
              icon={<AiOutlineDelete size={16} />}
              bgColor={"#ff4444cc"}
              _hover={{ bgColor: "#ff3333cc" }}
            >
              Remove
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </CardHeader>
  );
};

export default PostHeader;
