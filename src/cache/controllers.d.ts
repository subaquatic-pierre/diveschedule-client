import { LoginParams, RegisterParams } from "./controllers/auth";

export type SettingsController = {
  handleToggleTheme: () => void;
  handleChangeTheme: (event: any) => void;
  handleChangeDirection: (event: any) => void;
};

export type AuthController = {
  login: ({ email, password }: LoginParams) => Promise;
  register: ({
    email,
    password,
    firstName,
    lastName,
  }: RegisterParams) => Promise;
  logout: () => Promise;
};
