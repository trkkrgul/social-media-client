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
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsBookmarkCheck } from "react-icons/bs";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoCopyOutline, IoShareOutline } from "react-icons/io5";
import { MdReport } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const PostHeader = ({ post, handleRemove }) => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  return (
    <CardHeader bg={colorMode === "dark" ? "blackAlpha.100" : "blackAlpha.50"}>
      <Flex alignItems={"center"} width={"100%"}>
        <Flex
          alignItems={"center"}
          width={"100%"}
          onClick={() => {
            router.push(`/profile/${post.user?.walletAddress}`);
          }}
          cursor={"pointer"}
        >
          <Persona
            me="1"
            src={post.user?.profilePicturePath}
            name={`@${post.user?.username}`}
            fontWeight={"bold"}
            size={"xs"}
          />
          <Flex alignItems={"center"}>
            <Web3Address address={post.user.walletAddress} />
            <IconButton
              size={"sm"}
              onClick={() => {
                navigator.clipboard.writeText(post.user.walletAddress);
              }}
              cursor={"pointer"}
              variant={"ghost"}
              as={IoCopyOutline}
              p={1}
            />{" "}
          </Flex>
        </Flex>
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
            {user && user._id === post.user._id && (
              <MenuItem
                icon={<AiOutlineDelete size={16} />}
                bgColor={"#ff4444cc"}
                _hover={{ bgColor: "#ff3333cc" }}
                onClick={handleRemove}
              >
                Remove
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </Flex>
    </CardHeader>
  );
};

export default PostHeader;
