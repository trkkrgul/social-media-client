import {
  Badge,
  Box,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Spacer,
  Text,
  useColorMode,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import {
  AppShell,
  Card,
  MenuItem,
  PersonaAvatar,
  useModals,
} from "@saas-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import React from "react";
import {
  Sidebar,
  SidebarSection,
  SidebarToggleButton,
  SidebarOverlay,
  NavGroup,
  NavItem,
} from "@saas-ui/sidebar";
import {
  FaAddressBook,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaKey,
  FaMoon,
  FaPhoneAlt,
  FaStar,
  FaSun,
  FaUsers,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import {
  setNonce,
  setSignOut,
  setSignature,
  setToken,
  setUser,
  setWalletAddress,
} from "@/state/slices/auth";
import LoginStepper from "@/components/auth/LoginStepper";
import { useRouter } from "next/router";
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
  return (
    <>
      <Divider />
      <div style={{ display: "flex", maxWidth: "1300px", margin: "0 auto" }}>
        {isLargerThan800 && (
          <Sidebar
            zIndex={"4"}
            className="sticky-div"
            breakpoints={{ base: true, lg: false }}
          >
            <SidebarSection direction="row">
              <Image
                src="https://sakaivault.io/512.png"
                boxSize="7"
                alt="logo"
              />
              <Spacer />
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={
                    <PersonaAvatar
                      presence="online"
                      size="xs"
                      src={user?.profilePicturePath}
                    />
                  }
                  variant="ghost"
                />
                <MenuList>
                  {!user && (
                    <MenuItem
                      onClick={() => {
                        // modals.open({
                        //   title: "Login",
                        //   body: <LoginStepper />,
                        //   footer: null,
                        // });
                        router.push("/login");
                      }}
                    >
                      Login
                    </MenuItem>
                  )}
                  {!!user && (
                    <MenuItem onClick={handleSignout}>Sign out</MenuItem>
                  )}
                </MenuList>
              </Menu>
            </SidebarSection>
            <SidebarSection aria-label="Main">
              <NavGroup>
                <NavItem
                  href={null}
                  onClick={() => {
                    router.push("/");
                  }}
                  icon={<FaHome />}
                  isActive={router.pathname === "/"}
                >
                  Home
                </NavItem>
                <NavItem
                  href={null}
                  icon={<FaUsers />}
                  onClick={() => {
                    router.push("/profile");
                  }}
                  isActive={router.pathname === "/profile"}
                >
                  Profile
                </NavItem>
                <NavItem icon={<FaKey />}>Settings</NavItem>
              </NavGroup>

              <NavGroup title="Teams" isCollapsible>
                <NavItem>Sales</NavItem>
                <NavItem>Support</NavItem>
              </NavGroup>
            </SidebarSection>
            <Spacer />
            <SidebarSection>
              <NavItem
                href={null}
                cursor={"pointer"}
                size="sm"
                icon={colorMode === "dark" ? <FaMoon /> : <FaSun />}
                onClick={toggleColorMode}
              >
                Change Theme
              </NavItem>
            </SidebarSection>
          </Sidebar>
        )}
        <Box
          maxW={"1100px"}
          minH={"100vh"}
          width="100%"
          borderRight={"1px"}
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
