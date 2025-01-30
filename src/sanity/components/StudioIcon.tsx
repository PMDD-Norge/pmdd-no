"use client";

import Image from "next/image";

const StudioIcon = () => {
  return (
    <Image
      alt=""
      width={540}
      height={540}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
      src="/_assets/favikon.png"
    />
  );
};

export default StudioIcon;
