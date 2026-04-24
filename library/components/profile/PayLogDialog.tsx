'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/library/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/library/ui/pagination";
import { Button } from "@/library/ui/button";
import { ReloadIcon } from '@radix-ui/react-icons';
import { api } from '@/library/services/api';
import { PayLogItem } from './types';
import { formatTimestamp, getPriceFromPriceId, getPaginationItems, dialogTable } from './utils';

interface PayLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenInvoiceDialog: (payLogId: number) => void;
  userId: string | null | undefined;
  isLoaded: boolean;
  onPayLogListChange?: (list: PayLogItem[]) => void;
}

export function PayLogDialog({ open, onOpenChange, onOpenInvoiceDialog, userId, isLoaded, onPayLogListChange }: PayLogDialogProps) {
  const [payLogList, setPayLogList] = useState<PayLogItem[]>([]);
  const [isLoadingPayLog, setIsLoadingPayLog] = useState(false);
  const [payLogError, setPayLogError] = useState<string | null>(null);
  const [payLogCurrentPage, setPayLogCurrentPage] = useState(1);
  const [payLogTotalPages, setPayLogTotalPages] = useState(0);
  const payLogPageSize = 10;

  const fetchPayLog = async (page: number) => {
    if (!isLoaded || !userId) return;

    setIsLoadingPayLog(true);
    setPayLogError(null);
    try {
      const result = await api.user.getPayLog(page, payLogPageSize);
      if (result.code === 200 && result.data) {
        const list = result.data.list || [];
        setPayLogList(list);
        setPayLogTotalPages(result.data.total_page || 0);
        // 通知父组件更新 payLogList
        if (onPayLogListChange) {
          onPayLogListChange(list);
        }
      } else {
        setPayLogList([]);
        setPayLogTotalPages(0);
        setPayLogError(result.msg || 'Failed to fetch pay log');
      }
    } catch (error) {
      setPayLogError(error instanceof Error ? error.message : 'An unknown error occurred fetching pay log');
      setPayLogList([]);
      setPayLogTotalPages(0);
    } finally {
      setIsLoadingPayLog(false);
    }
  };

  useEffect(() => {
    if (open) {
      setPayLogCurrentPage(1);
      fetchPayLog(1);
    }
  }, [open, userId, isLoaded]);

  const handlePayLogPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= payLogTotalPages && newPage !== payLogCurrentPage) {
      setPayLogCurrentPage(newPage);
      fetchPayLog(newPage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85vh] overflow-y-auto rounded-3xl border border-border shadow-2xl bg-card/95 backdrop-blur-xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-muted/80 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted"
        style={{
          width: 'min(98vw, 1200px)',
          maxWidth: 'min(98vw, 1200px)',
          minWidth: '360px'
        }}
      >
        <DialogHeader className="text-center pb-6 border-b border-border">
          <DialogTitle className="text-2xl font-semibold text-card-foreground tracking-tight">Pay Log</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            View your payment transaction history
          </DialogDescription>
        </DialogHeader>
        <div className="pt-6">
          {isLoadingPayLog ? (
            <div className="text-center py-12">
              <ReloadIcon className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Loading...</p>
            </div>
          ) : payLogError ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <p className="text-red-400 font-medium">Failed to load: {payLogError}</p>
            </div>
          ) : payLogList.length > 0 ? (
            <>
              <div className={dialogTable.wrapper}>
                <table className={dialogTable.table} style={{ minWidth: '700px' }}>
                  <thead>
                    <tr className="border-b border-border">
                      <th className={`${dialogTable.headCell} w-1/4`}>Date</th>
                      {/* <th className={`${dialogTable.headCell} w-1/6`}>Points</th> */}
                      <th className={`${dialogTable.headCell} w-1/6`}>Price</th>
                      <th className={`${dialogTable.headCell} w-1/6 hidden sm:table-cell`}>Currency</th>
                      <th className={`${dialogTable.headCell} w-1/6 hidden sm:table-cell`}>Payment Type</th>
                      <th className={`${dialogTable.headCell} w-1/6`}>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payLogList.map((item) => (
                      <tr key={item.id} className={dialogTable.row}>
                        <td className={`${dialogTable.cell} text-muted-foreground`}>{formatTimestamp(item.created_at)}</td>
                        {/* <td className={dialogTable.cell}>
                          <span className={`${dialogTable.pillBase} bg-green-500/20 text-green-400 font-bold`}>
                            {item.amount}
                          </span>
                        </td> */}
                        <td className={`${dialogTable.cell} text-card-foreground font-medium whitespace-nowrap`}>
                          {(() => {
                            const mapped = getPriceFromPriceId(item.price_id);
                            if (mapped && mapped !== '-') return mapped;
                            return (
                              <span className="inline-block max-w-[180px] truncate align-middle" title={item.price_id || '-'}>
                                {item.price_id || '-'}
                              </span>
                            );
                          })()}
                        </td>
                        <td className={`${dialogTable.cell} text-card-foreground hidden sm:table-cell`}>{item.currency}</td>
                        <td className={`${dialogTable.cell} text-card-foreground hidden sm:table-cell`}>{item.pay_type}</td>
                        <td className={dialogTable.cell}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenInvoiceDialog(item.id)}
                            className="h-8 px-3 text-sm"
                          >
                            Invoice
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {payLogTotalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePayLogPageChange(payLogCurrentPage - 1);
                          }}
                          className={payLogCurrentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      {getPaginationItems(payLogCurrentPage, payLogTotalPages).map((item, index) => (
                        <PaginationItem key={index}>
                          {item === '...' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePayLogPageChange(item as number);
                              }}
                              isActive={item === payLogCurrentPage}
                            >
                              {item}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePayLogPageChange(payLogCurrentPage + 1);
                          }}
                          className={payLogCurrentPage >= payLogTotalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-muted-foreground text-3xl">💳</span>
              </div>
              <p className="text-muted-foreground font-medium text-lg">No payment records yet</p>
              <p className="text-muted-foreground/60 text-sm mt-1">Your payment history will appear here</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

