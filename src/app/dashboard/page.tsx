'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AccountSettings from '@/components/dashboard/AccountSettings';
import ActivityHistory from '@/components/dashboard/ActivityHistory';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'history' | 'settings'>('history');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <DashboardHeader />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Tab Navigation */}
          <div className="mb-8 border-b border-border">
            <nav className="flex gap-8" aria-label="Dashboard tabs">
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-4 px-2 font-medium text-base transition-colors relative ${
                  activeTab === 'history'
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Activity & History
                {activeTab === 'history' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-4 px-2 font-medium text-base transition-colors relative ${
                  activeTab === 'settings'
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Account Settings
                {activeTab === 'settings' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
                )}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'history' && <ActivityHistory />}
            {activeTab === 'settings' && <AccountSettings />}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
