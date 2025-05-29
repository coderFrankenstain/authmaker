import { Button } from "@/components/ui/button";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import DashBoardPage from "./pages/DashBoard";

function RootPage() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-svh bg-gray-100">
      {isLoggedIn ? <DashBoardPage/> : <Login/>}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <RootPage />
    </AuthProvider>
  );
}

export default App;
