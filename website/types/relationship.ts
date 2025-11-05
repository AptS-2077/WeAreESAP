// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

/**
 * 关系类型定义
 */

export type RelationshipType =
  | "creator" // 创造关系
  | "family" // 家庭/亲属关系
  | "work" // 工作关系
  | "friend" // 友谊关系
  | "mentor" // 导师关系
  | "rival" // 竞争/对立关系
  | "unknown"; // 未知类型

/**
 * 单个关系数据
 */
export interface Relationship {
  /** 目标角色 ID */
  targetId: string;
  /** 关系类型 */
  type: RelationshipType;
  /** 关系简短标签 */
  label: string;
  /** 关系详细描述 */
  description: string;
}

/**
 * 角色关系数据文件结构
 */
export interface CharacterRelationshipData {
  /** 当前角色 ID */
  characterId: string;
  /** 关系列表 */
  relationships: Relationship[];
}
