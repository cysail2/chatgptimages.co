'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnchorScrollHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 等待页面渲染完成后再滚动
    const timer = setTimeout(() => {
      const hash = window.location.hash;
      
      if (hash) {
        const targetId = hash.substring(1); // 移除 # 符号
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    }, 100); // 延迟 100ms 确保 DOM 已渲染

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
