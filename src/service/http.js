import { fetch } from "@tauri-apps/plugin-http";
import { toast } from "sonner";
import { BIZ_ERROR_CODE, AUTH_ERROR_CODE, USER_ERROR_CODE } from "@/constants";
import { useAuth } from "@/context/AuthContext";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8888"
    : "https://app.cloudslinker.com/api";

let isErrorShown = false;

export const getToken = async () => {
  return localStorage.getItem("accessToken");
};

export const removeToken = () => {
  localStorage.removeItem("accessToken");
};

export async function request(endpoint, options = {}) {
  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
    ...(options.headers || {}),
  };

  const url = `${baseURL}${endpoint}`;

  try {
    console.log("✅ request url:", url);

    const res = await fetch(url, {
      method: options.method || "GET",
      headers,
      body:
        typeof options.body === "string"
          ? options.body
          : options.body
          ? JSON.stringify(options.body)
          : undefined,
    });

    const result = await res.json();
    console.log("resutlt is ", result);
    if (res.ok) {
      const data = result.data;

      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      return data;
    } else {
      throw {
        status: res.status,
        code: result.code,
        message: result.msg,
      };
    }
  } catch (error) {
    console.error("❌ fetch error:", error);

    const message = error.message;
    let code = error.code;
    const status = error.status

    // 如果是云盘授权超时错误，则不报错，页面做特殊处理
    if (code === BIZ_ERROR_CODE.DriveAccountExpired) {
      return Promise.reject(error);
    }

    if (code === BIZ_ERROR_CODE.DriveAddfailed) {
      return Promise.reject(error);
    }

    if (
      code === BIZ_ERROR_CODE.DriveNotSpace ||
      code === BIZ_ERROR_CODE.DriveFetchSpacefailed
    ) {
      return Promise.reject(error);
    }
    //如果是是用户账号被锁，做特殊处理
    if (code === USER_ERROR_CODE.AccountLocked) {
      return Promise.reject(error);
    }

    //如果是token失效400则重定向到login页面,或者401为携带token
    if (status == 401 || code === AUTH_ERROR_CODE.TokenExpired) {
      console.log("token过期");
      if (!isErrorShown) {
        isErrorShown = true;
        const { logout } = useAuth()
        
        toast.error(
          `Error ${status}: ${message}`
        );
        logout();
      }
      return Promise.reject(error);
    }

    if (status === 503) {
      toast.error(`Request timed out`);
      return Promise.reject(error);
    }

    //无特殊处理任务则打印错误
    toast.error(`Error ${status}: ${message}`);

    // toast.error(`Request failed: ${message}`);
    return Promise.reject(error);
  }
}
