import {
  Box,
  Divider,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuList,
  Spacer,
  Switch,
  Text,
  VStack,
  useColorMode,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import {
  Button,
  MenuDialog,
  MenuDialogList,
  MenuItem,
  useModals,
} from "@saas-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import React, { Suspense, useState } from "react";
import { NavGroup, NavItem, Nav } from "@saas-ui/sidebar";
import {
  FaChevronRight,
  FaFacebook,
  FaHamburger,
  FaHome,
  FaKey,
  FaMoon,
  FaPhoneAlt,
  FaStar,
  FaSun,
  FaTelegramPlane,
  FaTwitter,
  FaUser,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { setSignOut } from "@/state/slices/auth";
import LoginStepper from "@/components/auth/LoginStepper";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  IoAddCircle,
  IoClose,
  IoKey,
  IoKeySharp,
  IoLogOut,
  IoMenu,
  IoPerson,
} from "react-icons/io5";
import { ConnectKitButton } from "connectkit";
import {
  MdOutlineExplore,
  MdPerson,
  MdPerson2,
  MdPerson3,
  MdPerson4,
} from "react-icons/md";
import MyPostWidget from "@/components/post/MyPostWidget";
const PageLayout = ({ children, title }) => {
  const user = useSelector((state) => state.auth.user);
  const [isLargerThan1000] = useMediaQuery("(min-width: 1000px)");
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const path = router.pathname;
  return (
    <>
      <Flex m={"0 auto"} maxW={"1200px"} position={"relative"}>
        {isLargerThan1000 && <DesktopNav />}
        <Box
          maxW={"1100px"}
          width="100%"
          // borderLeft={"1px"}
          minHeight={"100vh"}
          paddingBottom={"10rem"}
          borderColor={colorMode === "dark" ? "whiteAlpha.300" : "gray.200"}
        >
          <Box
            width={"100%"}
            position={"sticky"}
            top="0"
            height={"auto"}
            zIndex={"2"}
            _before={{
              zIndex: "-1",
              opacity: "1",
              content: '""',
              width: "100%",
              height: "100%",
              opacity: "0.6",
              position: "absolute",
              top: "0",
              left: "0",
              background: colorMode === "dark" ? "gray.800" : "white",
            }}
            sx={{
              backdropFilter: "blur(16px)",
              display: "flex",
              flexDirection: "column",
              backfaceVisibility: "hidden",
            }}
          >
            <Flex margin={"1rem"}>
              <Text fontSize={"xl"} fontWeight={"bold"}>
                {title}
              </Text>
            </Flex>
            <Divider />
          </Box>
          {children}
        </Box>
      </Flex>
      {!isLargerThan1000 && <MobileNav />}
    </>
  );
};

const UserMenuWidget = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSignout = () => {
    dispatch(setSignOut());
    router.push("/login");
  };
  return (
    <>
      <HStack justifyContent={"space-between"} w={"100%"} p={2}>
        <HStack>
          <Image
            src={user.profilePicturePath}
            height={36}
            width={36}
            style={{ objectFit: "cover" }}
          />
          <VStack align={"left"}>
            <Text lineHeight={"1"} fontWeight={"700"}>
              @{user.username}
            </Text>
            <Text
              width={"120px"}
              lineHeight={"1"}
              textOverflow={"ellipsis"}
              overflowWrap={"anywhere"}
              overflow={"hidden"}
              whiteSpace={"nowrap"}
              fontSize={"sm"}
            >
              {user.walletAddress}
            </Text>
          </VStack>
        </HStack>
        <HStack mx={4}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<IoMenu size={16} />}
              variant="outline"
            />
            <MenuList zIndex={"dropdown"}>
              <MenuItem
                icon={<FaUser size={16} />}
                onClick={() => router.push("/profile")}
              >
                Profile
              </MenuItem>
              <Divider my={1} />
              <MenuItem icon={<IoKey size={16} />}>Settings</MenuItem>
              <MenuItem
                icon={<IoLogOut size={16} />}
                onClick={handleSignout}
                color={"white"}
                bg={"red.500"}
                _hover={{ bg: "red.600" }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
    </>
  );
};

