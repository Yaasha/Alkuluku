import axios from "axios";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL || "",
  withCredentials: true,
});

http.interceptors.request.use(
  function (config) {
    if (config.method === "post") {
      config.headers["X-CSRF-TOKEN"] = getCookie("csrf_access_token");
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default http;
