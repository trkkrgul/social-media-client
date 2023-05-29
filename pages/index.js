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
  useMediaQuery,
} from "@chakra-ui/react";
import SessionEnd from "@/components/toasts/SessionEnd";
import dynamic from "next/dynamic";
import { useState, useCallback, useEffect, useRef } from "react";

import { Virtuoso } from "react-virtuoso";
import { setSessionEnd } from "@/state/slices/auth";
import StoryLine from "@/components/story";
import StoryWrapper from "@/components/story/StoryWrapper";

const PageLayout = dynamic(() => import("@/views/Layout"), {
  ssr: false,
});
const MyPostWidget = dynamic(() => import("@/components/post/MyPostWidget"), {
  ssr: false,
});
const PostWidget = dynamic(() => import("@/components/post/PostWidget"), {
  ssr: false,
});

export default function Home() {
  const scrollRef = useRef(null);
  const feed = useSelector((state) => state.post.feed);
  const token = useSelector((state) => state.auth.token);
  const [count, setCount] = useState(5);
  const [largerThan1000] = useMediaQuery("(min-width: 1000px)", {
    ssr: false,
    fallback: true,
  });
  const [tab, setTab] = useState("feed");
  const user = useSelector((state) => state.auth.user);
  const followingPosts = useSelector((state) => state.post.followingPosts);
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
        dispatch(setFeedPosts([]));
      });
    {
      !!token &&
        !!user &&
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
          .catch((err) => {
            console.log(err);
            dispatch(setFollowingPosts([]));
          });
    }
  }, [tab]);
  useEffect(() => {
    const timeout = loadMore();
    return () => clearTimeout(timeout);
  }, []);

  const { colorMode } = useColorMode();

  return (
    <>
      <Head>
        <title>Defi Talks</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout title={"Homepage"}>
        <StoryLine />
        <StoryWrapper />
        <MyPostWidget />
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
        {feed && tab === "feed" && (
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
                  setState={setFeedPosts}
                  postState={feed}
                />
              );
            }}
          />
        )}
        {followingPosts && tab === "followings" && (
          <Virtuoso
            className="gradient-feed"
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
                  setState={setFollowingPosts}
                  postState={followingPosts}
                />
              );
            }}
          />
        )}
      </PageLayout>
    </>
  );
}
