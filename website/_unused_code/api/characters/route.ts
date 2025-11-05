// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { NextResponse } from "next/server";
import { Character, CharacterResponse } from "@/types/character";
import fs from "fs/promises";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 从 URL 查询参数获取 locale，默认为 zh-CN
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "zh-CN";

    // 尝试读取指定语言的文件
    let filePath = path.join(
      process.cwd(),
      "data",
      "characters",
      locale,
      `${id}.json`
    );

    // 检查文件是否存在，不存在则回退到 zh-CN
    try {
      await fs.access(filePath);
    } catch {
      console.log(`角色文件 ${locale}/${id}.json 不存在，回退到 zh-CN`);
      filePath = path.join(
        process.cwd(),
        "data",
        "characters",
        "zh-CN",
        `${id}.json`
      );
    }

    const fileContent = await fs.readFile(filePath, "utf-8");
    const character: Character = JSON.parse(fileContent);

    const response: CharacterResponse = {
      character,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("获取角色详情失败:", error);
    return NextResponse.json({ error: "角色不存在" }, { status: 404 });
  }
}
