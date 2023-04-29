import LoginStepper from "@/components/auth/LoginStepper";
import PageLayout from "@/views/Layout";
import Head from "next/head";
import React from "react";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login | DeFiTalks</title>
      </Head>
      <PageLayout title={"Login"}>
        <LoginStepper />
      </PageLayout>
    </>
  );
};

export default LoginPage;
