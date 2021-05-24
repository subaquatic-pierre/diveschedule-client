import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Form, FormikProvider, useFormik } from "formik";
// material
import {
  Box,
  Grid,
  Card,
  Switch,
  TextField,
  CardContent,
  FormControlLabel,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// hooks
import useAuth from "../../../hooks/useAuth";
import useIsMountedRef from "../../../hooks/useIsMountedRef";
import { UploadAvatar } from "../../upload";
// @types
import { User } from "../../../@types/user";
//
import countries from "./countries";

// ----------------------------------------------------------------------

interface InitialState {
  afterSubmit?: string;
  fullName: string;
  email: string;
  equipment: string;
  certificationLevel: string;
  phoneNumber: string;
}

export default function AccountGeneral() {
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateProfile } = useAuth();

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required("Name is required"),
  });

  const formik = useFormik<InitialState>({
    enableReinitialize: true,
    initialValues: {
      fullName: user.profile.fullName,
      email: user.email,
      phoneNumber: user.profile.phoneNumber,
      equipment: user.profile.equipment,
      certificationLevel: user.profile.certificationLevel,
    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await updateProfile({ ...values });
        enqueueSnackbar("Update success", { variant: "success" });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setErrors({ afterSubmit: "200" });
          setSubmitting(false);
        }
      }
    },
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <Box
                sx={{
                  my: 10,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <UploadAvatar
                  disabled={user.email === "demo@minimals.cc"} // You can remove this
                  value={""}
                  onChange={(value) => setFieldValue("photoURL", value)}
                />

                <FormControlLabel
                  control={
                    <Switch {...getFieldProps("isPublic")} color="primary" />
                  }
                  labelPlacement="start"
                  label="Public Profile"
                />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      disabled={user.email === "demo@minimals.cc"} // You can remove this
                      fullWidth
                      label="Name"
                      {...getFieldProps("fullName")}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      disabled
                      label="Email Address"
                      {...getFieldProps("email")}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      {...getFieldProps("phoneNumber")}
                    />
                  </Grid>
                </Grid>

                <Box
                  sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                >
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    pending={isSubmitting}
                  >
                    Save Changes
                  </LoadingButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
