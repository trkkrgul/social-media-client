import { setUser } from "@/state/slices/auth";
import {
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
  AutoForm,
  Field,
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
import React from "react";
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@saas-ui/forms/yup";
const CreateProfileModal = () => {
  const token = useSelector((state) => state.auth.token);
  const [usernameController, setUsernameController] = React.useState("");
  const [values, setValues] = React.useState({
    username: "",
    biography: "",
    telegramId: "",
    discordId: "",
    twitterId: "",
  });
  const handleCreateProfile = async () => {
    const {
      username,
      biography,
      telegramId,
      discordId,
      twitterId,
      profilePicturePath,
    } = values;
    await axios
      .post(
        "http://localhost:5001/api/user/createProfile",
        {
          ...values,
          profilePicturePath: "https://sakaivault.io/512.png",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          dispatch(setUser(res.data));
        }
        if (res.status === 400) {
          dispatch(setUser(res.data));
          alert(res.message);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  const user = useSelector((state) => state.auth.user);
  const walletAddress = useSelector((state) => state.auth.walletAddress);
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
  if (isProfileCreated) {
    router.push("/");
    return <p>you are ready to use the app</p>;
  }
  const schema = Yup.object().shape({
    name: Yup.string().required().label("Name"),
    description: Yup.string().label("Description").min(50),
  });

  const onSubmit = (params) => {
    console.log(params);
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  };
  return (
    <>
      <Card
        bg={colorMode === "dark" ? "blackAlpha.600" : "whiteAlpha.600"}
        maxW={"400px"}
        margin={"0 auto"}
        borderRadius={isLargerThan800 ? "lg" : "none"}
        marginY={isLargerThan800 ? "2" : "0"}
        // shadow={
        //   isLargerThan800 ? (colorMode === "dark" ? "dark-lg" : "lg") : "none"
        // }
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
          <HStack justifyContent={"center"}>
            <Box
              position={"relative"}
              width={"100px"}
              height={"100px"}
              borderRadius={"50%"}
              bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
              padding={"3"}
              border="1px solid"
              borderColor={
                colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"
              }
            >
              <Image src="https://sakaivault.io/512.png" preview={false} />
              <IconButton
                position={"absolute"}
                right={0}
                bottom={0}
                height={"2rem"}
                width={"2rem"}
                borderRadius={"50%"}
              >
                <Text>
                  <MdEdit />
                </Text>
              </IconButton>
            </Box>
          </HStack>
          <Form
            defaultValues={{
              name: "",
              description: "",
            }}
            resolver={yupResolver(schema)}
            onSubmit={onSubmit}
          >
            <FormLayout>
              <Field
                name="name"
                label="Name"
                type="text"
                help="Choose a title for this project."
              />

              <Field
                name="description"
                type="textarea"
                label="Description"
                help="Minimum 50 characters."
                resize={"none"}
              />

              <SubmitButton>Create Project</SubmitButton>
            </FormLayout>
          </Form>
          {false && (
            <PropertyList>
              <Property
                label="WalletAddress"
                value={
                  <HStack justifyContent={"space-between"} width={"100%"}>
                    <Input value={walletAddress} isDisabled={true} />
                  </HStack>
                }
              />
              <Property
                label=" "
                value={
                  <Select value="User">
                    <MenuItemOption value="User">I am User</MenuItemOption>
                    <MenuItemOption value="Project" isDisabled={true}>
                      I am Project
                    </MenuItemOption>
                  </Select>
                }
              />
              <Box>
                <Property
                  label="Username"
                  value={
                    <InputGroup>
                      <InputLeftAddon fontSize={"lg"}>@</InputLeftAddon>
                      <Input
                        pattern="^[a-z_]{5,10}$"
                        placeholder="johndoe"
                        onChange={(e) => {
                          const input = e.target.value.toLowerCase();
                          setValues({
                            ...values,
                            username: input,
                          });
                          axios
                            .post(
                              "http://localhost:5001/api/auth/checkUsername",
                              {
                                username: input,
                              }
                            )
                            .then((res) => {
                              setUsernameController(res.data.message);
                            });
                        }}
                      />
                    </InputGroup>
                  }
                />
                <Text color="red.500" textAlign={"right"}>
                  {usernameController}
                </Text>
              </Box>
              <Property
                label="Biography"
                value={
                  <HStack justifyContent={"space-between"} width={"100%"}>
                    <Textarea
                      resize={"none"}
                      maxLength={"100"}
                      value={values.biography}
                      onChange={(e) => {
                        setValues({
                          ...values,
                          biography: e.target.value,
                        });
                      }}
                    />
                  </HStack>
                }
              />
              <Property
                label="Telegram"
                value={
                  <InputGroup>
                    <InputLeftAddon fontSize={"lg"}>@</InputLeftAddon>
                    <Input
                      placeholder="telegram123"
                      value={values.telegramId}
                      onChange={(e) => {
                        setValues({
                          ...values,
                          telegramId: e.target.value,
                        });
                      }}
                    />
                  </InputGroup>
                }
              />
              <Property
                label="Discord"
                value={
                  <InputGroup>
                    <InputLeftAddon fontSize={"lg"}>@</InputLeftAddon>
                    <Input
                      placeholder="discord123"
                      value={values.discordId}
                      onChange={(e) => {
                        setValues({
                          ...values,
                          discordId: e.target.value,
                        });
                      }}
                    />
                  </InputGroup>
                }
              />
              <Property
                label="Twitter"
                value={
                  <InputGroup>
                    <InputLeftAddon fontSize={"lg"}>@</InputLeftAddon>
                    <Input
                      placeholder="twitter123"
                      value={values.twitterId.toLowerCase()}
                      onChange={(e) => {
                        setValues({
                          ...values,
                          twitterId: e.target.value.toLowerCase(),
                        });
                      }}
                    />
                  </InputGroup>
                }
              />
            </PropertyList>
          )}
        </CardBody>
        <CardFooter
          bg={colorMode === "dark" ? "blackAlpha.100" : "blackAlpha.50"}
        >
          <Button variant={"primary"} onClick={handleCreateProfile}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default CreateProfileModal;
