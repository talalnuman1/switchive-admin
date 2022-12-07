import axios from "axios";

const url = "http://localhost:3300/v1";

const register = axios.create({
  baseURL: `${url}/auth/register`,
});
register.interceptors.request.use(
  (req) => req,
  (err) => Promise.reject(err)
);

const login = axios.create({
  baseURL: `${url}/auth/login`,
});
login.interceptors.request.use(
  (req) => req,
  (err) => Promise.reject(err)
);

const users = axios.create({
  baseURL: `${url}/users`,
});
users.interceptors.request.use(
  (req) => req,
  (err) => Promise.reject(err)
);

export { register, login, users };
