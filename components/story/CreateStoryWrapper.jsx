import {
  setIsStoriesActive,
  setStories,
  setStoryIndex,
} from "@/state/slices/story";
import {
  Box,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Modal,
  useDisclosure,
  Icon,
  IconButton,
  Input,
  AspectRatio,
  useColorMode,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { Button } from "@saas-ui/react";
import React, { Suspense, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StoryLine from ".";
import ReactInstaStories from "react-insta-stories";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import moment from "moment";
import axios from "axios";
const CreateStoryWrapper = ({ isOpen, onClose, onOpen }) => {
  const inputRef = useRef(null);
  const [size, setSize] = useState("full");
  const dispatch = useDispatch();
  const [story, setStory] = useState(null);
  const [type, setType] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [storyReader, setStoryReader] = useState(null);
  const { colorMode } = useColorMode();
  const handleStoryShare = async () => {
    const formData = new FormData();
    formData.append("media", story);
    formData.append("type", type);
    formData.append("userWalletAddress", user?.walletAddress);
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}api/story/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (res) => {
        console.log(res.data);
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}api/story/get`)
          .then((res) => {
            console.log(res.data);
            dispatch(setStoryIndex(0));
            dispatch(setStories(res.data));

            setType(null);
            setStory(null);
            setStoryReader(null);
            onClose();
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Modal onClose={onClose} size={size} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent onClick={onClose}>
          <ModalCloseButton />
          <ModalBody
            bg={colorMode === "light" ? "white" : "blackAlpha.800"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <Suspense>
              <Flex
                position={"relative"}
                flexDirection={"column"}
                w={"100%"}
                maxW={"640px"}
                justifyContent={"center"}
                alignItems={"center"}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {type === "image" && (
                  <AspectRatio ratio={9 / 16} maxH={"80vh"} minW={"300px"}>
                    <img src={storyReader} />
                  </AspectRatio>
                )}
                {type === "video" && (
                  <AspectRatio ratio={9 / 16}>
                    <video src={storyReader} controls />
                  </AspectRatio>
                )}
                <HStack
                  justifyContent={"center"}
                  m={2}
                  position={"absolute"}
                  zIndex={"dropdown"}
                  bottom={"0"}
                >
                  <Button
                    size={"lg"}
                    variant={"solid"}
                    colorScheme="gray"
                    onClick={() => inputRef.current.click()}
                  >
                    {!!story ? "Change Media " : "Add Media"}
                  </Button>
                  <Input
                    w={"100%"}
                    hidden
                    ref={inputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onloadend = () => {
                        setStoryReader(reader.result);
                        setStory(file);
                      };

                      if (file.type.includes("video")) {
                        setType("video");
                      }
                      if (file.type.includes("image")) {
                        setType("image");
                      }
                    }}
                  />
                  {!!story && (
                    <Button
                      size={"lg"}
                      variant={"solid"}
                      colorScheme="primary"
                      onClick={handleStoryShare}
                    >
                      Share
                    </Button>
                  )}
                </HStack>
              </Flex>
            </Suspense>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateStoryWrapper;
