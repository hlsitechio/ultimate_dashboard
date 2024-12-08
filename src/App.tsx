import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuthStore } from "./store/authStore";
import Layout from "./components/Layout";

function App() {
  const { user } = useAuthStore();

  return (
    <ErrorBoundary>
      <NextUIProvider>
        <Router>
          <div className="min-h-screen bg-background text-white">
            {user ? (
              <Layout>
                <AppRoutes />
              </Layout>
            ) : (
              <AppRoutes />
            )}
          </div>
        </Router>
      </NextUIProvider>
    </ErrorBoundary>
  );
}

export default App;