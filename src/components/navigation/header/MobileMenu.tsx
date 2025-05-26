"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./header.module.css";
import { PageLinks, PageCTAs } from "./components/links";
import { SanityLink } from "@/sanity/lib/interfaces/siteSettings";

interface Props {
  sidebarLinks: SanityLink[];
  sidebarCtas: SanityLink[];
}

const MobileMenu = ({ sidebarLinks, sidebarCtas }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Simple function to close the mobile menu and notify other components
  const closeMobileMenu = useCallback(() => {
    // Hide menu first
    setIsMenuOpen(false);

    // Notify button component to update its state
    window.dispatchEvent(
      new CustomEvent("toggle-mobile-menu-complete", { detail: false })
    );

    // Re-enable scrolling after a short delay
    setTimeout(() => {
      document.body.style.overflow = "";
    }, 200);
  }, []);

  // Handle menu toggle event from button
  useEffect(() => {
    const handleToggle = (event: CustomEvent) => {
      setIsMenuOpen(event.detail);

      // Lock scrolling when menu is open
      if (event.detail) {
        document.body.style.overflow = "hidden";
      }
    };

    window.addEventListener(
      "toggle-mobile-menu",
      handleToggle as EventListener
    );

    return () => {
      // Always restore scrolling on unmount
      document.body.style.overflow = "";
      window.removeEventListener(
        "toggle-mobile-menu",
        handleToggle as EventListener
      );
    };
  }, []);

  // Add keyboard trap within the menu while allowing menu button to be accessible
  useEffect(() => {
    if (!isMenuOpen) return;

    // Handle basic keyboard navigation - simplified to avoid errors
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on escape key
      if (e.key === "Escape" && isMenuOpen) {
        closeMobileMenu();
      }
    };

    // Let navigation happen without interfering
    const handleLinkClick = (e: MouseEvent) => {
      if (!isMenuOpen) return;

      const target = e.target as HTMLElement;
      const linkElement = target.closest("a");

      if (linkElement) {
        // Only make the menu visually hidden
        if (menuRef.current) {
          menuRef.current.style.opacity = "0";
        }

        // Release scroll lock to prevent body from being frozen
        document.body.style.overflow = "";

        // Don't update any other state - let navigation proceed normally
      }
    };

    // This will run after navigation is complete
    const handleNavigation = () => {
      if (isMenuOpen) {
        // Now it's safe to fully close the menu
        // This happens after navigation has occurred
        setTimeout(() => {
          closeMobileMenu();
        }, 800); // Longer delay to account for page transition animations
      }
    };

    // Set up all event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleLinkClick);
    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("pushState", handleNavigation);
    window.addEventListener("replaceState", handleNavigation);

    // Override history methods to detect navigation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      window.dispatchEvent(new Event("pushState"));
    };

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event("replaceState"));
    };

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleLinkClick);
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("pushState", handleNavigation);
      window.removeEventListener("replaceState", handleNavigation);

      // Restore original history methods
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [isMenuOpen, closeMobileMenu]);

  if (!isMenuOpen) return null;

  return (
    <div
      ref={menuRef}
      id="mobile-menu"
      className={styles.mobileMenu}
      role="dialog"
      aria-label="Mobile menu"
      aria-modal="true"
    >
      <div className={styles.mobileMenuContent}>
        <PageLinks links={sidebarLinks} isMobile />
        <PageCTAs ctas={sidebarCtas} isMobile />
      </div>
    </div>
  );
};

export default MobileMenu;
