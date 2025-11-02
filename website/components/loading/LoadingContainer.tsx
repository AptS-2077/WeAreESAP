// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingContainerProps {
  /** 加载文本 */
  text?: string;
  /** LOGO 大小 */
  size?: number;
  /** 最小高度 */
  minHeight?: string;
  /** 类名 */
  className?: string;
}

/**
 * 区块加载组件
 * 用于页面某个区域的加载状态（如时间线、技术设定）
 */
export function LoadingContainer({
  text = "加载中...",
  size = 120,
  minHeight = "400px",
  className = "",
}: LoadingContainerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 ${className}`}
      style={{ minHeight }}
    >
      <LoadingSpinner size={size} withPulse={true} />
      {text && (
        <p className="text-lg font-medium text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
