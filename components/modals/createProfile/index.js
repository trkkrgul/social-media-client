import { setSessionEnd, setUser } from "@/state/slices/auth";
import {
  AspectRatio,
  Box,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  MenuItemOption,
  Text,
  Textarea,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  ArrayFieldRemoveButton,
  AutoForm,
  Field,
  Fields,
  Form,
  FormLayout,
  SubmitButton,
  TextareaField,
} from "@saas-ui/forms";
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
import axios from "axios";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@saas-ui/forms/yup";
import { Web3Address } from "@saas-ui/web3";
import { v4 } from "uuid";
import userPlaceholder from "@/assets/user-placeholder.png";
import coverPlaceholder from "@/assets/cover-placeholder.png";
const CreateProfileModal = () => {
  const [photos, setPhotos] = useState({
    coverPhoto: "",
    profilePhoto: "",
  });

  const profilePhotoRef = useRef();
  const coverPhotoRef = useRef();

  const token = useSelector((state) => state.auth.token);
  const walletAddress = useSelector((state) => state.auth.walletAddress);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");
  const { colorMode } = useColorMode();

  const schema = Yup.object().shape({
    username: Yup.string()
      .required()
      .label("Username")
      .test(
        "username",
        "Username is already taken",
        async function validateValue(value) {
          try {
            let testResult = true;
            await axios
              .post(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}api/auth/checkUsername`,
                {
                  username: value,
                }
              )
              .then((res) => {
                if (res.status === 200) {
                  testResult = res.data.message;
                  return res.data.message;
                } else {
                  return false;
                }
              });
            return testResult;
          } catch (e) {
            return false;
          }
        }
      )
      .min(3)
      .max(20)
      .matches(
        /^[a-z0-9]+$/,
        "Username can only contain lowercase letters and numbers"
      ),

    biography: Yup.string().label("Biography").min(0).max(50),
    telegramId: Yup.string()
      .label("Telegram Id")
      .min(0)
      .max(20)

      .test(
        "telegramId",
        "Telegram username need to start with @",
        function validateValue(value) {
          if (value && value[0] !== "@") {
            return false;
          }
          return true;
        }
      ),
    discordId: Yup.string().label("Discord Id").optional().min(0).max(20),
    twitterId: Yup.string()
      .label("Twitter")
      .max(20)
      .notRequired()
      .test(
        "twitterId",
        "Twitter username need to start with @",
        function validateValue(value) {
          if (value.length > 0 && value[0] !== "@") {
            return false;
          }
          return true;
        }
      ),
  });

  return (
    <>
      <Card
        margin={"0 auto"}
        borderRadius={isLargerThan800 ? "lg" : "none"}
        marginY={isLargerThan800 ? "2" : "0"}
        borderColor={colorMode === "dark" ? "whiteAlpha.50" : "blackAlpha.200"}
        width="100%"
        variant={"outline"}
        overflow={"hidden"}
      >
        <CardHeader
          bg={colorMode === "dark" ? "blackAlpha.100" : "blackAlpha.50"}
        >
          <Heading size="md">Create Profile</Heading>
        </CardHeader>

        <CardBody>
          <AspectRatio ratio={3 / 1} maxH={"200px"}>
            <Box
              margin={"auto"}
              bgRepeat={"no-repeat"}
              bgPos={"center center"}
              bgSize={"cover"}
              borderRadius={"md"}
              border={"1px solid"}
              bg={colorMode === "dark" ? "gray.800" : "gray.50"}
              borderColor={
                colorMode === "dark" ? "whiteAlpha.50" : "blackAlpha.200"
              }
            >
              <Image
                style={{
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                }}
                src={
                  !!photos.coverPhoto
                    ? URL.createObjectURL(photos.coverPhoto)
                    : coverPlaceholder.src
                }
                preview={false}
                alt="img"
              />
              <IconButton
                onClick={() => coverPhotoRef.current.click()}
                position={"absolute"}
                right={0}
                top={0}
                height={"2rem"}
                width={"2rem"}
                icon={<MdEdit />}
                borderRadius={"50%"}
              />
              <Input
                name="cover"
                type="file"
                accept="image/gif, image/jpeg, image/png, image/jpg"
                ref={coverPhotoRef}
                hidden
                onChange={(e) =>
                  setPhotos((prev) => ({
                    ...prev,
                    coverPhoto: e.target.files[0],
                  }))
                }
              />
            </Box>
          </AspectRatio>
          <Box marginX={"auto"} marginTop={"-50px"}>
            <Box
              marginX={"auto"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              position={"relative"}
              width={"100px"}
              height={"100px"}
              borderRadius={"50%"}
              bg={colorMode === "dark" ? "gray.800" : "gray.50"}
              border="1px solid"
              borderColor={
                colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"
              }
            >
              <Image
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  height: "100px",
                  width: "100px",
                }}
                src={
                  !!photos.profilePhoto
                    ? URL.createObjectURL(photos.profilePhoto)
                    : userPlaceholder.src
                }
                preview={false}
                alt="img"
              />
              <Input
                name='profile'
                type="file"
                accept="image/gif, image/jpeg, image/png, image/jpg"
                ref={profilePhotoRef}
                hidden
                onChange={(e) =>
                  setPhotos((prev) => ({
                    ...prev,
                    profilePhoto: e.target.files[0],
                  }))
                }
              />
              <IconButton
                onClick={() => profilePhotoRef.current.click()}
                position={"absolute"}
                right={0}
                bottom={0}
                height={"2rem"}
                width={"2rem"}
                icon={<MdEdit />}
                borderRadius={"50%"}
              />
            </Box>
            <HStack justifyContent={"center"} m={"0.5rem auto"}>
              {walletAddress && <Web3Address address={walletAddress} />}
            </HStack>
          </Box>

          <Form
            defaultValues={{}}
            resolver={yupResolver(schema)}
            onSubmit={async (values, e) => {
              try {
                // const profilePicturePath = await imageLinkGenerator(
                //   photos.profilePhoto
                // );
                // const coverPicturePath = await imageLinkGenerator(
                //   photos.coverPhoto
                // );

                const formData = new FormData();
                formData.append("profile", photos.profilePhoto);
                formData.append("cover", photos.coverPhoto);
                formData.append("username", values.username);
                formData.append("biography", values.biography);
                formData.append("telegramId", values.telegramId);
                formData.append("discordId", values.discordId);
                formData.append("twitterId", values.twitterId);

                // formData.append('photoCheck', JSON.stringify({cover: !!photos.coverPhoto, profile: !!photos.profilePhoto}))
                // console.log(JSON.stringify({cover: !!photos.coverPhoto, profile: !!photos.profilePhoto}))
                await axios
                  .post(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}api/user/createProfile`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )

                  .then((res) => {
                    if (res.status === 200) {
                      console.log(res.data);
                      dispatch(setUser(res.data));
                      router.push("/");
                    }
                  });
                e.target.reset();
              } catch (e) {
                dispatch(setSessionEnd(true));
                console.log(e);
              }
            }}
          >
            <FormLayout>
              <Field
                name="username"
                label="Username*"
                type="text"
                help="Choose an username"
              />
              <Field
                name="biography"
                type="textarea"
                label="Biography"
                help="Maximum 50 characters."
                resize={"none"}
              />
              <Field name="telegramId" label="Telegram" type="text" />
              <FormLayout columns={2}>
                <Field name="discordId" label="Discord" type="text" />
                <Field name="twitterId" label="Twitter" type="text" />
              </FormLayout>
              <SubmitButton disableIfInvalid color="black">
                Create Profile
              </SubmitButton>
            </FormLayout>
          </Form>
        </CardBody>
        <CardFooter
          bg={colorMode === "dark" ? "blackAlpha.100" : "blackAlpha.50"}
        ></CardFooter>
      </Card>
    </>
  );
};

export default CreateProfileModal;
