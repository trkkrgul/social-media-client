import CreateProfileModal from "@/components/modals/createProfile";
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
import { useRouter } from "next/router";
import React from "react";
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const CreateProfile = () => {
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

  if (!user) {
    router.push("/");
    return;
  }
  return (
    <>
      <CreateProfileModal />
    </>
  );
};

export default CreateProfile;
