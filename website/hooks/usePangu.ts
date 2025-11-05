// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect } from "react";
import { pangu } from "pangu/browser";

/**
 * 自动为页面中的中英文、数字之间添加空格
 * 使用 MutationObserver 监听 DOM 变化，实时格式化
 *
 * 性能优化方案：
 * 1. 使用 requestIdleCallback 在浏览器空闲时格式化
 * 2. 避免阻塞首屏渲染
 *
 * 因為愛情跟書寫都需要適時地留白。
 */
export function usePangu() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // 使用 requestIdleCallback 在浏览器空闲时格式化，避免阻塞渲染
    const scheduleFormat = (callback: () => void) => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(callback, { timeout: 2000 });
      } else {
        setTimeout(callback, 100);
      }
    };

    // 初始格式化：在浏览器空闲时执行
    scheduleFormat(() => {
      pangu.spacingNode(document.body);
    });

    // 启动自动监听
    // pangu.autoSpacingPage() 内部已经做了防抖，不需要额外处理
    scheduleFormat(() => {
      pangu.autoSpacingPage();
    });

    // 注意：pangu.autoSpacingPage() 会启动一个全局的 MutationObserver
    // 不需要手动清理，它会在页面生命周期内一直运行
  }, []);
}