const DesktopNav = () => {
  const user = useSelector((state) => state.auth.user);
  const [isLargerThan1000] = useMediaQuery("(min-width: 1000px)");
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const path = router.pathname;
  const [isCreatingNewPost, setIsCreatingNewPost] = useState(false);
  return (
    <Suspense>
      {!!user && user.username && isCreatingNewPost && (
        <Flex
          zIndex={"overlay"}
          position={"fixed"}
          left={"0"}
          top={"0"}
          width={"100%"}
          height={"100%"}
          justify={"center"}
          align={"center"}
          onClick={() => setIsCreatingNewPost(false)}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            w={"100%"}
            maxW={"600px"}
            shadow={"lg"}
            borderRadius={"lg"}
            bg={colorMode === "dark" ? "gray.800" : "white"}
          >
            <MyPostWidget setIsCreatingNewPost={setIsCreatingNewPost} />
          </Box>
        </Flex>
      )}
      <Box
        zIndex={"banner"}
        borderRight={"1px"}
        borderColor={colorMode === "dark" ? "whiteAlpha.300" : "gray.200"}
      >
        <Flex
          borderColor={colorMode === "dark" ? "whiteAlpha.300" : "gray.200"}
          width={"300px"}
          className="sticky-div"
          flexDirection={"column"}
          alignItems={"center"}
          p={1}
        >
          <Box w={"100%"}>
            <Link href={"/"} prefetch={false}>
              <Button
                size={"lg"}
                height={"36px"}
                colorScheme={path === "/" ? "primary" : "gray"}
                width={"100%"}
                variant={path === "/" ? "solid" : "ghost"}
                leftIcon={<FaHome />}
                href={null}
                justifyContent={"left"}
              >
                Home
              </Button>
            </Link>
            <Link href={"/profile"} prefetch={false}>
              <Button
                size={"lg"}
                height={"36px"}
                width={"100%"}
                colorScheme={path === "/profile" ? "primary" : "gray"}
                variant={path === "/profile" ? "solid" : "ghost"}
                leftIcon={<FaUser />}
                href={null}
                justifyContent={"left"}
              >
                Profile
              </Button>
            </Link>
            <Button
              size={"lg"}
              height={"36px"}
              width={"100%"}
              variant={"ghost"}
              leftIcon={<IoAddCircle />}
              href={null}
              justifyContent={"left"}
              onClick={() => setIsCreatingNewPost(true)}
            >
              Create Post
            </Button>
          </Box>
          <Spacer />
          {!!user && !!user.username && <UserMenuWidget />}
          <Divider />
          <HStack justifyContent={"space-between"} w={"100%"} p={2}>
            <Text>Theme</Text>
            <Switch
              colorScheme="primary"
              size="lg"
              onChange={toggleColorMode}
              isChecked={colorMode === "dark"}
              sx={{
                ".chakra-switch__thumb": {
                  background:
                    colorMode === "light"
                      ? "url(./icons/sun.svg) center center, #fff !important"
                      : "url(./icons/moon.svg) center center, #000 !important",
                  backgroundSize: "contain,cover !important",
                },
              }}
            />
          </HStack>
          <Divider />
          <HStack justifyContent={"space-between"} w={"100%"} p={2}>
            <HStack>
              <Text as="em" fontSize={"sm"}>
                Powered by
              </Text>
              <Image src={"./sakaivault-dark.svg"} width={80} height={50} />
            </HStack>
            <HStack>
              <Link href={"https://twitter.com/sakaivault"} target="_blank">
                <IconButton icon={<FaTwitter />} />
              </Link>
              <Link href={"https://t.me/sakaivault"} target="_blank">
                <IconButton icon={<FaTelegramPlane />} />
              </Link>
            </HStack>
          </HStack>
        </Flex>
      </Box>
    </Suspense>
  );
};

