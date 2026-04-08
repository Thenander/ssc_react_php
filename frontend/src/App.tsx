import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import ReleasePage from "./pages/ReleasePage";
import TrackPage from "./pages/TrackPage";
import SourcesPage from "./pages/SourcesPage";
import SourcePage from "./pages/SourcePage";
import SamplePage from "./pages/SamplePage";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReleases from "./pages/admin/AdminReleases";
import AdminTracks from "./pages/admin/AdminTracks";
import AdminSources from "./pages/admin/AdminSources";
import AdminSamples from "./pages/admin/AdminSamples";
import AdminTypes from "./pages/admin/AdminTypes";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/releases/:id"
          element={
            <PublicLayout>
              <ReleasePage />
            </PublicLayout>
          }
        />
        <Route
          path="/tracks/:id"
          element={
            <PublicLayout>
              <TrackPage />
            </PublicLayout>
          }
        />
        <Route
          path="/sources"
          element={
            <PublicLayout>
              <SourcesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/sources/:id"
          element={
            <PublicLayout>
              <SourcePage />
            </PublicLayout>
          }
        />
        <Route
          path="/samples/:id"
          element={
            <PublicLayout>
              <SamplePage />
            </PublicLayout>
          }
        />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/releases"
          element={
            <ProtectedRoute>
              <AdminReleases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tracks"
          element={
            <ProtectedRoute>
              <AdminTracks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sources"
          element={
            <ProtectedRoute>
              <AdminSources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/samples"
          element={
            <ProtectedRoute>
              <AdminSamples />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/types"
          element={
            <ProtectedRoute>
              <AdminTypes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
