// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Character } from "@/types/character";
import {
  CharacterHero,
  CharacterInfo,
  CharacterStory,
  CharacterAbilities,
  CharacterRelationships,
} from "@/components/character/detail";

// 生成元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) {
    return {
      title: "角色未找到 - We Are ESAP",
    };
  }

  return {
    title: `${character.name} (${character.code}) - We Are ESAP`,
    description: `${character.description} - ${character.quote}`,
  };
}

// 获取单个角色数据
async function getCharacter(id: string): Promise<Character | null> {
  try {
    const fs = require("fs/promises");
    const path = require("path");

    const filePath = path.join(
      process.cwd(),
      "data",
      "characters",
      `${id}.json`
    );
    const fileContent = await fs.readFile(filePath, "utf-8");
    const character: Character = JSON.parse(fileContent);

    return character;
  } catch (error) {
    console.error(`获取角色 ${id} 失败:`, error);
    return null;
  }
}

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Hero 区域 */}
      <CharacterHero character={character} />

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-20">
          {/* 基本信息 */}
          <CharacterInfo character={character} />

          {/* 角色故事 */}
          <CharacterStory character={character} />

          {/* 能力设定 */}
          <CharacterAbilities character={character} />

          {/* 人际关系 */}
          <CharacterRelationships character={character} />
        </div>
      </div>

      {/* 底部间距 */}
      <div className="h-20" />
    </main>
  );
}
