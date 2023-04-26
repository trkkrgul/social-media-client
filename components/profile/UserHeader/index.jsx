import {
  AspectRatio,
  Box,
  ButtonGroup,
  Divider,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image as ImageAntd } from "antd";
import { Web3Address } from "@saas-ui/web3";
import { IoCopyOutline, IoPerson } from "react-icons/io5";
import { Button, Property } from "@saas-ui/react";
import { BsMailbox } from "react-icons/bs";
import { FaDiscord, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import axios from "axios";
import { setUser as setLoggedUser } from "@/state/slices/auth";
import ImagePreviewer from "@/components/images/ImagePreviewer";
import Image from "next/image";

const UserHeader = ({ user, setUser }) => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.auth.user);
  const isOwnProfile = loggedUser?.walletAddress === user?.walletAddress;
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const imageSize = isMobile ? 96 : 192;
  const token = useSelector((state) => state.auth.token);
  const [isProfilePhotoPreviewOpen, setIsProfilePhotoPreviewOpen] =
    useState(false);
  const [isCoverPhotoPreviewOpen, setIsCoverPhotoPreviewOpen] = useState(false);
  const [isFollowings, setIsFollowings] = useState(
    loggedUser?.followings.filter((e) => e === user._id).length !== 0
  );
  useEffect(() => {
    setIsFollowings(
      loggedUser?.followings.filter((e) => e === user._id).length !== 0
    );
  }, [loggedUser?.followings]);
  const UserNameAndWallet = () => {
    return (
      <Box pt={(1 * imageSize) / 2.5 + "px"}>
        <Text fontWeight={"bold"} fontSize={"2xl"} lineHeight={1}>
          @{user?.username}
        </Text>
        <Flex alignItems={"center"}>
          {!!user?.walletAddress && (
            <Web3Address address={user?.walletAddress} />
          )}
          <IconButton
            size={"sm"}
            onClick={() => {
              navigator.clipboard.writeText(user?.walletAddress);
            }}
            cursor={"pointer"}
            variant={"ghost"}
            as={IoCopyOutline}
            p={1}
          />
        </Flex>
      </Box>
    );
  };

  return (
    user && (
      <>
        <ImagePreviewer
          image={user.profilePicturePath}
          isOpen={isProfilePhotoPreviewOpen}
          setOpen={setIsProfilePhotoPreviewOpen}
        />
        <ImagePreviewer
          image={user.coverPicturePath}
          isOpen={isCoverPhotoPreviewOpen}
          setOpen={setIsCoverPhotoPreviewOpen}
        />
        <Box
          position={"relative"}
          mb={!isMobile ? (2 * imageSize) / 3 + "px" : "0"}
        >
          <AspectRatio
            ratio={3 / 1}
            width={"100%"}
            maxW={"100%"}
            position={"relative"}
          >
            <Image
              src={user.coverPicturePath}
              width={1500}
              height={500}
              className="gradient-mask"
              onClick={() => {
                setIsCoverPhotoPreviewOpen(true);
              }}
            />
          </AspectRatio>
          <Flex
            position={"absolute"}
            width={"100%"}
            bottom={-imageSize / 2 + "px"}
            justifyContent={"space-between"}
            alignItems={"end"}
            px={"1rem"}
          >
            <HStack>
              <AspectRatio
                shadow={"2xl"}
                ratio={1 / 1}
                width={imageSize + "px"}
                border={"1px solid"}
                borderColor={"whiteAlpha.600"}
                borderRadius={"10%"}
                overflow={"hidden"}
              >
                <Image
                  src={user.profilePicturePath}
                  width={400}
                  height={400}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setIsProfilePhotoPreviewOpen(true);
                  }}
                />
              </AspectRatio>
              {!isMobile && <UserNameAndWallet />}
            </HStack>

            {isOwnProfile && (
              <Flex paddingBottom={isMobile ? "0" : imageSize / 4 + "px"}>
                <Button size={"lg"} variant={"solid"}>
                  Edit Profile
                </Button>
              </Flex>
            )}
            {!isOwnProfile && (
              <Flex paddingBottom={isMobile ? "0" : imageSize / 4 + "px"}>
                <Button
                  size={"lg"}
                  variant={"solid"}
                  onClick={async () => {
                    setIsFollowings(!isFollowings);
                    await axios
                      .post(
                        `https://api.defitalks.io/api/user/follow/${user.walletAddress}`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        }
                      )
                      .then((res) => {
                        const updatedLoggedUser = res.data.user;
                        dispatch(setLoggedUser({ ...updatedLoggedUser }));
                        setUser(res.data.targetUser);
                      });
                    setIsFollowings(!isFollowings);
                  }}
                >
                  {!!loggedUser && !!loggedUser?.followings && isFollowings
                    ? "Unfollow"
                    : "Follow"}
                </Button>
              </Flex>
            )}
          </Flex>
        </Box>
        <Box px={4} mt="6">
          {isMobile && <UserNameAndWallet />}
        </Box>
        <Box px="4">
          <Flex justifyContent={"space-between"}>
            <Text>{user?.biography}</Text>
          </Flex>
        </Box>
        <Box px="4" my={"4"}>
          <Flex justifyContent={"space-between"}>
            <ButtonGroup spacing={4}>
              {user?.followers && (
                <Button variant={"ghost"} leftIcon={<IoPerson />}>
                  {user?.followers.length} Followers
                </Button>
              )}
              {user?.followings && (
                <Button variant={"ghost"} leftIcon={<IoPerson />}>
                  {user?.followings.length} Followings
                </Button>
              )}
            </ButtonGroup>
            <HStack m={1}>
              <IconButton size="sm" icon={<FaTelegramPlane />} />
              <IconButton size="sm" icon={<FaTwitter />} />
              <IconButton size="sm" icon={<FaDiscord />} />
            </HStack>
          </Flex>
        </Box>
        <Divider />
      </>
    )
  );
};

export default UserHeader;
