import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

function DashBoardPage() {
  const { logout } = useAuth();
  return (
    <>
      <Button onClick={()=>{
        logout()
      }}>操作面板</Button>;
    </>
  );
}

export default DashBoardPage;
