// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useRouter } from "next/navigation";
import {
  CharacterAccordion,
  CharacterMobileView,
} from "@/components/character";
import { CharacterCardData } from "@/types/character";

interface CharactersClientProps {
  characters: CharacterCardData[];
}

export function CharactersClient({ characters }: CharactersClientProps) {
  const router = useRouter();

  const handleCharacterClick = (characterId: string) => {
    router.push(`/characters/${characterId}`);
  };

  return (
    <>
      {/* 桌面端：手风琴展示 */}
      <section className="hidden md:block">
        <CharacterAccordion
          characters={characters}
          onCharacterClick={handleCharacterClick}
        />
      </section>

      {/* 移动端：卡片列表 */}
      <section className="md:hidden py-8">
        <CharacterMobileView
          characters={characters}
          onCharacterClick={handleCharacterClick}
        />
      </section>
    </>
  );
}
