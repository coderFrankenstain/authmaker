import { Command } from "@tauri-apps/plugin-shell";

const binPath = "binaries/auth"

export const addOauth = async ({ name, type,args }) => {
  //添加配置
  const command = Command.sidecar(binPath, ["config","create",name,type,...args]);
  console.log("执行的命令 ",["config","create",name,type,...args])
  const output = await command.execute();
  console.log("ouput is ", output);
  if(output.code != 0){
    return null
  }

  //使用about获取token
  const fetchCommand = Command.sidecar(binPath, ["about",`${name}:`]);
  const fetchOutput = await fetchCommand.execute();
  if(fetchOutput.code != 0) {
    return null
  }
 

  //导出token 
  const tokenCommand = Command.sidecar(binPath, ["config","dump"]);
  const tokenOutput = await tokenCommand.execute();
  if(tokenOutput.code != 0){
    return null
  }

  console.log("dump is ",tokenOutput.stdout)
  const obj = JSON.parse(tokenOutput.stdout);
  const token = obj[name]
  console.log("token is ",token)
  return token

};
