import axios from "axios";
import $bus from "@/utils/bus";
import axiosRetry from "axios-retry";
const instance = axios.create({
  baseURL: process.env.MY_BASE_URL,
  timeout: 3000,
});
axiosRetry(instance, {
  retries: 2, // 设置重试次数
  retryCondition: (error) => {
    // 网络错误 或 请求超时 error.response为undefined
    // 仅在超时情况下重试
    return error.message.includes("timeout");
  },
  retryDelay: (retryCount) => {
    // 延迟 1000 毫秒 * 当前重试次数retryCount
    // return retryCount * 1000;
    return 0;
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`重试请求: ${requestConfig.url}，次数: ${retryCount}`);
  },
  shouldResetTimeout: true, // 每次重试重置超时
});

const httpErrorCode = {
  401: (errorMessage) => {
    // 无效的token/不携带token
    $bus.emit("API:INVALID", errorMessage);
  },
  403: (errorMessage) => {
    // token过期/token注销
    $bus.emit("API:UN_AUTH", errorMessage);
  },
  404: (errorMessage) => {
    // 请求地址不存在
    $bus.emit("error_message", errorMessage);
  },
  default: (errorMessage) => {
    $bus.emit("error_message", errorMessage);
  },
};

// 存储所有请求的停止
window.cancelTokenObject = {};
instance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  const cancelTokenSource = axios.CancelToken.source();
  // config.url格式如下：/promise?a=1&b=2
  const key = `${config.method}-${config.url}-${
    JSON.stringify(config.params) || ""
  }`;
  cancelTokenObject[key] = cancelTokenSource;
  config.cancelToken = cancelTokenSource.token;
  return config;
});

instance.interceptors.response.use(
  (res) => {
    const key = `${res.config.method}-${res.config.url}-${
      JSON.stringify(res.config.params) || ""
    }`;
    delete cancelTokenObject[key];
    if (res.data?.data?.token) {
      window.localStorage.setItem("token", res.data.data.token);
    }
    return res.data;
  },
  (err) => {
    if (axios.isCancel(err)) {
      return Promise.reject(err);
    }
    if (!err.response) {
      if (err.message === "Network Error") {
        $bus.emit("error_message", "网络错误");
      } else if (err.message.includes("timeout")) {
        $bus.emit("error_message", "请求超时");
      }
      return Promise.reject(err);
    }
    const responseCode = err.response.status;
    const errorMessage = err.response.data.msg;
    httpErrorCode[responseCode]
      ? httpErrorCode[responseCode](errorMessage)
      : httpErrorCode["default"](errorMessage);
    return Promise.reject(err);
  }
);

// 停止所有请求
export const cancelAllRequest = () => {
  Object.values(cancelTokenObject).forEach((cancelTokenSource) => {
    cancelTokenSource && cancelTokenSource.cancel("请求已取消");
  });
  // 取消令牌映射
  for (const key in cancelTokenObject) {
    delete cancelTokenObject[key];
  }
};

export default instance;
