import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { blogRoutes } from "./routes";
import { message } from "antd";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import jwtDecode from "jwt-decode";

import { useSelector, useDispatch } from "react-redux";
// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import { routes, publicRoutes, getRoutes } from "./routes";
import { setUser, setLoginState } from "./redux/user";
import { users } from "./api";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  const [messageApi, contextHolder] = message.useMessage();
  const dispatchR = useDispatch();
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user } = useSelector((state) => state.user);
  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    // Session
    if (sessionStorage.getItem("token-access") !== null) {
      setLoading(true);
      const decoded = jwtDecode(sessionStorage.getItem("token-access"));
      users(`/${decoded.sub}`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
        },
      })
        .then((res) => {
          console.log(res.data);
          dispatchR(setUser(res.data));
          dispatchR(setLoginState(true));
          messageApi.success("login success");
        })
        .catch((error) => {
          messageApi.error(error.response.data.message);
          console.log(error.response.data.message);
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      {loading ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}
        >
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <>
          <CssBaseline />
          {contextHolder}
          {isLoggedIn && layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                // brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                brandName="Switch Hive Admin"
                routes={user?.role === "blogWriter" ? blogRoutes : routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              <Configurator />
              {configsButton}
            </>
          )}

          <Routes>
            {/* {isLoggedIn ? getRoutes(routes) : getRoutes(publicRoutes)} */}
            {isLoggedIn
              ? user?.role === "blogWriter"
                ? getRoutes(blogRoutes)
                : getRoutes(routes)
              : getRoutes(publicRoutes)}
            {isLoggedIn ? (
              user?.role === "blogWriter" ? (
                <Route path="*" element={<Navigate to="/blog" />} />
              ) : (
                <Route path="*" element={<Navigate to="/dashboard" />} />
              )
            ) : (
              <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
            )}
          </Routes>
        </>
      )}
    </ThemeProvider>
  );
}
