import EditProfileModal from "@/components/modals/editProfile";
import PageLayout from "@/views/Layout";
import {
  Box,
  HStack,
  Heading,
  IconButton,
  Input,
  MenuItemOption,
  Text,
  Textarea,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { TextareaField } from "@saas-ui/forms";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Property,
  PropertyList,
  Select,
} from "@saas-ui/react";
import { Image } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const EditProfile = () => {
  const profilePhotoRef = React.useRef(null);
  const usernameRef = React.useRef(null);
  const user = useSelector((state) => state.auth.user);
  const isProfileCreated = useSelector(
    (state) => state.auth.user?.isProfileCreated
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");
  const { colorMode } = useColorMode();
  console.log('user',user)
  if (!user) {
    router.push("/");
    return;
  }
  return (
    <>
    <Head>
        <title>Profile | DeFiTalks</title>
      </Head>
      <PageLayout title={"Your Profile"}>
        <EditProfileModal user={user} />
      </PageLayout>
    
    </>
  );
};

export default EditProfile;
