import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

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

const cards = axios.create({
  baseURL: `${baseUrl}/cards`,
});
users.interceptors.request.use(
  (req) => req,
  (err) => Promise.reject(err)
);



export { login, users, cards };
