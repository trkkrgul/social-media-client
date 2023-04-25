import {
  Box,
  Divider,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Spacer,
  Switch,
  Text,
  VStack,
  useColorMode,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import { MenuItem, useModals } from "@saas-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import React, { Suspense } from "react";
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
import { IoMenu } from "react-icons/io5";
const PageLayout = ({ children, title }) => {
  const dispatch = useDispatch();
  const walletAddress = useSelector((state) => state.auth.walletAddress);
  const token = useSelector((state) => state.auth.token);
  const signature = useSelector((state) => state.auth.signature);
  const nonce = useSelector((state) => state.auth.nonce);
  const user = useSelector((state) => state.auth.user);
  const handleSignout = () => {
    dispatch(setSignOut());
  };
  const modals = useModals();
  const theme = useTheme();
  const [isLargerThan800] = useMediaQuery("(min-width: 1000px)");
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const path = router.pathname;
  return (
    <>
      <Flex m={"0 auto"} maxW={"1200px"}>
        {true && (
          <Suspense>
            <Box
              zIndex={"banner"}
              borderRight={"1px"}
              borderColor={colorMode === "dark" ? "whiteAlpha.300" : "gray.200"}
            >
              <Flex
                borderColor={
                  colorMode === "dark" ? "whiteAlpha.300" : "gray.200"
                }
                width={"300px"}
                className="sticky-div"
                flexDirection={"column"}
                alignItems={"center"}
                p={1}
              >
                <Nav width={"100%"}>
                  <Link href={"/"} prefetch={false}>
                    <NavItem
                      isActive={path === "/"}
                      icon={<FaHome />}
                      href={null}
                    >
                      Home
                    </NavItem>
                  </Link>
                  <Link href={"/profile"} prefetch={false}>
                    <NavItem
                      isActive={path === "/profile"}
                      href={null}
                      icon={<FaUser />}
                    >
                      Profile
                    </NavItem>
                  </Link>
                </Nav>
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
                    <Image
                      src={"./sakaivault-dark.svg"}
                      width={80}
                      height={50}
                    />
                  </HStack>
                  <HStack>
                    <Link
                      href={"https://twitter.com/sakaivault"}
                      target="_blank"
                    >
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
        )}
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
    </>
  );
};

const UserMenuWidget = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modals = useModals();
  const walletAddress = useSelector((state) => state.auth.walletAddress);
  const token = useSelector((state) => state.auth.token);
  const signature = useSelector((state) => state.auth.signature);
  const nonce = useSelector((state) => state.auth.nonce);
  const user = useSelector((state) => state.auth.user);
  const handleSignout = () => {
    dispatch(setSignOut());
  };
  const dispatch = useDispatch();
  const router = useRouter();
  const path = router.pathname;
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
              icon={<IoMenu />}
              variant="outline"
            />
            <MenuList zIndex={"dropdown"}>
              <MenuItem icon={<FaHome />} command="⌘T">
                New Tab
              </MenuItem>
              <MenuItem icon={<FaHome />} command="⌘T">
                New Tab
              </MenuItem>
              <MenuItem icon={<FaHome />} command="⌘T">
                New Tab
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
    </>
  );
};

export default PageLayout;
