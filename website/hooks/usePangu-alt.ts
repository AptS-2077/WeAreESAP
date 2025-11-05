// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect } from "react";
import { pangu } from "pangu/browser";

/**
 * 轻量级版本：只在路由切换时格式化
 *
 * 适合内容不经常动态变化的页面
 * 性能开销最小，但不会监听 DOM 变化
 *
 * 因為愛情跟書寫都需要適時地留白。
 */
export function usePanguLight() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // 使用 requestIdleCallback 延迟格式化
    const scheduleFormat = () => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => pangu.spacingNode(document.body), {
          timeout: 2000,
        });
      } else {
        setTimeout(() => pangu.spacingNode(document.body), 100);
      }
    };

    scheduleFormat();
  }, []); // 只在组件挂载时执行一次
}

/**
 * 完整版本：实时监听 DOM 变化
 *
 * 适合内容经常动态变化的页面（如评论区、实时更新等）
 * 性能开销较大，但能处理所有动态内容
 *
 * 因為愛情跟書寫都需要適時地留白。
 */
export function usePanguFull() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // 初始格式化 + 启动监听
    const scheduleFormat = (callback: () => void) => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(callback, { timeout: 2000 });
      } else {
        setTimeout(callback, 100);
      }
    };

    scheduleFormat(() => {
      pangu.spacingNode(document.body);
      pangu.autoSpacingPage();
    });
  }, []);
}

// 默认导出轻量级版本
export const usePangu = usePanguLight;