const MobileNav = () => {
  const user = useSelector((state) => state.auth.user);
  const [isLargerThan1000] = useMediaQuery("(min-width: 1000px)");
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const [isCreatingNewPost, setIsCreatingNewPost] = useState(false);
  const path = router.pathname;
  return (
    <Suspense>
      {!!user && user.username && isCreatingNewPost && (
        <Flex
          zIndex={"overlay"}
          position={"fixed"}
          left={"0"}
          top={"0px"}
          width={"100%"}
          height={"50%"}
          justify={"center"}
          align={"center"}
          onClick={() => setIsCreatingNewPost(false)}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            w={"100%"}
            maxW={"600px"}
            borderRadius={"lg"}
            shadow={"lg"}
            bg={colorMode === "dark" ? "gray.800" : "white"}
          >
            <MyPostWidget setIsCreatingNewPost={setIsCreatingNewPost} />
          </Box>
        </Flex>
      )}
      <Flex
        position={"fixed"}
        bottom={"0"}
        height={"60px"}
        width={"100%"}
        bg={colorMode === "dark" ? "blackAlpha.500" : "white"}
        backdropFilter={"auto"}
        backdropBlur={"md"}
        zIndex={"popover"}
        borderTop={"1px"}
        borderColor={colorMode === "dark" ? "whiteAlpha.300" : "gray.200"}
      >
        <Flex
          borderColor={colorMode === "dark" ? "whiteAlpha.300" : "gray.200"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          width={"100%"}
          px={4}
        >
          <Link href={"/"}>
            <IconButton
              aria-label="Home"
              icon={<FaHome size={24} />}
              variant="ghost"
            />
          </Link>
          <IconButton
            isDisabled
            aria-label="Explore"
            icon={<MdOutlineExplore size={24} />}
            variant="ghost"
          />
          <IconButton
            onClick={() => setIsCreatingNewPost(true)}
            aria-label="Add Post"
            icon={<IoAddCircle size={24} />}
            variant="ghost"
          />
          <Link href={"/profile"}>
            <IconButton
              aria-label="Profile"
              icon={<MdPerson2 size={24} />}
              variant="ghost"
            />
          </Link>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<IoMenu size={24} />}
              variant="ghost"
            />
            <MenuList
              bg="whiteAlpha.200"
              backdropFilter={"auto"}
              backdropBlur={"md"}
            >
              <Nav width={"100%"}>
                <Link href={"/"} prefetch={false}>
                  <Button
                    size={"lg"}
                    height={"36px"}
                    colorScheme={path === "/" ? "primary" : "gray"}
                    width={"100%"}
                    variant={path === "/" ? "solid" : "ghost"}
                    leftIcon={<FaHome />}
                    href={null}
                    justifyContent={"left"}
                  >
                    Home
                  </Button>
                </Link>
                <Link href={"/profile"} prefetch={false}>
                  <Button
                    size={"lg"}
                    height={"36px"}
                    width={"100%"}
                    colorScheme={path === "/profile" ? "primary" : "gray"}
                    variant={path === "/profile" ? "solid" : "ghost"}
                    leftIcon={<FaUser />}
                    href={null}
                    justifyContent={"left"}
                  >
                    Profile
                  </Button>
                </Link>
              </Nav>
              {!!user && !!user.username && <UserMenuWidget />}
              <Divider />
              <HStack justifyContent={"space-between"} w={"100%"} p={2}>
                <Text>Theme</Text>
                <Switch
                  colorScheme="primary"
                  size="lg"
                  onChange={toggleColorMode}
                  isChecked={colorMode === "dark"}
                  sx={{
                    ".chakra-switch__thumb": {
                      background:
                        colorMode === "light"
                          ? "url(./icons/sun.svg) center center, #fff !important"
                          : "url(./icons/moon.svg) center center, #000 !important",
                      backgroundSize: "contain,cover !important",
                    },
                  }}
                />
              </HStack>
              <Divider />
              <HStack justifyContent={"space-between"} w={"100%"} p={2}>
                <HStack>
                  <Text as="em" fontSize={"sm"}>
                    Powered by
                  </Text>
                  <Image src={"./sakaivault-dark.svg"} width={80} height={50} />
                </HStack>
                <HStack>
                  <Link href={"https://twitter.com/sakaivault"} target="_blank">
                    <IconButton icon={<FaTwitter />} />
                  </Link>
                  <Link href={"https://t.me/sakaivault"} target="_blank">
                    <IconButton icon={<FaTelegramPlane />} />
                  </Link>
                </HStack>
              </HStack>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Suspense>
  );
};

export default PageLayout;
