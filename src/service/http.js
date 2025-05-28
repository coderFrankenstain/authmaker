import axios from "axios";
import { BIZ_ERROR_CODE, AUTH_ERROR_CODE,USER_ERROR_CODE} from "@/constants";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? "http://localhost:8888" : "/api",
});

let isErrorShown = false;

// 请求拦截器 - 在发送请求之前执行
api.interceptors.request.use(
  async (config) => {
    const token = await getToken(); // 获取Token的函数
    if (token) {
      // console.log("本地缓存的token ", token);
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 在响应到达之前执行
api.interceptors.response.use(
  (response) => {
    // 从响应数据中取出accessToken并存储
    if (response.data && response.data.data && response.data.data.accessToken) {
      localStorage.setItem("accessToken", response.data.data.accessToken);
    }

    return response;
  },
  (error) => {
    // 这里可以处理错误，例如如果Token过期，可以重定向到登录页面
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      let code = error.response.data.code;

      // 如果是云盘授权超时错误，则不报错，页面做特殊处理
      if (code === BIZ_ERROR_CODE.DriveAccountExpired) {
        return Promise.reject(error);
      }

      if (code === BIZ_ERROR_CODE.DriveAddfailed) {

        return Promise.reject(error);
      }

      if(code === BIZ_ERROR_CODE.DriveNotSpace || code === BIZ_ERROR_CODE.DriveFetchSpacefailed) {
        return Promise.reject(error)
      }
      //如果是是用户账号被锁，做特殊处理
      if(code === USER_ERROR_CODE.AccountLocked) {
        return Promise.reject(error)
      }

      //如果是token失效400则重定向到login页面,或者401为携带token
      if (
        error.response.status == 401 ||
        code === AUTH_ERROR_CODE.TokenExpired
      ) {
        console.log("token过期")
        if (!isErrorShown) {
          isErrorShown = true;
          
          toast.error(`Error ${error.response.status}: ${error.response.data.msg}`);

          // 清除token
          remoteToken()

          setTimeout(() => {
            window.location.href = "/login";
            isErrorShown = false; // 重置标志
          }, 2000);
        }
        return Promise.reject(error);
      }

      if(error.response.status === 503 ) {
       
        toast.error(`Request timed out`)
        return Promise.reject(error);
      }

      //无特殊处理任务则打印错误
      toast.error(
        `Error ${error.response.status}: ${error.response.data.msg}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("No response was received from the server.");
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error("Error in setting up the request: " + error.message);
    }
    return Promise.reject(error);
  }
);

// 获取Token的函数，这里只是一个示例
export const getToken = async () => {
  // 在这里实现你的Token获取逻辑，可能是从本地存储中获取或者通过其他方式
  if (typeof window !== "undefined") {
    // 这段代码只会在浏览器环境中执行
    return localStorage.getItem("accessToken");
  }
  // 在服务器端，你可以返回null或一个替代值
  return null;
};

export const remoteToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};

export default api;
