import {
  AspectRatio,
  Avatar,
  AvatarGroup,
  Box,
  Collapse,
  Divider,
  Fade,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Spacer,
  Text,
  useBoolean,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardMedia,
  MenuItem,
  Persona,
} from "@saas-ui/react";
import React, { useState } from "react";
import {
  FaAddressBook,
  FaComment,
  FaCopy,
  FaDiscourse,
  FaEdit,
  FaExternalLinkAlt,
  FaEye,
  FaHeart,
  FaRemoveFormat,
  FaTwitter,
} from "react-icons/fa";
import {
  BsBookmarkCheck,
  BsFillHandThumbsDownFill,
  BsRepeat,
} from "react-icons/bs";
import { MdBugReport, MdOutlineDeleteOutline, MdReport } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";
import { Badge, Image } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setFeedPosts } from "@/state/slices/post";
import { Web3Address } from "@saas-ui/web3";
import { IoRemove, IoShareOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import moment from "moment";
import PostHeader from "./PostHeader";
import PostBody from "./PostBody.jsx";
const PostWidget = ({ post }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.feed);
  const handleLike = async () => {
    try {
      await axios
        .post("http://localhost:5001/api/like/like", {
          postId: post._id,
          userId: "642963ee836af5c9205395f4",
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(
              setFeedPosts(
                posts.map((post) => {
                  if (post._id === res.data[0]._id) {
                    return res.data[0];
                  } else {
                    return post;
                  }
                })
              )
            );
          }
        });
    } catch (err) {
      console.warn(err);
    }
  };
  const handleDislike = async () => {
    try {
      await axios
        .post("http://localhost:5001/api/like/dislike", {
          postId: post._id,
          userId: "642963ee836af5c9205395f4",
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(
              setFeedPosts(
                posts.map((post) => {
                  if (post._id === res.data[0]._id) {
                    return res.data[0];
                  } else {
                    return post;
                  }
                })
              )
            );
          }
        });
    } catch (err) {
      console.warn(err);
    }
  };
  const [isCommentShown, toggleCommentShown] = useBoolean(false);

  const [isRepliesShown, toggleRepliesShown] = useBoolean(false);
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });
  return (
    <Card
      borderRadius={isLargerThan800 ? "lg" : "none"}
      marginY={isLargerThan800 ? "2" : "0"}
      shadow={
        isLargerThan800 ? (colorMode === "dark" ? "dark-lg" : "lg") : "none"
      }
      borderColor={colorMode === "dark" ? "whiteAlpha.50" : "blackAlpha.200"}
      width="100%"
      variant={"outline"}
      overflow={"hidden"}
    >
      <PostHeader post={post} />
      <Divider />
      <PostBody post={post} />
      <Divider />
      <CardFooter
        bg={colorMode === "dark" ? "blackAlpha.100" : "blackAlpha.50"}
      >
        <Flex
          alignItems={"center"}
          flexBasis={"100%"}
          justifyContent={"space-between"}
        >
          <Flex alignItems={"center"}>
            {post.likers.length !== 0 && <Badge title={post.likers.length} />}
            <FaHeart
              onClick={handleLike}
              size={"24px"}
              color={post.likers.length !== 0 ? "#ff4444cc" : "#55aaaa50"}
            />
            <Text mx={1}>{post.likers.length}</Text>
            <Divider orientation="vertical" height={"10px"} mx={3} />
            <BsFillHandThumbsDownFill
              onClick={handleDislike}
              size={"24px"}
              color={post.dislikers.length !== 0 ? "#ff4444cc" : "#55aaaa50"}
            />
            <Text mx={1}>{post.dislikers.length}</Text>
            <Divider orientation="vertical" height={"10px"} mx={3} />
            <FaComment
              onClick={toggleCommentShown.toggle}
              size={"24px"}
              color={"#55aaaa50"}
            />
            <Text mx={1}>{post.comments.length}</Text>

            <Spacer />
          </Flex>
          <Text as="ins" fontSize={"xs"} color={"gray.500"}>
            {moment(post.createdAt).fromNow()}
          </Text>
        </Flex>
      </CardFooter>
      <Divider />

      <Collapse in={isCommentShown} animateOpacity>
        <Flex flexDirection={"column"}>
          {post.comments.map((comment) => (
            <>
              <Flex
                key={comment._id}
                flexBasis={"100%"}
                alignItems={"center"}
                flexWrap={"wrap"}
                overflow={"hidden"}
                my={1}
              >
                <Flex
                  ms={2}
                  me={1}
                  flexBasis={"100%"}
                  alignItems={"center"}
                  flexWrap={"wrap"}
                  bg={
                    colorMode === "dark" ? "whiteAlpha.100" : "blackAlpha.200"
                  }
                  overflow={"hidden"}
                  borderRadius={"lg"}
                  border="1px"
                  borderColor={
                    colorMode === "dark" ? "whiteAlpha.100" : "blackAlpha.300"
                  }
                >
                  <Flex
                    m={2}
                    alignItems={"center"}
                    width={"100%"}
                    justifyContent={"space-between"}
                  >
                    <Persona
                      flexGrow={1}
                      me="1"
                      src="https://sakaivault.io/512.png"
                      name={`@${comment.user.username}`}
                      size={"xs"}
                    />

                    <Spacer />

                    <Text as="ins" fontSize={"xs"} color={"gray.500"}>
                      {moment(comment.createdAt).fromNow()}
                    </Text>
                    <Button ms={2} onClick={toggleRepliesShown.toggle}>
                      View {comment.replies.length} replies
                    </Button>
                  </Flex>
                  <Divider />
                  <Flex
                    m={2}
                    alignItems={"center"}
                    width={"100%"}
                    justifyContent={"space-between"}
                  >
                    <Text
                      fontSize={"sm"}
                      whiteSpace={"pre-wrap"}
                      linebreak={"anywhere"}
                      color={
                        colorMode === "dark"
                          ? "whiteAlpha.700"
                          : "blackAlpha.700"
                      }
                    >
                      {comment.content}
                    </Text>
                  </Flex>
                </Flex>
                <Collapse
                  in={isRepliesShown}
                  animateOpacity
                  style={{ flexGrow: "1" }}
                >
                  {comment.replies.map((reply) => (
                    <Flex
                      key={reply._id}
                      flexGrow={1}
                      flexBasis={"100%"}
                      borderLeft={"1px"}
                      my={1}
                      ms={3}
                      borderColor={
                        colorMode === "light"
                          ? "blackAlpha.300"
                          : "whiteAlpha.200"
                      }
                    >
                      <Flex
                        ms={2}
                        me={1}
                        flexBasis={"100%"}
                        alignItems={"center"}
                        flexWrap={"wrap"}
                        bg={
                          colorMode === "dark"
                            ? "blackAlpha.200"
                            : "blackAlpha.100"
                        }
                        overflow={"hidden"}
                        borderRadius={"lg"}
                        border="1px"
                        borderColor={
                          colorMode === "dark"
                            ? "whiteAlpha.100"
                            : "blackAlpha.300"
                        }
                      >
                        <Flex
                          m={2}
                          alignItems={"center"}
                          width={"100%"}
                          justifyContent={"space-between"}
                        >
                          <Persona
                            flexGrow={1}
                            me="1"
                            src="https://sakaivault.io/512.png"
                            name={`@${reply.user.username}`}
                            size={"xs"}
                          />

                          <Spacer />

                          <Text as="ins" fontSize={"xs"} color={"gray.500"}>
                            {moment(reply.createdAt).fromNow()}
                          </Text>
                        </Flex>
                        <Divider />
                        <Flex
                          m={2}
                          alignItems={"center"}
                          width={"100%"}
                          justifyContent={"space-between"}
                        >
                          <Text
                            fontSize={"sm"}
                            whiteSpace={"pre-wrap"}
                            linebreak={"anywhere"}
                            color={
                              colorMode === "dark"
                                ? "whiteAlpha.700"
                                : "blackAlpha.700"
                            }
                          >
                            {reply.content}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  ))}
                </Collapse>
              </Flex>
              <Divider my={1} />
            </>
          ))}
        </Flex>
      </Collapse>
    </Card>
  );
};

export default PostWidget;
