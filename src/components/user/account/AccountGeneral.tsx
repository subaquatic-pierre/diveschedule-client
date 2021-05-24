import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useApolloClient } from "@apollo/client";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// hooks
import useAuth from "../../../hooks/useAuth";
import useIsMountedRef from "../../../hooks/useIsMountedRef";
import { UploadAvatar } from "../../upload";
import { User } from "../../../@types/user";
import { userController } from "../../../controllers/user";
import {
  buildAccountFormData,
  InitialFormState,
} from "../../../utils/buildAccountFormData";
//
// ----------------------------------------------------------------------

type AccountGeneralProps = {
  mode?: string;
  userId?: string;
};

export default function AccountGeneral({
  mode = "account",
  userId,
}: AccountGeneralProps) {
  const isMountedRef = useIsMountedRef();
  const client = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateProfile } = useAuth();

  // If mode is edit
  const { getUser } = userController(client);

  // If mode is create

  const UpdateUserSchema = Yup.object().shape({
    fullName: Yup.string().required("Name is required"),
  });

  const formik = useFormik<InitialFormState>({
    enableReinitialize: true,
    initialValues: buildAccountFormData({ mode, user, userId, getUser }),
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
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      {...getFieldProps("fullName")}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      disabled={mode !== "create"}
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

                  <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="certLevel">
                        Certification Level
                      </InputLabel>
                      <Select
                        labelId="certLevel"
                        fullWidth
                        label="Certification Level"
                        {...getFieldProps("certificationLevel")}
                      >
                        <MenuItem value="openWater">Open Water</MenuItem>
                        <MenuItem value="advancedOpenWater">
                          Advanced Open Water
                        </MenuItem>
                        <MenuItem value="deepSpecialty">
                          Deep Specialty
                        </MenuItem>
                        <MenuItem value="rescueDiver">Rescue Diver</MenuItem>
                        <MenuItem value="diveMaster">Dive Master</MenuItem>
                        <MenuItem value="instructor">Instructor</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="equipment">Equipment</InputLabel>
                      <Select
                        labelId="equipment"
                        fullWidth
                        label="Certification Level"
                        {...getFieldProps("equipment")}
                      >
                        <MenuItem value="fullEquipment">
                          Full Equipment
                        </MenuItem>
                        <MenuItem value="tanksAndWeights">
                          Tanks and Weights
                        </MenuItem>
                        <MenuItem value="noEquipment">No Equipment</MenuItem>
                      </Select>
                    </FormControl>
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
                    Create User
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
