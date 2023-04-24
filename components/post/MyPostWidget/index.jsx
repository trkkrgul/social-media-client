import { setFeedPosts } from "@/state/slices/post";
import {
  Box,
  Divider,
  Flex,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  Button,
  Card,
  CardBody,
  Field,
  Form,
  FormLayout,
  MenuItem,
  Persona,
} from "@saas-ui/react";
import axios from "axios";

import React from "react";
import { BsBookmarkCheck, BsEmojiHeartEyes } from "react-icons/bs";
import {
  IoFolderOutline,
  IoImagesOutline,
  IoMicOutline,
  IoTrashOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "antd";
import { connectFirebase } from "@/utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { RxEnterFullScreen } from "react-icons/rx";
import { setSessionEnd } from "@/state/slices/auth";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

const MyPostWidget = () => {
  const user = useSelector((state) => state.auth.user);
  const walletAddress = useSelector((state) => state.auth.walletAddress);
  const isProfileCreated = useSelector(
    (state) => state.auth.user?.isProfileCreated
  );
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();
  const [readyToShare, setReadyToShare] = React.useState(true);
  const uploadedImagesRef = React.useRef(null);
  const [uploadedImages, setUploadedImages] = React.useState([]);
  const handleUploadImage = async () => {
    const firebaseStorage = await connectFirebase();
    if (uploadedImages.length === 0) return;
    let images = [];
    for (const image of uploadedImages) {
      const storageRef = ref(
        firebaseStorage,
        `${image.type.split("/")[0]}s/${
          v4() + String(image.name).replace(/ /g, "_")
        }`
      );
      await uploadBytes(storageRef, image).then(async (snapshot) => {
        const url = await getDownloadURL(storageRef);
        const fullpath = snapshot.metadata.name;
        const name =
          fullpath.slice(0, fullpath.lastIndexOf(".")) +
          "_800x800" +
          fullpath.slice(fullpath.lastIndexOf("."));

        images.push({
          url:
            "https://storage.googleapis.com/sakaivault-images.appspot.com/images/thumb/" +
            name,
          type: snapshot.metadata.contentType.split("/")[0],
        });
      });
    }
    return images;
  };

  const { colorMode, toggleColorMode } = useColorMode();
  const [isLargerThan800] = useMediaQuery("(min-width: 1000px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });
  const [content, setContent] = React.useState(``);
  const feedPosts = useSelector((state) => state.post.feed);
  const dispatch = useDispatch();
  const onEmojiClick = (e) => {
    setContent(content + e.emoji);
  };
  const handlePost = async () => {
    try {
      if (content.length === 0) return;
      setReadyToShare(false);
      const images = await handleUploadImage();
      await axios
        .post(
          "https://api.defitalks.io/api/post/create",
          {
            content: content,
            tags: ["test"],
            categories: ["test"],
            userWalletAddress: walletAddress,
            media: images,
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
            setContent(``);
            setUploadedImages([]);
            dispatch(setFeedPosts([res.data[0], ...feedPosts]));
            setReadyToShare(true);
          } else {
            setReadyToShare(true);
            dispatch(setSessionEnd(true));
          }
        });
    } catch (e) {
      console.log(e);
      setReadyToShare(true);
      dispatch(setSessionEnd(true));
    }
  };
  return (
    token &&
    isProfileCreated && (
      <Box borderRadius={"lg"}>
        <Card
          bgGradient={
            "linear(to-t, " +
            (colorMode === "dark" ? "blackAlpha.100" : "whiteAlpha.50") +
            ", " +
            (colorMode === "dark" ? "primary.900" : "primary.50") +
            ")"
          }
          borderRadius={isLargerThan800 ? "lg" : "none"}
          marginY={isLargerThan800 ? "2" : "0"}
          shadow={
            isLargerThan800 ? (colorMode === "dark" ? "dark-lg" : "lg") : "none"
          }
          border={"1px solid"}
          borderColor={colorMode === "dark" ? "gray.700" : "blackAlpha.200"}
          width="100%"
          variant={"outline"}
          overflow={"hidden"}
        >
          <CardBody>
            <Flex gap={1} alignItems={"start"}>
              <Persona
                name={user?.username}
                src={user?.profilePicturePath}
                secondaryLabel="Founder"
                presence="online"
                hideDetails
              />
              <Box flexGrow={1} flexBasis={"100%"}>
                <Form flexGrow={1}>
                  <FormLayout>
                    <Field
                      fontSize={"xl"}
                      resize={"none"}
                      border={
                        colorMode === "dark"
                          ? "whiteAlpha.50"
                          : "blackAlpha.200"
                      }
                      height={"100px"}
                      size={"lg"}
                      name="description"
                      type="textarea"
                      rules={{ required: true }}
                      value={content}
                      onChange={(e) =>
                        readyToShare ? setContent(e.target.value) : null
                      }
                      placeholder="How are you feeling today?"
                    />
                  </FormLayout>
                </Form>
                {uploadedImages.length > 0 && (
                  <Flex
                    alignItems={"center"}
                    flexWrap={"wrap"}
                    bg={
                      colorMode === "dark" ? "blackAlpha.100" : "whiteAlpha.100"
                    }
                    overflow={"hidden"}
                    my={2}
                    borderRadius={"xl"}
                    border="1px"
                    borderColor={
                      colorMode === "light"
                        ? "blackAlpha.100"
                        : "whiteAlpha.100"
                    }
                  >
                    <Image.PreviewGroup>
                      {uploadedImages.map((media, i) => (
                        <Box
                          className="group"
                          position={"relative"}
                          width={
                            uploadedImages.length === 1
                              ? "100%"
                              : uploadedImages.length === 2
                              ? "50%"
                              : uploadedImages.length === 3
                              ? i > 0
                                ? "50%"
                                : "100%"
                              : "50%"
                          }
                        >
                          <HStack
                            _groupHover={{
                              opacity: 1,
                            }}
                            opacity={0}
                            zIndex={"4433"}
                            position={"absolute"}
                            top={0}
                            padding={2}
                            justifyContent={"end"}
                          >
                            <IconButton
                              onClick={() => {
                                setUploadedImages(
                                  uploadedImages.filter(
                                    (_, index) => index !== i
                                  )
                                );
                              }}
                              icon={<IoTrashOutline />}
                            />
                          </HStack>
                          <Image
                            alt="post image"
                            width={"100%"}
                            preview={{
                              mask: (
                                <Box textAlign={"center"}>
                                  <HStack>
                                    <RxEnterFullScreen size={32} />
                                  </HStack>
                                </Box>
                              ),
                            }}
                            key={media.name + i}
                            src={URL.createObjectURL(media)}
                            style={{
                              objectFit: "cover",
                              aspectRatio: `${
                                uploadedImages.length === 1
                                  ? 2
                                  : uploadedImages.length === 2
                                  ? 1
                                  : uploadedImages.length === 3
                                  ? i > 0
                                    ? 2
                                    : 4
                                  : 2
                              } / 1`,
                            }}
                          />
                        </Box>
                      ))}
                    </Image.PreviewGroup>
                  </Flex>
                )}
                {uploadedImages.filter((e) => e.type.split("/")[0] === "video")
                  .length > 0 && (
                  <Flex
                    alignItems={"center"}
                    flexWrap={"wrap"}
                    bg={
                      colorMode === "dark" ? "blackAlpha.100" : "whiteAlpha.100"
                    }
                    overflow={"hidden"}
                    my={2}
                    borderRadius={"xl"}
                    border="1px"
                    borderColor={
                      colorMode === "light"
                        ? "blackAlpha.100"
                        : "whiteAlpha.100"
                    }
                  >
                    {uploadedImages.map((media, i) => (
                      <video width="320" height="240" controls key={media}>
                        <source
                          src={URL.createObjectURL(media)}
                          type="video/mp4"
                        />
                        <source
                          src={URL.createObjectURL(media)}
                          type="video/mov"
                        />
                        <source
                          src={URL.createObjectURL(media)}
                          type="video/avi"
                        />
                        <source
                          src={URL.createObjectURL(media)}
                          type="video/ogg"
                        />
                        Your browser does not support the video tag.
                      </video>
                    ))}
                  </Flex>
                )}
                <Flex justifyContent={"space-between"} my={1}>
                  <HStack>
                    <Menu orientation="horizontal">
                      <MenuButton
                        spellCheck={false}
                        as={IconButton}
                        aria-label="Options"
                        icon={<IoFolderOutline />}
                        variant="outline"
                      />
                      <MenuList>
                        <MenuItem
                          onClick={() => uploadedImagesRef.current.click()}
                          _hover={{ bgColor: "blackAlpha.300" }}
                          icon={<IoImagesOutline size={16} />}
                        >
                          Image
                          <Input
                            ref={uploadedImagesRef}
                            type="file"
                            accept="image/* video/* audio/*"
                            multiple
                            hidden
                            onChange={(e) => {
                              if (readyToShare) {
                                setUploadedImages((prev) => [
                                  ...prev,
                                  ...e.target.files,
                                ]);
                              }
                            }}
                          />
                        </MenuItem>
                        <MenuItem
                          onClick={() => uploadedImagesRef.current.click()}
                          _hover={{ bgColor: "blackAlpha.300" }}
                          icon={<IoVideocamOutline size={16} />}
                        >
                          Video
                        </MenuItem>
                        <MenuItem
                          onClick={() => uploadedImagesRef.current.click()}
                          _hover={{ bgColor: "blackAlpha.300" }}
                          icon={<IoMicOutline size={16} />}
                        >
                          Audio
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    <Popover>
                      <PopoverTrigger>
                        <IconButton
                          spellCheck={false}
                          icon={<BsEmojiHeartEyes />}
                          variant="outline"
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />

                        <EmojiPicker
                          lazyLoadEmojis={true}
                          searchPlaceHolder="Search emoji"
                          onEmojiClick={onEmojiClick}
                          emojiStyle="twitter"
                          previewConfig={{
                            showPreview: false,
                            showVariants: false,
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </HStack>
                  <Button
                    variant={"solid"}
                    colorScheme="primary"
                    onClick={readyToShare ? () => handlePost() : () => null}
                  >
                    {readyToShare ? "Share" : <Spinner size="xs" />}
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </Box>
    )
  );
};

export default MyPostWidget;
