import { setIsStoriesActive, setStoryIndex } from "@/state/slices/story";
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
} from "@chakra-ui/react";
import { Button } from "@saas-ui/react";
import React, { Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StoryLine from ".";
import ReactInstaStories from "react-insta-stories";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import moment from "moment";
const StoryWrapper = () => {
  const [size, setSize] = useState("full");
  const stories = useSelector((state) => state.story.stories);
  const storyIndex = useSelector((state) => state.story.storyIndex);
  const isStoriesActive = useSelector((state) => state.story.isStoriesActive);
  const [story, setStory] = useState(
    stories[storyIndex] || [{ url: "https://sakaivault.io/512.png" }]
  );
  const dispatch = useDispatch();
  const onOpen = () => dispatch(setIsStoriesActive(true));
  const onClose = () => {
    dispatch(setIsStoriesActive(false));
    dispatch(setStoryIndex(0));
  };
  return (
    <>
      <Modal
        onClose={onClose}
        size={"full"}
        isOpen={isStoriesActive}
        closeOnEsc={true}
        closeOnOverlayClick={true}
        preserveScrollBarGap={true}
      >
        <ModalOverlay />
        <ModalContent onClick={onClose}>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            p={0}
            flexDirection={"column"}
          >
            <Suspense>
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <ReactInstaStories
                  flexGrow={1}
                  loop
                  defaultInterval={4000}
                  stories={(
                    stories?.[storyIndex] || [
                      { url: "https://sakaivault.io/512.png", type: "image" },
                    ]
                  ).map((story) => ({
                    url: story?.media?.url,
                    type: story?.media?.type,
                    header: {
                      heading: story?.user?.username,
                      subheading: moment(
                        story?.createdAt || new Date()
                      ).fromNow(),
                      profileImage: story?.user?.profilePicturePath,
                    },
                  }))}
                  onStoryEnd={(s, st) => console.log("story ended", s, st)}
                  onAllStoriesEnd={(s, st) => {
                    try {
                      dispatch(
                        setStoryIndex(
                          storyIndex + 1 > stories.length - 1
                            ? 0
                            : storyIndex + 1
                        )
                      );
                    } catch (e) {}
                  }}
                  onStoryStart={(s, st) => console.log("story started", s, st)}
                  storyContainerStyles={{ borderRadius: 8, overflow: "hidden" }}
                />
              </Box>
            </Suspense>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StoryWrapper;
