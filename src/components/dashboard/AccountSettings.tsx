'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  changeEmail,
  changePassword,
  deleteAccount,
  reauthenticate,
} from '@/lib/auth-utils';
import { getUserDashboardData } from '@/lib/dashboard';
import type { DashboardStats } from '@/types/dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  EnvelopeIcon,
  KeyIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  ChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function AccountSettings() {
  const { user } = useAuth();
  const router = useRouter();

  // Stats state
  const [stats, setStats] = useState<DashboardStats>({
    totalSitesAnalyzed: 0,
    averageEcoScore: 0,
    highScoreSites: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      if (!user) {
        setStats({ totalSitesAnalyzed: 0, averageEcoScore: 0, highScoreSites: 0 });
        setStatsLoading(false);
        return;
      }

      try {
        const res = await getUserDashboardData();
        if (!res) {
          setStats({ totalSitesAnalyzed: 0, averageEcoScore: 0, highScoreSites: 0 });
        } else {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Error loading stats data', err);
        setStats({ totalSitesAnalyzed: 0, averageEcoScore: 0, highScoreSites: 0 });
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [user]);

  // Get score color (EcoVeridian theme: Green >80, Yellow 50-79, Red <50)
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Skeleton loader for stats cards
  const StatSkeleton = () => (
    <Card className="p-6 shadow-sm animate-pulse">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-muted rounded-lg w-12 h-12" />
        <div className="flex-1">
          <div className="h-4 bg-muted rounded w-24 mb-2" />
          <div className="h-8 bg-muted rounded w-16" />
        </div>
      </div>
    </Card>
  );

  // Email update state
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Password update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Handle email update
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess(false);

    if (!newEmail) {
      setEmailError('Please enter a new email address');
      return;
    }

    setEmailLoading(true);

    try {
      const { error } = await changeEmail(newEmail);
      if (error) {
        setEmailError(error);
      } else {
        setEmailSuccess(true);
        setNewEmail('');
        setTimeout(() => setEmailSuccess(false), 5000);
      }
    } catch (err: any) {
      setEmailError(err.message || 'Failed to update email');
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      // First, re-authenticate
      const { error: reauthError } = await reauthenticate(currentPassword);
      if (reauthError) {
        setPasswordError(reauthError);
        setPasswordLoading(false);
        return;
      }

      // Then update password
      const { error } = await changePassword(newPassword);
      if (error) {
        setPasswordError(error);
      } else {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(false), 5000);
      }
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError('');

    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm');
      return;
    }

    setDeleteLoading(true);

    try {
      // First, re-authenticate
      const { error: reauthError } = await reauthenticate(deletePassword);
      if (reauthError) {
        setDeleteError(reauthError);
        setDeleteLoading(false);
        return;
      }

      // Then delete account
      const { error } = await deleteAccount();
      if (error) {
        setDeleteError(error);
        setDeleteLoading(false);
      } else {
        // Account deleted successfully, redirect to home
        router.push('/');
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete account');
      setDeleteLoading(false);
    }
  };

  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            {/* Total Sites Analyzed */}
            <Card className="p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <GlobeAltIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Sites Analyzed
                  </p>
                  <p className="text-3xl font-bold">{stats.totalSitesAnalyzed}</p>
                </div>
              </div>
            </Card>

            {/* Average Eco Score */}
            <Card className="p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Average Eco Score
                  </p>
                  <p className={`text-3xl font-bold ${getScoreColor(stats.averageEcoScore)}`}>
                    {Math.round(stats.averageEcoScore)}
                  </p>
                </div>
              </div>
            </Card>

            {/* High Score Sites */}
            <Card className="p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <SparklesIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    High Score Sites
                  </p>
                  <p className="text-3xl font-bold text-green-500">{stats.highScoreSites}</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Theme Selector Section */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <PaintBrushIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Theme Preference</h2>
            <p className="text-muted-foreground mb-4">
              Choose how EcoVeridian looks to you
            </p>

            <div className="space-y-3">
              {/* Light Theme Option */}
              <label className="flex items-center gap-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                  className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                />
                <div className="flex-1">
                  <p className="font-medium">Light</p>
                  <p className="text-sm text-muted-foreground">
                    Clean and bright interface
                  </p>
                </div>
              </label>

              {/* Dark Theme Option */}
              <label className="flex items-center gap-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                  className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                />
                <div className="flex-1">
                  <p className="font-medium">Dark</p>
                  <p className="text-sm text-muted-foreground">
                    Easy on the eyes in low light
                  </p>
                </div>
              </label>

              {/* System Theme Option */}
              <label className="flex items-center gap-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={theme === 'system'}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                  className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                />
                <div className="flex-1">
                  <p className="font-medium">System</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically match your device settings
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Update Email Section */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <EnvelopeIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Update Email</h2>
            <p className="text-muted-foreground mb-4">
              Current email: <span className="font-medium">{user?.email}</span>
            </p>

            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div>
                <label htmlFor="newEmail" className="block text-sm font-medium mb-2">
                  New Email Address
                </label>
                <input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full max-w-md px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  placeholder="new@example.com"
                />
              </div>

              {emailError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {emailError}
                </div>
              )}

              {emailSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                  <strong>Email updated successfully!</strong> Please verify your new email address by clicking the link sent to it.
                </div>
              )}

              <Button type="submit" disabled={emailLoading}>
                {emailLoading ? 'Updating...' : 'Update Email'}
              </Button>
            </form>
          </div>
        </div>
      </Card>

      {/* Change Password Section */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <KeyIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Change Password</h2>
            <p className="text-muted-foreground mb-4">
              Update your password to keep your account secure
            </p>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium mb-2"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full max-w-md px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full max-w-md px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full max-w-md px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {passwordError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                  <strong>Password updated successfully!</strong> Your account is now secured with the new password.
                </div>
              )}

              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Change Password'}
              </Button>
            </form>
          </div>
        </div>
      </Card>

      {/* Delete Account Section */}
      <Card className="p-6 shadow-sm border-red-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 rounded-lg">
            <TrashIcon className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2 text-red-500">Delete Account</h2>
            <p className="text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This action cannot be
              undone. For more information about data deletion, see our{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>.
            </p>

            {!showDeleteConfirm ? (
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="border-red-500/50 text-red-500 hover:bg-red-500/10"
              >
                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            ) : (
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm font-medium text-red-500 mb-2">
                    ⚠️ This action is permanent and cannot be undone
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enter your password to confirm account deletion
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="deletePassword"
                    className="block text-sm font-medium mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="deletePassword"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full max-w-md px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                {deleteError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                    {deleteError}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={deleteLoading}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    {deleteLoading ? 'Deleting...' : 'Confirm Deletion'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword('');
                      setDeleteError('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
