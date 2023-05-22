import LoginStepper from "@/components/auth/LoginStepper";
import PostWidget from "@/components/post/PostWidget";
import UserHeader from "@/components/profile/UserHeader";
import { setSessionEnd } from "@/state/slices/auth";
import { setProfilePosts } from "@/state/slices/post";
import PageLayout from "@/views/Layout";
import { Box, Text } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Virtuoso } from "react-virtuoso";
const UserProfile = () => {
  const { walletAddress } = useRouter()?.query;
  const profilePosts = useSelector((state) => state.post.profilePosts);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [count, setCount] = useState(5);
  const loadMore = useCallback(() => {
    return setTimeout(() => {
      setCount((prev) => prev + 2);
    }, 1000);
  }, [setCount]);

  useEffect(() => {
    if (walletAddress) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}api/user/wallet/${walletAddress}`
        )
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
          setUser(null);
        });

      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}api/post/wallet/${walletAddress}`
        )
        .then((res) => dispatch(setProfilePosts(res.data)))
        .catch((err) => {
          console.log(err);
          dispatch(setProfilePosts([]));
        });
    }
  }, [walletAddress]);

  return (
    <>
      <Head>
        <title>{user?.username + " | "}DeFiTalks</title>
      </Head>

      <PageLayout title={user?.username}>
        {!!user && user.username && (
          <>
            <UserHeader user={user} setUser={setUser} />

            {!!user && profilePosts.length > 0 ? (
              <Virtuoso
                className="gradient-feed"
                useWindowScroll
                data={profilePosts.slice(0, count)}
                endReached={loadMore}
                overscan={200}
                components={<div>asdas</div>}
                itemContent={(index, post) => {
                  return (
                    <PostWidget
                      key={post._id}
                      post={post}
                      setState={setProfilePosts}
                      postState={profilePosts}
                    />
                  );
                }}
              />
            ) : (
              <Box>
                <Text textAlign={"center"}>You dont have any posts yet.</Text>
              </Box>
            )}
          </>
        )}
      </PageLayout>
    </>
  );
};

export default UserProfile;
