import * as Yup from "yup";
import { useApolloClient } from "@apollo/client";
import { useState } from "react";
import { useFormik, Form, FormikProvider } from "formik";

// icons
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";

// material
import {
  Box,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";

// hooks
import useBaseMutation from "../../../hooks/useBaseMutation";
import useIsMountedRef from "../../../hooks/useIsMountedRef";

// utils
import { emailError, passwordError } from "../../../utils/helpError";
import { messageController } from "../../../controllers/messages";

//graphql
import { LOGIN_MUTATION, REGISTER_MUTATION } from "../../../graphql/auth";

// ----------------------------------------------------------------------

type InitialValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  afterSubmit?: string;
};

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const isMountedRef = useIsMountedRef();
  const client = useApolloClient();
  const [password, setPassword] = useState("");
  const { setError } = messageController(client);

  const { mutation: login } = useBaseMutation(LOGIN_MUTATION, {
    onCompleted: (data: any) => {
      localStorage.setItem("token", data.tokenAuth.token);
      window.location.reload();
    },
  });

  const { mutation: register } = useBaseMutation(REGISTER_MUTATION, {
    onCompleted: (data: any) => {
      login({
        variables: { email: data.registerUser.user.email, password: password },
      });
    },
    onError: (error: any) => {
      if (
        error.message === "UNIQUE constraint failed: users_customuser.email"
      ) {
        setError("User email already exists");
      } else {
        setError(error.message);
      }
    },
  });

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("First name required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Last name required"),
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        setPassword(values.password);
        const variables = {
          email: values.email,
          password: values.password,
          fullName: `${values.firstName} ${values.lastName}`,
        };
        register({ variables });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.code || error.message });
          setSubmitting(false);
        }
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps("firstName")}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps("lastName")}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          autoComplete="username"
          label="Email address"
          {...getFieldProps("email")}
          error={
            Boolean(touched.email && errors.email) ||
            emailError(errors.afterSubmit || "").error
          }
          helperText={
            (touched.email && errors.email) ||
            emailError(errors.afterSubmit || "").helperText
          }
          sx={{ my: 3 }}
        />

        <TextField
          fullWidth
          autoComplete="current-password"
          type={showPassword ? "text" : "password"}
          label="Password"
          {...getFieldProps("password")}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={
            Boolean(touched.password && errors.password) ||
            passwordError(errors.afterSubmit || "").error
          }
          helperText={
            (touched.password && errors.password) ||
            passwordError(errors.afterSubmit || "").helperText
          }
        />
        <Box sx={{ mt: 3 }}>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            pending={isSubmitting}
          >
            Register
          </LoadingButton>
        </Box>
      </Form>
    </FormikProvider>
  );
}
