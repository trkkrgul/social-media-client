import LoginStepper from "@/components/auth/LoginStepper";
import PostWidget from "@/components/post/PostWidget";
import UserHeader from "@/components/profile/UserHeader";
import PageLayout from "@/views/Sidebar";
import { Box, Text } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const UserProfile = ({ walletAddress, ssrPosts, ssrUser }) => {
  const router = useRouter();
  const [userPosts, setUserPosts] = useState(ssrPosts);
  const [user, setUser] = useState(ssrUser);
  console.log("user profile opened");
  useEffect(() => {
    const init = async () => {
      await axios
        .get(`https://api.defitalks.io/api/post/wallet/${walletAddress}`)
        .then((res) => {
          setUserPosts(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      await axios
        .get(`https://api.defitalks.io/api/user/wallet/${walletAddress}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    init();
  }, []);

  return (
    <>
      {!!user && !!user.username && (
        <PageLayout title={user.username}>
          <UserHeader user={user} setUser={setUser} />

          {userPosts.length > 0 ? (
            userPosts.map((post) => <PostWidget post={post} />)
          ) : (
            <Box>
              <Text>No posts yet</Text>
            </Box>
          )}
        </PageLayout>
      )}
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const walletAddress = params.walletAddress;

  const ssrUser = await axios
    .get(`https://api.defitalks.io/api/post/wallet/${walletAddress}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });

  const ssrPosts = await axios
    .get(`https://api.defitalks.io/api/post/wallet/${walletAddress}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
  // Fetch data for the wallet address from an API or database

  return {
    props: {
      walletAddress,
      ssrUser,
      ssrPosts,
    },
    revalidate: 60, // regenerate the page every 60 seconds
  };
}

export default UserProfile;
