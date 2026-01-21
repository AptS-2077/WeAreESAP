// Copyright 2025 The ESAP Project
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState, memo, useCallback, useMemo } from "react";
import { Organization } from "@/types/organization";
import { Icon } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FADE_THRESHOLD = 50;
const OPACITY_EPSILON = 0.01;

interface OrganizationTabsProps {
  organizations: Organization[];
  activeId: string;
  onTabChange: (id: string) => void;
}

export const OrganizationTabs = memo(function OrganizationTabs({
  organizations,
  activeId,
  onTabChange,
}: OrganizationTabsProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [leftGradientOpacity, setLeftGradientOpacity] = useState(0);
  const [rightGradientOpacity, setRightGradientOpacity] = useState(0);

  const activeIndex = useMemo(
    () => organizations.findIndex((o) => o.id === activeId),
    [organizations, activeId]
  );

  const checkScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    let newLeftOpacity = 0;
    if (scrollLeft <= 0) {
      newLeftOpacity = 0;
    } else if (scrollLeft < FADE_THRESHOLD) {
      newLeftOpacity = scrollLeft / FADE_THRESHOLD;
    } else {
      newLeftOpacity = 1;
    }

    const scrollRight = scrollWidth - clientWidth - scrollLeft;
    let newRightOpacity = 0;
    if (scrollRight <= 1) {
      newRightOpacity = 0;
    } else if (scrollRight < FADE_THRESHOLD) {
      newRightOpacity = scrollRight / FADE_THRESHOLD;
    } else {
      newRightOpacity = 1;
    }

    setLeftGradientOpacity((prev) =>
      Math.abs(prev - newLeftOpacity) > OPACITY_EPSILON ? newLeftOpacity : prev
    );
    setRightGradientOpacity((prev) =>
      Math.abs(prev - newRightOpacity) > OPACITY_EPSILON
        ? newRightOpacity
        : prev
    );
  }, []);

  useEffect(() => {
    const activeTab = tabRefs.current[activeIndex];
    if (activeTab && containerRef.current) {
      activeTab.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeIndex, shouldReduceMotion]);

  const gradientTransition = useMemo(
    () => ({
      duration: shouldReduceMotion ? 0.01 : 0.15,
      ease: "easeInOut" as const,
    }),
    [shouldReduceMotion]
  );

  const underlineTransition = useMemo(
    () =>
      shouldReduceMotion
        ? { duration: 0.01 }
        : {
            type: "spring" as const,
            stiffness: 500,
            damping: 30,
          },
    [shouldReduceMotion]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  return (
    <>
      <style jsx>{`
        .org-tabs-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="border-b border-border bg-background sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <motion.div
              animate={{ opacity: leftGradientOpacity }}
              transition={gradientTransition}
              className="absolute left-0 top-0 h-full w-20 pointer-events-none z-10 bg-linear-to-r from-background via-background/80 to-transparent"
              style={{ display: leftGradientOpacity === 0 ? "none" : "block" }}
            />

            <motion.div
              animate={{ opacity: rightGradientOpacity }}
              transition={gradientTransition}
              className="absolute right-0 top-0 h-full w-20 pointer-events-none z-10 bg-linear-to-l from-background via-background/80 to-transparent"
              style={{ display: rightGradientOpacity === 0 ? "none" : "block" }}
            />

            <div
              ref={containerRef}
              className="org-tabs-container flex gap-1 overflow-x-auto"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {organizations.map((org, index) => {
                const isActive = org.id === activeId;

                return (
                  <button
                    key={org.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    onClick={() => onTabChange(org.id)}
                    className={`relative px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {org.icon && (
                        <Icon
                          name={org.icon}
                          size={20}
                          color={isActive ? org.theme.accent : undefined}
                          className={!isActive ? "text-current" : ""}
                        />
                      )}
                      {org.info.name}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="activeOrgTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{
                          background: `linear-gradient(90deg, ${org.theme.primary}, ${org.theme.accent})`,
                        }}
                        transition={underlineTransition}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
