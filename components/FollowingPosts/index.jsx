import React from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setFeedPosts, setFollowingPosts } from "@/state/slices/post";
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

const PostWidget = dynamic(() => import("@/components/post/PostWidget"), {
  ssr: false,
});
const FollowingPosts = () => {
  const followingPosts = useSelector((state) => state.post.followingPosts);
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.post.feed);
  const token = useSelector((state) => state.auth.token);
  const [count, setCount] = useState(5);
  const [tab, setTab] = useState("feed");
  const user = useSelector((state) => state.auth.user);
  const loadMore = useCallback(() => {
    return setTimeout(() => {
      setCount((prev) => prev + 2);
    }, 1000);
  }, [setCount]);

  useEffect(() => {
    if (user && token && user.followings.length > 0) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}api/post/followingPosts`,
          {
            followings: user.followings,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => dispatch(setFollowingPosts(res.data)))
        .catch((err) => dispatch(setSessionEnd(true)));
    } else {
      console.log("No user");

      dispatch(setFollowingPosts([]));
    }
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
          dispatch(
            setFollowingPosts(
              followingPosts.filter((post) => post._id !== postId)
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
            setFollowingPosts(
              followingPosts.map((post) => {
                if (post._id === postId) {
                  return res.data;
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
            setFollowingPosts(
              followingPosts.map((post) => {
                if (post._id === postId) {
                  return res.data;
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
            console.log("Post disliked");
            dispatch(
              setFollowingPosts(
                followingPosts.map((post) => {
                  if (post._id === postId) {
                    return res.data;
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
    } catch (err) {
      console.warn(err);
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
            dispatch(
              setFollowingPosts(
                followingPosts.map((post) => {
                  if (post._id === postId) {
                    return res.data;
                  }
                  return post;
                })
              )
            );
          }
        });
    } catch (err) {
      dispatch(setSessionEnd(true));
    }
  };

  return (
    !!followingPosts && (
      <Virtuoso
        useWindowScroll
        data={followingPosts.slice(0, count)}
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
    )
  );
};

export default FollowingPosts;
