// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode, AnchorHTMLAttributes } from "react";
import { useTransition } from "./TransitionContext";

interface TransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
}

/**
 * 带过渡效果的链接组件
 * 点击时触发 LOGO 动画，然后跳转到新页面
 */
export function TransitionLink({
  href,
  children,
  onClick,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();
  const { setIsTransitioning } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // 如果有自定义 onClick，先执行
    if (onClick) {
      onClick(e);
    }

    // 如果是外部链接或特殊按键，使用默认行为
    if (
      href.startsWith("http") ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    e.preventDefault();

    // 如果是当前页面，不执行跳转
    if (window.location.pathname === href) {
      return;
    }

    // 触发过渡动画
    setIsTransitioning(true);

    // 延迟跳转，让动画播放
    setTimeout(() => {
      router.push(href);

      // 跳转后稍等一下再关闭动画（让新页面开始加载）
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 400); // 与 LOGO 动画时长同步
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
