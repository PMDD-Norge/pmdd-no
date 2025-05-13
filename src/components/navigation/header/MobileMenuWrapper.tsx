"use client";

import dynamic from "next/dynamic";

const MobileMenu = dynamic(() => import("./MobileMenu"), {
  ssr: false,
  loading: () => null,
});

export default MobileMenu;
