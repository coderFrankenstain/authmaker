import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function DashBoardPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfa, setMfa] = useState("");
  const { user, logout } = useAuth();
  const [value, setValue] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col  items-center justify-center min-h-svh w-full">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">{user.email}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">A</SelectItem>
                <SelectItem value="b">B</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
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
