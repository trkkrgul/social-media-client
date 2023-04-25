import {
  Box,
  Divider,
  Flex,
  HStack,
  Spacer,
  Switch,
  Text,
  useColorMode,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import { useModals } from "@saas-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import React, { Suspense } from "react";
import { NavGroup, NavItem, Nav } from "@saas-ui/sidebar";
import {
  FaChevronRight,
  FaHome,
  FaKey,
  FaMoon,
  FaPhoneAlt,
  FaStar,
  FaSun,
  FaUser,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { setSignOut } from "@/state/slices/auth";
import LoginStepper from "@/components/auth/LoginStepper";
import { useRouter } from "next/router";
import Link from "next/link";
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
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });
  return (
    <>
      <div style={{ display: "flex", maxWidth: "1300px", margin: "0 auto" }}>
        {true && (
          <Suspense>
            <Box
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
                  <NavItem
                    isActive={path === "/"}
                    icon={<FaHome />}
                    href={null}
                    onClick={() => router.push("/")}
                  >
                    Home
                  </NavItem>
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
                <HStack>
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
      </div>
    </>
  );
};

export default PageLayout;
