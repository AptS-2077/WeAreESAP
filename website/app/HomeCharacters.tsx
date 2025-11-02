// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useRouter } from "next/navigation";
import { CharacterAccordion, CharacterMobileView } from "@/components";
import { CharacterCardData } from "@/types/character";

interface HomeCharactersProps {
  characters: CharacterCardData[];
}

export function HomeCharacters({ characters }: HomeCharactersProps) {
  const router = useRouter();

  const handleCharacterClick = (characterId: string) => {
    router.push(`/characters/${characterId}`);
  };

  return (
    <>
      {/* 桌面端：横向手风琴 */}
      <div className="hidden md:block">
        <CharacterAccordion
          characters={characters}
          onCharacterClick={handleCharacterClick}
        />
      </div>

      {/* 移动端：垂直卡片 */}
      <div className="block md:hidden">
        <CharacterMobileView
          characters={characters}
          onCharacterClick={handleCharacterClick}
        />
      </div>
    </>
  );
}
