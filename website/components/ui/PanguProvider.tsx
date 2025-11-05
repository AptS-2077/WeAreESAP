// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { usePangu } from "@/hooks/usePangu";

/**
 * Pangu Provider 组件
 * 自动为页面中的中英文、数字之间添加空格
 */
export function PanguProvider() {
  usePangu();
  return null;
}
