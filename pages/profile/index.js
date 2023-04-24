import LoginStepper from "@/components/auth/LoginStepper";
import PostWidget from "@/components/post/PostWidget";
import UserHeader from "@/components/profile/UserHeader";
import { addProfilePosts } from "@/state/slices/post";
import PageLayout from "@/views/Layout";
import { Box, Text } from "@chakra-ui/react";
import { NavItem } from "@saas-ui/sidebar";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const feed = useSelector((state) => state.post.feed);
  const profilePosts = useSelector((state) => state.post.profilePosts);
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);
  useEffect(() => {
    const init = async () => {
      await axios
        .get(`https://api.defitalks.io/api/post/wallet/${user.walletAddress}`)
        .then((res) => {
          setUserPosts(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    init();
  }, []);
  if (!user || !user.isProfileCreated) return <LoginStepper />;

  return (
    <>
      <PageLayout title={"Your Profile"}>
        <UserHeader user={user} />

        {userPosts.length > 0 ? (
          userPosts.map((post) => <PostWidget post={post} />)
        ) : (
          <Box>
            <Text>No posts yet</Text>
          </Box>
        )}
      </PageLayout>
    </>
  );
};

export default Profile;
