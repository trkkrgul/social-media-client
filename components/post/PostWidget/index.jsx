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
  HStack,
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
  Field,
  Form,
  FormLayout,
  InputField,
  MenuItem,
  Persona,
  SubmitButton,
} from "@saas-ui/react";
import React, { useEffect, useState } from "react";
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
import PostBody from "./PostBody";
const PostWidget = ({
  post,
  handleLike,
  handleDislike,
  handleRemove,
  handleComment,
  handleReply,
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const posts = useSelector((state) => state.post.feed);
  const [isCommentShown, toggleCommentShown] = useBoolean(false);
  const user = useSelector((state) => state.auth.user);
  const [isRepliesShown, toggleRepliesShown] = useBoolean(false);
  const [likeCount, setLikeCount] = useState(post.likers.length);
  const [dislikeCount, setDislikeCount] = useState(post.dislikers.length);
  const [isLiked, setLiked] = useState(
    post.likers.filter((e) => e.user?._id === user?._id).length !== 0
  );
  const [isDisliked, setDisliked] = useState(
    post.dislikers.filter((e) => e.user?._id === user?._id).length !== 0
  );
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });
  useEffect(() => {
    setLiked(post.likers.filter((e) => e.user._id === user?._id).length !== 0);
    setDisliked(
      post.dislikers.filter((e) => e.user._id === user?._id).length !== 0
    );
    setLikeCount(post.likers.length);
    setDislikeCount(post.dislikers.length);
  }, [post]);
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
      <PostHeader post={post} handleRemove={handleRemove} />
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
          {!!token && !!post.likers && !!post.dislikers && (
            <Flex alignItems={"center"}>
              {post.likers.length !== 0 && <Badge title={post.likers.length} />}
              <FaHeart
                onClick={
                  !isLiked
                    ? () => {
                        if (isDisliked) {
                          setDisliked(false);
                          setDislikeCount(dislikeCount - 1);
                        }
                        setLiked(true);
                        setLikeCount(likeCount + 1);
                        handleLike(post._id);
                      }
                    : () => {
                        setLiked(false);
                        setLikeCount(likeCount - 1);
                        handleLike(post._id);
                      }
                }
                size={"24px"}
                color={isLiked ? "#ff4444cc" : "#55aaaa50"}
              />
              <Text mx={1}>{likeCount}</Text>
              <Divider orientation="vertical" height={"10px"} mx={3} />
              <BsFillHandThumbsDownFill
                onClick={
                  !isDisliked
                    ? () => {
                        if (isLiked) {
                          setLiked(false);
                          setLikeCount(likeCount - 1);
                        }
                        setDisliked(true);
                        setDislikeCount(dislikeCount + 1);
                        handleDislike(post._id);
                      }
                    : () => {
                        setDisliked(false);
                        setDislikeCount(dislikeCount - 1);
                        handleDislike(post._id);
                      }
                }
                size={"24px"}
                color={isDisliked ? "#ff4444cc" : "#55aaaa50"}
              />
              <Text mx={1}>{dislikeCount}</Text>
              <Divider orientation="vertical" height={"10px"} mx={3} />
              <FaComment
                onClick={toggleCommentShown.toggle}
                size={"24px"}
                color={
                  post.comments.filter((e) => e.user._id === user._id)
                    .length !== 0
                    ? "#ff4444cc"
                    : "#55aaaa50"
                }
              />
              <Text mx={1}>{post.comments.length}</Text>

              <Spacer />
            </Flex>
          )}
          <Text as="ins" fontSize={"xs"} color={"gray.500"}>
            {moment(post.createdAt).fromNow()}
          </Text>
        </Flex>
      </CardFooter>
      <Divider />

      <Collapse in={isCommentShown} animateOpacity>
        <Flex flexDirection={"column"}>
          {!!token && (
            <Flex>
              <Form
                width={"100%"}
                onSubmit={(values, e) => {
                  try {
                    handleComment(post._id, values);
                    e.target.reset();
                  } catch (err) {
                    console.warn(err);
                  }
                }}
              >
                <HStack justifyContent={"space-between"} w={"100%"} p={2}>
                  <HStack>
                    <Image
                      flexGrow={1}
                      onError={(e) =>
                        (e.target.src = "/icons/user-placeholder.png")
                      }
                      width={24}
                      height={24}
                      style={{
                        width: "24px",
                        height: "24px",
                        minWidth: "24px",
                        minHeight: "24px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      src={`${user.profilePicturePath}`}
                      alt={`${user.username}'s profile picture`}
                    />
                    <Text>{`@${user.username}`}</Text>
                  </HStack>

                  <HStack w={"100%"}>
                    <FormLayout column={1} w={"100%"}>
                      <Field isRequired name="content" type="text" />
                    </FormLayout>
                    <SubmitButton disableIfInvalid color={"black"}>
                      Comment
                    </SubmitButton>
                  </HStack>
                </HStack>
              </Form>
            </Flex>
          )}
          {post.comments.map((comment) => (
            <CommentLayout
              post={post}
              key={comment._id}
              user={user}
              token={token}
              comment={comment}
              handleReply={handleReply}
            />
          ))}
        </Flex>
      </Collapse>
    </Card>
  );
};

