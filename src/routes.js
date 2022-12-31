// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import GiftCard from "layouts/giftCard/giftCard";
import CreateBlog from "layouts/createBlog";
import SignUp from "layouts/authentication/sign-up";
import Order from "layouts/ORDER/order";
// @mui icons
import Icon from "@mui/material/Icon";
import { Route } from "react-router-dom";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import ViewListIcon from "@mui/icons-material/ViewList";

const publicRoutes = [
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/users",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Gift Card",
    key: "Gift_Card",
    icon: <CardGiftcardIcon />,
    route: "/giftCard",
    component: <GiftCard />,
  },
  {
    type: "collapse",
    name: "Create Blog",
    key: "Create Blog",
    icon: <CardGiftcardIcon />,
    route: "createBlog",
    component: <CreateBlog />,
  },
  {
    type: "collapse",
    name: "order",
    key: "order",
    icon: <ViewListIcon />,
    route: "/Order",
    component: <Order />,
  },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  // },
];

const getRoutes = (allRoutes) =>
  allRoutes.map((route) => {
    if (route.collapse) {
      return getRoutes(route.collapse);
    }
    if (route.route) {
      return <Route exact path={route.route} element={route.component} key={route.key} />;
    }

    return null;
  });

export { routes, publicRoutes, getRoutes };
