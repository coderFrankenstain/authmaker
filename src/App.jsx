import { Button } from "@/components/ui/button";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import DashBoardPage from "./pages/DashBoard";

function RootPage() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
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