export default PostWidget;

const RepliesLayout = ({ reply }) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      key={reply._id}
      flexGrow={1}
      flexBasis={"100%"}
      borderLeft={"1px"}
      my={1}
      ms={3}
      borderColor={colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.200"}
    >
      <Flex
        ms={2}
        me={1}
        flexBasis={"100%"}
        alignItems={"center"}
        flexWrap={"wrap"}
        bg={colorMode === "dark" ? "blackAlpha.200" : "blackAlpha.100"}
        overflow={"hidden"}
        borderRadius={"lg"}
        border="1px"
        borderColor={colorMode === "dark" ? "whiteAlpha.100" : "blackAlpha.300"}
      >
        <Flex
          m={2}
          alignItems={"center"}
          width={"100%"}
          justifyContent={"space-between"}
        >
          <HStack>
            <Image
              flexGrow={1}
              onError={(e) => (e.target.src = "/icons/user-placeholder.png")}
              width={24}
              height={24}
              style={{
                width: "24px",
                height: "24px",
                minWidth: "24px",
                minHeight: "24px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
              alt="profile picture"
              src={`${reply.user.profilePicturePath}`}
            />
            <Text>{`@${reply.user.username}`}</Text>
          </HStack>

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
            fontSize={"lg"}
            fontWeight={"400"}
            whiteSpace={"pre-wrap"}
            linebreak={"anywhere"}
            color={colorMode === "dark" ? "whiteAlpha.700" : "blackAlpha.700"}
          >
            {reply.content}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

const CommentLayout = ({ comment, handleReply, user, token, post }) => {
  const { colorMode } = useColorMode();
  const [isRepliesShown, toggleRepliesShown] = useBoolean(false);
  return (
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
          bg={colorMode === "dark" ? "blackAlpha.50" : "whiteAlpha.200"}
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
            <HStack>
              <Image
                flexGrow={1}
                me="1"
                onError={(e) => (e.target.src = "/icons/user-placeholder.png")}
                width={24}
                height={24}
                style={{
                  width: "24px",
                  height: "24px",
                  minWidth: "24px",
                  minHeight: "24px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
                src={`${comment.user.profilePicturePath}`}
                alt="profile picture"
              />
              <Text>{`@${comment.user.username}`}</Text>
            </HStack>

            <Spacer />

            <Text as="ins" fontSize={"xs"} color={"gray.500"}>
              {moment(comment.createdAt).fromNow()}
            </Text>
            {!!comment.replies.length > 0 && (
              <Button ms={2} onClick={toggleRepliesShown.toggle}>
                View {comment.replies.length} replies
              </Button>
            )}
          </Flex>
          <Divider />
          <Flex
            m={2}
            alignItems={"center"}
            width={"100%"}
            justifyContent={"space-between"}
          >
            <Text
              fontSize={"lg"}
              fontWeight={"400"}
              whiteSpace={"pre-wrap"}
              linebreak={"anywhere"}
              color={colorMode === "dark" ? "whiteAlpha.700" : "blackAlpha.700"}
            >
              {comment.content}
            </Text>
          </Flex>
          {!!token && (
            <Flex w={"100%"}>
              <Form
                width={"100%"}
                onSubmit={(values, e) => {
                  try {
                    handleReply(post._id, {
                      ...values,
                      parentComment: comment._id,
                    });
                    toggleRepliesShown.on();
                    e.target.reset();
                  } catch (err) {
                    console.warn(err);
                  }
                }}
              >
                <HStack justifyContent={"space-between"} w={"100%"} p={2}>
                  <HStack>
                    <Image
                      flexGrow={1}
                      onError={(e) =>
                        (e.target.src = "/icons/user-placeholder.png")
                      }
                      width={24}
                      height={24}
                      style={{
                        width: "24px",
                        height: "24px",
                        minWidth: "24px",
                        minHeight: "24px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      src={`${user.profilePicturePath}`}
                      alt="profile picture"
                    />
                    <Text>{`@${user.username}`}</Text>
                  </HStack>

                  <HStack w={"100%"}>
                    <FormLayout column={1} w={"100%"}>
                      <Field isRequired name="content" type="text" />
                    </FormLayout>
                    <SubmitButton disableIfInvalid color={"black"}>
                      Reply
                    </SubmitButton>
                  </HStack>
                </HStack>
              </Form>
            </Flex>
          )}
        </Flex>
        <Collapse in={isRepliesShown} animateOpacity style={{ flexGrow: "1" }}>
          {comment.replies.map((reply) => (
            <RepliesLayout reply={reply} key={reply._id} />
          ))}
        </Collapse>
      </Flex>
      <Divider my={1} />
    </>
  );
};
