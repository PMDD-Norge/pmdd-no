"use client";

import { useState } from "react";
import Button from "@/components/buttons/Button";
import BlomstModal from "./BlomstModal";
import { SanityLink } from "@/sanity/lib/interfaces/siteSettings";

interface Props {
  callToAction?: SanityLink;
}

export default function PlantBlomstKnapp({ callToAction }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} type="primary" size="small">
        Plant en blomst
      </Button>
      <BlomstModal isOpen={isOpen} onClose={() => setIsOpen(false)} callToAction={callToAction} />
    </>
  );
}
