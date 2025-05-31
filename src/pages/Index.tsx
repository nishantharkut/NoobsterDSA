
import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import AuthPage from '@/components/auth/AuthPage';
import LearningDashboard from '@/components/learning/LearningDashboard';
import ProgressAnalytics from '@/components/learning/ProgressAnalytics';
import CodeEditor from '@/components/coding/CodeEditor';
import UserProfile from '@/components/profile/UserProfile';
import Header from '@/components/layout/Header';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, isLoading } = useAuth();
  const [currentSection, setCurrentSection] = useState('dashboard');

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Show auth page if user is not logged in
  if (!user) {
    return <AuthPage />;
  }

  // Mock user progress data for demonstration
  const mockUserProgress = {
    streakDays: user.profile.streak,
    totalProblemsSolved: user.profile.totalProblems,
    totalProblemsAttempted: user.profile.totalProblems + 5,
    weeklyGoal: 10,
    currentLevel: user.profile.level,
    badges: [],
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <LearningDashboard />;
      case 'practice':
        return <CodeEditor />;
      case 'progress':
        return <ProgressAnalytics userProgress={mockUserProgress} />;
      case 'learning':
        return <LearningDashboard />;
      case 'profile':
        return <UserProfile />;
      case 'settings':
        return <UserProfile />;
      default:
        return <LearningDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={setCurrentSection} currentSection={currentSection} />
      <main className="container mx-auto px-4 py-6">
        {renderCurrentSection()}
      </main>
    </div>
  );
};

export default Index;
