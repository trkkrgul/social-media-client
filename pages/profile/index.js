import LoginStepper from "@/components/auth/LoginStepper";
import PostWidget from "@/components/post/PostWidget";
import UserHeader from "@/components/profile/UserHeader";
import { setUser } from "@/state/slices/auth";
import { setProfilePosts } from "@/state/slices/post";

import PageLayout from "@/views/Layout";
import { Box, Text } from "@chakra-ui/react";
import { NavItem } from "@saas-ui/sidebar";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Virtuoso } from "react-virtuoso";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const profilePosts = useSelector((state) => state.post.profilePosts);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [count, setCount] = useState(5);
  const loadMore = useCallback(() => {
    return setTimeout(() => {
      setCount((prev) => prev + 2);
    }, 1000);
  }, [setCount]);

  useEffect(() => {
    if (user?.isProfileCreated) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}api/user/wallet/${user?.walletAddress}`
        )
        .then((res) => {
          dispatch(setUser(res.data));
        })
        .catch((err) => {
          console.log(err);
          dispatch(setUser(null));
        });
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}api/post/wallet/${user?.walletAddress}`
        )
        .then((res) => dispatch(setProfilePosts(res.data)))
        .catch((err) => {
          console.log(err);
          dispatch(setProfilePosts([]));
        });
    }
  }, [user?.walletAddress]);

  if (!user || !user.isProfileCreated)
    return (
      <PageLayout title={"Login"}>
        <LoginStepper />
      </PageLayout>
    );

  return (
    <>
      <Head>
        <title>Profile | DeFiTalks</title>
      </Head>
      <PageLayout title={"Your Profile"}>
        <UserHeader user={user} />

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
      </PageLayout>
    </>
  );
};

export default Profile;
