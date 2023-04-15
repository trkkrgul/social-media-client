import LoginStepper from "@/components/auth/LoginStepper";
import { NavItem } from "@saas-ui/sidebar";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  if (!user) return <LoginStepper />;
  return (
    <>
      {user.isProfileCreated ? (
        <div>Profile</div>
      ) : (
        <NavItem href={null} onClick={() => router.push("/profile/create")}>
          Create Profile
        </NavItem>
      )}
      <div>{JSON.stringify(user)}</div>
    </>
  );
};

export default Profile;
