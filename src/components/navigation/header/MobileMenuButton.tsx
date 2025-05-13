"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./header.module.css";

export const MobileMenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Listen for menu state changes
  useEffect(() => {
    const handleMenuStateChange = (event: CustomEvent) => {
      setIsOpen(event.detail);
    };

    // Listen for both toggle events and complete events
    window.addEventListener(
      "toggle-mobile-menu-complete",
      handleMenuStateChange as EventListener
    );
    
    return () => {
      window.removeEventListener(
        "toggle-mobile-menu-complete",
        handleMenuStateChange as EventListener
      );
    };
  }, []);

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    window.dispatchEvent(
      new CustomEvent("toggle-mobile-menu", { detail: newState })
    );
  };

  return (
    <button
      ref={buttonRef}
      aria-haspopup="dialog"
      aria-controls="mobile-menu"
      aria-expanded={isOpen}
      onClick={toggleMenu}
      className={isOpen ? styles.open : styles.closed}
    >
      <span className="sr-only">Toggle mobile menu</span>
    </button>
  );
};
