import { setSessionEnd, setSignOut } from "@/state/slices/auth";
import { Box, HStack, Text } from "@chakra-ui/react";
import { Button, useSnackbar } from "@saas-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const SessionEnd = () => {
  const snackbar = useSnackbar();
  const id = "session-end";
  const router = useRouter();
  const dispatch = useDispatch();
  const sessionEnd = useSelector((state) => state.auth.sessionEnd);

  if (sessionEnd && !snackbar.isActive(id)) {
    snackbar({
      position: "top",
      id,
      title: "Session Expired",
      description: (
        <Box>
          <Text>
            Your session has expired. Please login to continue using the app.
          </Text>
          <Button
            variant={"solid"}
            colorScheme="primary"
            onClick={(e) => {
              dispatch(setSignOut());
              dispatch(setSessionEnd(false));
              router.push("/login");
            }}
          >
            Login
          </Button>
        </Box>
      ),
      status: "warning",
      duration: 9000,

      isClosable: true,
    });
  }

  return null;
};

export default SessionEnd;
