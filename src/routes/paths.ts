// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = "/auth";
const ROOTS_DASHBOARD = "/dashboard";

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, "/login"),
  loginUnprotected: path(ROOTS_AUTH, "/login-unprotected"),
  register: path(ROOTS_AUTH, "/register"),
  registerUnprotected: path(ROOTS_AUTH, "/register-unprotected"),
  resetPassword: path(ROOTS_AUTH, "/reset-password"),
  verify: path(ROOTS_AUTH, "/verify"),
};

export const PATH_PAGE = {
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  pricing: "/pricing",
  payment: "/payment",
  page404: "/404",
  page500: "/500",
};

export const PATH_HOME = {
  cloud: "https://www.sketch.com/s/0fa4699d-a3ff-4cd5-a3a7-d851eb7e17f0",
  purchase: "https://material-ui.com/store/items/minimal-dashboard/",
  components: "/components",
  dashboard: ROOTS_DASHBOARD,
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, "/app"),
  },
  calendar: path(ROOTS_DASHBOARD, "/calendar"),
  schedule: path(ROOTS_DASHBOARD, "/schedule"),
  user: {
    root: path(ROOTS_DASHBOARD, "/user"),
    profile: path(ROOTS_DASHBOARD, "/user/profile"),
    cards: path(ROOTS_DASHBOARD, "/user/card"),
    list: path(ROOTS_DASHBOARD, "/user/list"),
    account: path(ROOTS_DASHBOARD, "/user/account"),
  },
};
