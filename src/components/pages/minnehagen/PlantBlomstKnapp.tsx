"use client";

import { useState } from "react";
import Button from "@/components/buttons/Button";
import BlomstModal from "./BlomstModal";

export default function PlantBlomstKnapp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} type="primary" size="small">
        Plant en blomst
      </Button>
      <BlomstModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
