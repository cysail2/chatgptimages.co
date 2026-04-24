'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EditButtonProps {
  pageId: string;
  className?: string;
}

export function EditButton({ pageId, className }: EditButtonProps) {
  const router = useRouter();
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev) {
    return null;
  }

  const handleEdit = () => {
    router.push(`/website/pages/${pageId}/page-builder-editor`);
  };

  return (
    <Button
      onClick={handleEdit}
      variant="outline"
      size="sm"
      className={cn(
        "fixed bottom-4 right-4 z-50 shadow-lg",
        "bg-white hover:bg-gray-50",
        "border-2 border-primary",
        className
      )}
    >
      <Edit className="h-4 w-4 mr-2" />
      编辑页面
    </Button>
  );
}
