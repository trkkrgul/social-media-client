import LoginStepper from "@/components/auth/LoginStepper";
import PostWidget from "@/components/post/PostWidget";
import UserHeader from "@/components/profile/UserHeader";
import { setSessionEnd } from "@/state/slices/auth";
import PageLayout from "@/views/Layout";
import { Box, Text } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const UserProfile = ({ walletAddress, ssrPosts, ssrUser }) => {
  const router = useRouter();
  const [userPosts, setUserPosts] = useState(null);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

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
          setUserPosts(userPosts.filter((post) => post._id !== postId));
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
          setUserPosts(
            userPosts.map((post) => {
              if (post._id === postId) {
                return res.data;
              }
              return post;
            })
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
          setUserPosts(
            userPosts.map((post) => {
              if (post._id === postId) {
                return res.data;
              }
              return post;
            })
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
            setUserPosts(
              userPosts.map((post) => {
                if (post._id === res.data._id) {
                  return res.data;
                } else {
                  return post;
                }
              })
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
            setUserPosts(
              userPosts.map((post) => {
                if (post._id === res.data._id) {
                  return res.data;
                } else {
                  return post;
                }
              })
            );
          }
        });
    } catch (err) {
      dispatch(setSessionEnd(true));
    }
  };

  useEffect(() => {
    setUserPosts(ssrPosts);
    setUser(ssrUser);
  }, [ssrPosts, ssrUser]);

  return (
    <>
      <Head>
        <title>{user?.username} | DeFiTalks</title>
      </Head>
      {!!user && user.username && (
        <PageLayout title={user.username}>
          <UserHeader user={user} setUser={setUser} />

          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostWidget
                handleComment={handleComment}
                handleReply={handleReply}
                handleLike={handleLike}
                handleDislike={handleDislike}
                handleRemove={handleRemove}
                post={post}
              />
            ))
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
    .get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}api/user/wallet/${walletAddress}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });

  const ssrPosts = await axios
    .get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}api/post/wallet/${walletAddress}`)
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
