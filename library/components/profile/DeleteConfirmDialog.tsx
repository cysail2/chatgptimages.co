'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/library/ui/dialog";
import { Button } from "@/library/ui/button";
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from '@/library/ui/toast-provider';
import { api } from '@/library/services/api';
import { GenerationHistoryItem } from './types';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: GenerationHistoryItem | null;
  onDeleteSuccess: () => void;
}

export function DeleteConfirmDialog({ open, onOpenChange, item, onDeleteSuccess }: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const handleDelete = async () => {
    if (!item) return;

    setIsDeleting(true);
    try {
      const result = await api.user.deleteOpus(item.id);
      if (result.code === 200) {
        toast.success('Successfully deleted!');
        onOpenChange(false);
        onDeleteSuccess();
      } else {
        toast.error('Failed to delete: ' + (result.msg || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to delete opus:', error);
      toast.error('Failed to delete: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">Confirm Delete</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Are you sure you want to delete this video? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <ReloadIcon className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

