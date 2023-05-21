import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setFeedPosts } from "@/state/slices/post";
import { Button } from "@saas-ui/react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  Flex,
  HStack,
  Spacer,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import SessionEnd from "@/components/toasts/SessionEnd";
import dynamic from "next/dynamic";
import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  Suspense,
} from "react";

import { Virtuoso } from "react-virtuoso";
import { setSessionEnd } from "@/state/slices/auth";

const PageLayout = dynamic(() => import("@/views/Layout"), {
  ssr: false,
});
const MyPostWidget = dynamic(() => import("@/components/post/MyPostWidget"), {
  ssr: false,
});
const PostWidget = dynamic(() => import("@/components/post/PostWidget"), {
  ssr: false,
});
const FollowingPosts = dynamic(() => import("@/components/FollowingPosts"), {
  ssr: false,
});

export default function Home() {
  const feed = useSelector((state) => state.post.feed);
  const token = useSelector((state) => state.auth.token);
  const [count, setCount] = useState(5);
  const [tab, setTab] = useState("feed");
  const user = useSelector((state) => state.auth.user);
  const [followingsPosts, setFollowingsPosts] = useState([]);
  const loadMore = useCallback(() => {
    return setTimeout(() => {
      setCount((prev) => prev + 2);
    }, 1000);
  }, [setCount]);
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}api/post/feed`)
      .then((res) => dispatch(setFeedPosts(res.data)))
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    const timeout = loadMore();
    return () => clearTimeout(timeout);
  }, []);

  const handleRemove = async (postId) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}api/post/delete`,
        {
          postId: postId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log("Post deleted");
          dispatch(setFeedPosts(feed.filter((post) => post._id !== postId)));
        } else {
          console.log("Error");
        }
      })
      .catch((err) => {
        dispatch(setSessionEnd(true));
      });
  };
  const handleLike = async (postId) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}api/like/like`,
        {
          postId: postId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log("Post liked");
          dispatch(
            setFeedPosts(
              feed.map((post) => {
                if (post._id === postId) {
                  return {
                    ...post,
                    likers: res.data.likers,
                    dislikers: res.data.dislikers,
                  };
                }
                return post;
              })
            )
          );
        } else {
          console.log("Error");
        }
      })
      .catch((err) => {
        dispatch(setSessionEnd(true));
      });
  };
  const handleDislike = async (postId) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}api/like/dislike`,
        { postId: postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log("Post disliked");
          dispatch(
            setFeedPosts(
              feed.map((post) => {
                if (post._id === postId) {
                  return {
                    ...post,
                    likers: res.data.likers,
                    dislikers: res.data.dislikers,
                  };
                }
                return post;
              })
            )
          );
        } else {
          console.log("Error");
        }
      })
      .catch((err) => {
        dispatch(setSessionEnd(true));
      });
  };
  const handleComment = async (postId, values) => {
    try {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}api/comment/post`,
          {
            ...values,
            postId: postId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            dispatch(
              setFeedPosts(
                feed.map((post) => {
                  if (post._id === res.data._id) {
                    return { ...post, comments: res.data.comments };
                  } else {
                    return post;
                  }
                })
              )
            );
          }
        });
    } catch (err) {
      dispatch(setSessionEnd(true));
    }
  };
  const handleReply = async (postId, values) => {
    try {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}api/comment/comment`,
          {
            ...values,
            postId: postId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            dispatch(
              setFeedPosts(
                feed.map((post) => {
                  if (post._id === res.data._id) {
                    return { ...post, comments: res.data.comments };
                  } else {
                    return post;
                  }
                })
              )
            );
          }
        });
    } catch (err) {
      dispatch(setSessionEnd(true));
    }
  };
  const { colorMode } = useColorMode();

  return (
    <>
      <Head>
        <title>Defi Talks</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout title={"Homepage"}>
        <MyPostWidget />
        <Suspense fallback={<div>Loading...</div>}>
          <Flex
            width={"100%"}
            height={"36px"}
            alignItems={"center"}
            cursor={"pointer"}
            border={"1px solid"}
            borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
          >
            <Flex
              onClick={() => setTab("feed")}
              flexBasis={"50%"}
              justifyContent={"center"}
              alignItems={"center"}
              fontSize={"md"}
              fontWeight={"bold"}
              height={"100%"}
              bg={tab === "feed" ? "primary.500" : "transparent"}
              color={tab === "feed" ? "black" : null}
            >
              <Text>Recommended</Text>
            </Flex>
            <Flex
              height={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
              flexBasis={"50%"}
              onClick={() => setTab("followings")}
              fontSize={"md"}
              fontWeight={"bold"}
              bg={tab !== "feed" ? "primary.500" : "transparent"}
              color={tab !== "feed" ? "black" : null}
            >
              <Text>Followings</Text>
            </Flex>
          </Flex>
          {!!feed && tab === "feed" ? (
            <Virtuoso
              className="gradient-feed"
              useWindowScroll
              data={feed.slice(0, count)}
              endReached={loadMore}
              overscan={200}
              components={<div>asdas</div>}
              itemContent={(index, post) => {
                return (
                  <PostWidget
                    key={post._id}
                    post={post}
                    handleRemove={handleRemove}
                    handleLike={handleLike}
                    handleDislike={handleDislike}
                    handleComment={handleComment}
                    handleReply={handleReply}
                  />
                );
              }}
            />
          ) : (
            <FollowingPosts />
          )}

          {/* {feed &&
            feed.map((post) => (
              <PostWidget
                key={post._id}
                post={post}
                handleRemove={handleRemove}
                handleLike={handleLike}
                handleDislike={handleDislike}
                handleComment={handleComment}
                handleReply={handleReply}
              />
            ))} */}
        </Suspense>
      </PageLayout>
    </>
  );
}
