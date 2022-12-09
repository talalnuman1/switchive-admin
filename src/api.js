import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

const register = axios.create({
  baseURL: `${baseUrl}/auth/register`,
});
register.interceptors.request.use(
  (req) => req,
  (err) => Promise.reject(err)
);

const login = axios.create({
  baseURL: `${baseUrl}/auth/login`,
});
login.interceptors.request.use(
  (req) => req,
  (err) => Promise.reject(err)
);

const users = axios.create({
  baseURL: `${baseUrl}/users`,
});
users.interceptors.request.use(
  (req) => req,
  (err) => Promise.reject(err)
);

export { register, login, users };
