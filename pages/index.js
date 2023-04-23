import Head from "next/head";
import { useEffect, useState } from "react";
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
import { Suspense } from "react";

const PageLayout = dynamic(() => import("@/views/Sidebar"), {
  ssr: false,
});
const MyPostWidget = dynamic(() => import("@/components/post/MyPostWidget"), {
  ssr: false,
});
const PostWidget = dynamic(() => import("@/components/post/PostWidget"), {
  ssr: false,
});

export default function Home({ feedPosts }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFeedPosts(feedPosts));
  }, []);

  const feed = useSelector((state) => state.post.feed);
  const token = useSelector((state) => state.auth.token);

  const handleRemove = async (postId) => {
    await axios
      .post(
        "https://api.defitalks.io/api/post/delete",
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
        console.log(err);
      });
  };
  const handleLike = async (postId) => {
    await axios
      .post(
        "https://api.defitalks.io/api/like/like",
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
        console.log(err);
      });
  };
  const handleDislike = async (postId) => {
    await axios
      .post(
        "https://api.defitalks.io/api/like/dislike",
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
        console.log(err);
      });
  };
  const handleComment = async (postId, values) => {
    try {
      await axios
        .post(
          "https://api.defitalks.io/api/comment/post",
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
            console.log(res.data);
            dispatch(
              setFeedPosts(
                feed.map((post) => {
                  if (post._id === res.data._id) {
                    return res.data;
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
  const handleReply = async (postId, values) => {
    try {
      await axios
        .post(
          "https://api.defitalks.io/api/comment/comment",
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
            console.log(res.data);
            dispatch(
              setFeedPosts(
                feed.map((post) => {
                  if (post._id === res.data._id) {
                    return res.data;
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
  return (
    <>
      <Head>
        <title>Defi Talks</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout title={"Homepage"}>
        <MyPostWidget />
        <Suspense fallback={<div>Loading...</div>}>
          {feed &&
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
            ))}
        </Suspense>
      </PageLayout>
    </>
  );
}

export async function getStaticProps() {
  const feedPosts = await axios
    .get("https://api.defitalks.io/api/post/feed")
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });

  // Fetch data for the wallet address from an API or database

  return {
    props: {
      feedPosts,
    },
    revalidate: 1,
  };
}
