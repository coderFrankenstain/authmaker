import { request } from "./http";

const userPath = "/usercenter/v1/user";

export const emailLogin = async ({ email, password, mfa }) => {
  const response = await request(userPath + "/login", {
    method: "POST",
    body: { email, password, mfa }
  });
  return response;
};

export const getUserDetail = async () => {
  const response = await request(userPath + "/detail", {
    method: "POST"
  });
  return response;
};