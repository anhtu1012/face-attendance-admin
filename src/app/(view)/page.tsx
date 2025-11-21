import React from "react";
import WelcomePage from "./WelcomePage";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";

function Page() {
  return <LayoutContent layoutType={1} content1={<WelcomePage />} />;
}

export default Page;
