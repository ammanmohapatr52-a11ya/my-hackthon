import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './app/AppShell';
import { HomePage } from './pages/HomePage';
import { SolveMathPage } from './pages/SolveMathPage';
import { AskPage } from './pages/AskPage';
import { GraphSoundPage } from './pages/GraphSoundPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { VoiceLearningPage } from './pages/VoiceLearningPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { PDFScannerPage } from './pages/PDFScannerPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPage } from './pages/AdminPage';
import { NewsPage } from './pages/NewsPage';
import { ProfilePage } from './pages/ProfilePage';
import { IndiaMapPage } from './pages/IndiaMapPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminFirewallGuard } from './security/AdminFirewallGuard';
import { UserAuthGuard } from './security/UserAuthGuard';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public User Authentication Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Decoupled High-Security Admin Authentication Gateway */}
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Isolated Protected Admin Console: Completely decoupled from public AppShell */}
      <Route
        path="/admin"
        element={
          <AdminFirewallGuard>
            <AdminPage />
          </AdminFirewallGuard>
        }
      />
      <Route
        path="/admin/*"
        element={
          <AdminFirewallGuard>
            <AdminPage />
          </AdminFirewallGuard>
        }
      />

      {/* Protected Academic Application Shell (Enforces Authentication) */}
      <Route
        path="/"
        element={
          <UserAuthGuard>
            <AppShell />
          </UserAuthGuard>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="solve" element={<SolveMathPage />} />
        <Route path="ask" element={<AskPage />} />
        <Route path="scan" element={<PDFScannerPage />} />
        <Route path="graph" element={<GraphSoundPage />} />
        <Route path="india-map" element={<IndiaMapPage />} />
        <Route path="map" element={<IndiaMapPage />} />
        <Route path="flashcards" element={<FlashcardsPage />} />
        <Route path="voice-learning" element={<VoiceLearningPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="current-affairs" element={<NewsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="planner" element={<StudyPlannerPage />} />
        <Route path="study-planner" element={<StudyPlannerPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
