import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { emailLogin,getUserDetail } from "@/service/user";
import { USER_ERROR_CODE } from "@/constants";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    // 在此处理登录逻辑
    console.log("Login attempt:", { email, password });
    //开始请求
    try {
      await emailLogin({
        email,
        password,
      });

      try {
       let response = await getUserDetail()
       let user = response.data.userInfo
        console.log("登录成功 ",user)
        login(user)
      }
      catch(e) {
        console.log("登录失败")

      }
      //登录成功

    } catch (e) {
      console.log("登录失败 ", e.response.data.code);
      var code = e.response.data.code;
      if (code === USER_ERROR_CODE.AccountLocked) {
        router.push("/unlocked");
      }
      if (code == USER_ERROR_CODE.OtpNeedError) {
        setIsOpen(true);
      }
    }
  };

  return (
    <div className="flex  items-center justify-center w-full min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
