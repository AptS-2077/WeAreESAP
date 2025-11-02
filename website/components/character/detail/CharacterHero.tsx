// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Character } from "@/types/character";
import Link from "next/link";

interface CharacterHeroProps {
  character: Character;
}

export function CharacterHero({ character }: CharacterHeroProps) {
  return (
    <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* 背景图片 */}
      {character.backgroundImage && (
        <Image
          src={character.backgroundImage}
          alt={character.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      )}

      {/* 渐变遮罩 */}
      <div
        className="absolute inset-0"
        style={{
          background: character.backgroundImage
            ? `linear-gradient(135deg, ${character.color.primary}30, ${character.color.dark}50)`
            : `linear-gradient(135deg, ${character.color.primary}40, ${character.color.dark}60)`,
        }}
      />

      {/* 返回按钮 */}
      <Link
        href="/characters"
        className="absolute top-8 left-8 z-20 px-4 py-2 rounded-lg bg-black/50 dark:bg-black/70 backdrop-blur-md text-white hover:bg-black/70 dark:hover:bg-black/90 transition-all"
      >
        ← 返回列表
      </Link>

      {/* 内容区域 */}
      <motion.div
        className="relative z-10 text-center text-white px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          textShadow: "0 4px 20px rgba(0,0,0,0.9)",
        }}
      >
        {/* 装饰线 */}
        <motion.div
          className="w-24 h-1 rounded-full mx-auto mb-8"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            background: `linear-gradient(90deg, ${character.color.primary}, ${character.color.dark})`,
          }}
        />

        {/* 角色代号 */}
        <motion.div
          className="text-3xl md:text-4xl font-mono font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ color: character.color.primary }}
        >
          {character.code}
        </motion.div>

        {/* 角色名称 */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {character.name}
        </motion.h1>

        {/* 角色定位 */}
        <motion.div
          className="text-2xl md:text-3xl mb-8 opacity-90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {character.role}
        </motion.div>

        {/* 角色引言 */}
        <motion.p
          className="text-xl md:text-2xl italic opacity-80 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          &quot;{character.quote}&quot;
        </motion.p>

        {/* 关键词标签 */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {character.keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-5 py-2 rounded-full text-sm md:text-base font-medium backdrop-blur-md bg-black/30 dark:bg-black/50"
              style={{
                color: character.color.primary,
                border: `2px solid ${character.color.primary}90`,
              }}
            >
              {keyword}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* 底部渐变（可选） */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to top, var(--background), transparent)`,
        }}
      />
    </section>
  );
}
