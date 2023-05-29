import {
  setIsStoriesActive,
  setStories,
  setStoryIndex,
} from "@/state/slices/story";
import {
  Box,
  Flex,
  Icon,
  Text,
  useColorMode,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StoryWrapper from "./StoryWrapper";
import { IoAddCircle, IoAddCircleOutline } from "react-icons/io5";
import CreateStoryWrapper from "./CreateStoryWrapper";

const StoryLine = () => {
  const [largerThan1000] = useMediaQuery("(min-width: 1000px)");
  const dispatch = useDispatch();
  const stories = useSelector((state) => state.story.stories);
  const ourRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const mouseCoords = useRef({
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const handleDragStart = (e) => {
    if (!ourRef.current) return;
    const slider = ourRef.current;
    const startX = e.pageX - slider.offsetLeft;
    const startY = e.pageY - slider.offsetTop;
    const scrollLeft = slider.scrollLeft;
    const scrollTop = slider.scrollTop;
    mouseCoords.current = { startX, startY, scrollLeft, scrollTop };
    setIsMouseDown(true);
    document.body.style.cursor = "grabbing";
  };
  const handleDragEnd = () => {
    setIsMouseDown(false);
    if (!ourRef.current) return;
    document.body.style.cursor = "default";
  };
  const handleDrag = (e) => {
    if (!isMouseDown || !ourRef.current) return;
    e.preventDefault();
    const slider = ourRef.current;
    const x = e.pageX - slider.offsetLeft;
    const y = e.pageY - slider.offsetTop;
    const walkX = (x - mouseCoords.current.startX) * 1.5;
    const walkY = (y - mouseCoords.current.startY) * 1.5;
    slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
    slider.scrollTop = mouseCoords.current.scrollTop - walkY;
    console.log(walkX, walkY);
  };
  const { colorMode } = useColorMode();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}api/story/get`)
      .then((res) => {
        console.log(res.data);
        dispatch(setStories(res.data));
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <Flex maxW={"100%"} w={"100%"} minW={0}>
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          bgGradient={"linear(to-t, primary.500, purple.700)"}
        >
          <Text
            m={2}
            fontWeight={"bold"}
            fontSize={"lg"}
            color={"white"}
            letterSpacing={2}
            sx={{
              writingMode: "vertical-lr",
              textAlign: "center",
              transform: "rotate(180deg)",
            }}
          >
            DAILY
          </Text>
        </Flex>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            overflowX: "hidden",
            overflowY: "hidden",

            position: "relative",
          }}
          ref={ourRef}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseMove={handleDrag}
        >
          {!!user && !!token && !!user?.isProfileCreated && (
            <Flex
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              minW={"72px"}
              borderRadius={"lg"}
              overflow={"hidden"}
              m="1"
              position={"relative"}
              alignItems={"center"}
            >
              <Flex
                backdropFilter={"auto"}
                backdropBlur={"4px"}
                height={"100%"}
                flexDir={"column"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                p={1}
              >
                <Flex
                  shadow={"md"}
                  borderRadius={"50%"}
                  overflow={"hidden"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  w={"60px"}
                  h={"60px"}
                  bg={`
             radial-gradient(circle at 0% 107%, #fdf497 0%, #fd5949 35%, #d6249f 60%, #285AEB 100%);`}
                >
                  <Icon
                    as={IoAddCircleOutline}
                    color={"white"}
                    top={0}
                    fontSize={"36px"}
                    left={0}
                  />
                </Flex>
                <Text
                  textOverflow={"ellipsis"}
                  overflow={"hidden"}
                  whiteSpace={"nowrap"}
                  w={"72px"}
                  textAlign={"center"}
                  fontWeight={"semibold"}
                  fontSize={"sm"}
                >
                  Add Daily
                </Text>
              </Flex>
            </Flex>
          )}

          {stories &&
            stories.length > 0 &&
            stories.map((storyArray, i) => {
              const user = storyArray[0]?.user;
              return (
                <Flex
                  minW={"72px"}
                  borderRadius={"lg"}
                  overflow={"hidden"}
                  m="1"
                  position={"relative"}
                  alignItems={"center"}
                  onClick={() => {
                    dispatch(setStoryIndex(i));
                    dispatch(setIsStoriesActive(true));
                  }}
                >
                  <Flex
                    backdropFilter={"auto"}
                    backdropBlur={"4px"}
                    height={"100%"}
                    flexDir={"column"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    p={1}
                  >
                    <Flex
                      shadow={"md"}
                      borderRadius={"50%"}
                      overflow={"hidden"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      w={"60px"}
                      h={"60px"}
                      bg={`
                    radial-gradient(circle at 0% 107%, #fdf497 0%, #fd5949 35%, #d6249f 60%, #285AEB 100%);`}
                    >
                      <img
                        alt="a"
                        key={user?.profilePicturePath}
                        src={user?.profilePicturePath}
                        style={{
                          width: "52px",
                          border: "4px solid",
                          borderColor:
                            colorMode === "light" ? "white" : "black",
                          height: "52px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </Flex>
                    <Text
                      textOverflow={"ellipsis"}
                      overflow={"hidden"}
                      whiteSpace={"nowrap"}
                      w={"72px"}
                      textAlign={"center"}
                      fontWeight={"semibold"}
                      fontSize={"sm"}
                    >
                      {user?.username}
                    </Text>
                  </Flex>
                </Flex>
              );
            })}
        </div>
      </Flex>
      <CreateStoryWrapper isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
};

export default StoryLine;
