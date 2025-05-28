import api from "./http";
const userPath = "/usercenter/v1/user";

export const emailLogin = async ({ email, password,mfa }) => {
  const response = await api.post(userPath + "/login", {
    email,
    password,
    mfa
  });
  return response.data;
};

export const getUserDetail = async() => {
    const response = await api.post(userPath + "/detail")
    return response.data;
  }
  