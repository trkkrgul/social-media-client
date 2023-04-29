import LoginStepper from "@/components/auth/LoginStepper";
import PostWidget from "@/components/post/PostWidget";
import UserHeader from "@/components/profile/UserHeader";
import { setSessionEnd } from "@/state/slices/auth";
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
  const token = useSelector((state) => state.auth.token);
  const [userPosts, setUserPosts] = useState([]);
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
  if (!user || !user.isProfileCreated)
    return (
      <PageLayout title={"Login"}>
        <LoginStepper />
      </PageLayout>
    );

  return (
    <>
      <PageLayout title={"Your Profile"}>
        <UserHeader user={user} />

        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <PostWidget
              post={post}
              key={post?._id}
              handleComment={handleComment}
              handleReply={handleReply}
              handleLike={handleLike}
              handleDislike={handleDislike}
              handleRemove={handleRemove}
            />
          ))
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
