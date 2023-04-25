import LoginStepper from "@/components/auth/LoginStepper";
import PageLayout from "@/views/Layout";
import React from "react";

const LoginPage = () => {
  return (
    <PageLayout title={"Login"}>
      <LoginStepper />
    </PageLayout>
  );
};

export default LoginPage;
