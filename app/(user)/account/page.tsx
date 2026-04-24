"use client";

import { useEffect, useState, useCallback } from 'react';
import { useUserInfo } from '@/library/providers';
import { Button } from '@/library/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/library/ui/dialog";
import { usePathname } from 'next/navigation';
import { ReloadIcon } from '@radix-ui/react-icons';
import { api } from '@/library/services/api';
import { useToast } from '@/library/ui/toast-provider';
import {
  PayLogDialog,
  PointsLogDialog,
  InvoiceDialog,
} from '@/library/components/profile';
import {
  UserApiInfo,
  PayLogItem,
} from '@/library/components/profile/types';
import {
  User,
  CreditCard,
  History,
  AlertTriangle,
  Mail,
  Shield,
  Crown,
  Coins
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/library/ui/card';

export default function AccountPage() {
  const { userInfo, isLoadingUserInfo, isSignedIn, openSignIn, signOut } = useUserInfo();
  const userId = userInfo?.uuid;
  const isLoaded = !isLoadingUserInfo;
  const toast = useToast();

  // API Data State
  const [userApiInfo, setUserApiInfo] = useState<UserApiInfo | null>(null);

  // Dialog States
  const [isTimesLogDialogOpen, setIsTimesLogDialogOpen] = useState(false);
  const [isPayLogDialogOpen, setIsPayLogDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [selectedPayLogId, setSelectedPayLogId] = useState<number | null>(null);
  const [payLogList, setPayLogList] = useState<PayLogItem[]>([]); // For InvoiceDialog

  // Close Account States
  const [isCloseAccountDialogOpen, setIsCloseAccountDialogOpen] = useState(false);
  const [isClosingAccount, setIsClosingAccount] = useState(false);

  // Dialog Handlers
  const handleOpenTimesLogDialog = () => setIsTimesLogDialogOpen(true);
  const handleOpenPayLogDialog = () => setIsPayLogDialogOpen(true);

  const handleOpenInvoiceDialog = (payLogId: number) => {
    setSelectedPayLogId(payLogId);
    setIsInvoiceDialogOpen(true);
  };

  // Fetch User Info Effect
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isLoaded || !userId) {
        setUserApiInfo(null);
        return;
      }

      try {
        const result = await api.user.getUserInfo();
        if (result.code === 200 && result.data) {
          setUserApiInfo({
            ...result.data,
            free_times: result.data.free_times ?? 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user API info:", error);
      }
    };

    fetchUserInfo();
  }, [isLoaded, userId]);

  // Handle Close Account
  const handleConfirmCloseAccount = useCallback(async () => {
    setIsClosingAccount(true);
    try {
      const result = await api.user.closeAccount();
      if (result.code === 200) {
        toast.success('Account closed successfully');
        api.auth.clearTokens();
        signOut();
      } else {
        toast.error(result.msg || 'Failed to close account');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to close account');
    } finally {
      setIsClosingAccount(false);
      setIsCloseAccountDialogOpen(false);
    }
  }, [signOut, toast]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ReloadIcon className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Please sign in to view your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => openSignIn()} className="w-full">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getUserLevelName = (level: number | undefined) => {
    switch (level) {
      case 0: return 'Free';
      case 1: return 'Starter';
      case 2: return 'Pro';
      case 3: return 'Ultimate';
      default: return 'Free';
    }
  };
  const userLevelName = getUserLevelName(userApiInfo?.level);
  const totalPoints = (userApiInfo?.total_limit || 0) + (userApiInfo?.free_limit || 0);
  const remainingPoints = (userApiInfo?.remaining_limit || 0) + (userApiInfo?.free_limit || 0);

  return (
    <div className="min-h-screen bg-background pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Helper Title */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your profile, subscription, and account security.</p>
        </div>

        {/* 1. Profile Section */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Personal Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Info
              </CardTitle>
              <CardDescription>Basic info used to personalize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-border flex-shrink-0">
                  <img
                    src={userInfo?.avatar}
                    alt={userInfo?.nickname || 'User'}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{userInfo?.nickname || userInfo?.email}</h3>
                  <div className="flex items-center text-muted-foreground text-sm gap-2">
                    <Mail className="h-4 w-4" />
                    {userInfo?.email}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Membership Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-orange-500" />
                Membership
              </CardTitle>
              <CardDescription>Your current plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Current Plan</span>
                <span className="text-2xl font-bold text-primary">{userLevelName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Active Account</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. Resources & Usage Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              Resources & Usage
            </CardTitle>
            <CardDescription>Track your points and usage history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Remaining Points</span>
                <div className="text-2xl font-bold">{remainingPoints}</div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Used Points</span>
                <div className="text-2xl font-bold">{userApiInfo?.use_limit || 0}</div>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Total Allocated</span>
                <div className="text-2xl font-bold">{totalPoints}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleOpenTimesLogDialog} className="gap-2">
              <History className="h-4 w-4" />
              View Points History
            </Button>
            <Button variant="outline" size="sm" onClick={handleOpenPayLogDialog} className="gap-2">
              <CreditCard className="h-4 w-4" />
              View Payment History
            </Button>
          </CardFooter>
        </Card>

        {/* 3. Dangerous Zone */}
        <Card className="border-red-200 dark:border-red-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/10">
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-200">Delete Account</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Permanently delete your account and all of your content.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setIsCloseAccountDialogOpen(true)}
              >
                Close Account
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Dialogs */}
      <PayLogDialog
        open={isPayLogDialogOpen}
        onOpenChange={setIsPayLogDialogOpen}
        onOpenInvoiceDialog={handleOpenInvoiceDialog}
        userId={userId}
        isLoaded={isLoaded}
        onPayLogListChange={setPayLogList}
      />
      <PointsLogDialog
        open={isTimesLogDialogOpen}
        onOpenChange={setIsTimesLogDialogOpen}
        userId={userId}
        isLoaded={isLoaded}
      />
      <InvoiceDialog
        open={isInvoiceDialogOpen}
        onOpenChange={setIsInvoiceDialogOpen}
        payLogId={selectedPayLogId}
        payLogList={payLogList}
        userInfo={userInfo}
      />

      <Dialog open={isCloseAccountDialogOpen} onOpenChange={setIsCloseAccountDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Close Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to close your account? This action cannot be undone. All your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCloseAccountDialogOpen(false)} disabled={isClosingAccount}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmCloseAccount} disabled={isClosingAccount}>
              {isClosingAccount ? 'Closing...' : 'Confirm Close Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
