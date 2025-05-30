import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Command } from "@tauri-apps/plugin-shell";
import { useState } from "react";
import { addOauth } from "@/service/command";

function DashBoardPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [mfa, setMfa] = useState("");
  const { user, logout } = useAuth();
  const handleLogin = async (e) => {
    e.preventDefault();

    const args = Object.entries({
      password,
      username: name,
      ...(mfa && { "2fa": mfa }), // 如果 mfa 有值就加入 mfa 字段
    }).map(([key, value]) => `${key}=${value}`);

    const token = await addOauth({
      name,
      type: "protondrive",
      args,
    });
  };

  return (
    <div className="flex flex-col  items-center justify-center min-h-svh w-full">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">{user.email}</CardTitle>
          <CardTitle className="text-center text-gray-500 mt-2">
            Pronton Drive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Pronton Drive Email"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Pronton Drive Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Mfa code ( Optional )"
              value={mfa}
              onChange={(e) => setMfa(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Add
            </Button>

            {/* 分割线 */}
            <div className="border-t mt-4" />
            <Button onClick={logout} variant="outline" className="mt-4 w-full">
              logout
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashBoardPage;
