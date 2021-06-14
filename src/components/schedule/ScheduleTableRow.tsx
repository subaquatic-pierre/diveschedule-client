import React from "react";
import { Typography, makeStyles } from "@material-ui/core";

import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableRow from "@material-ui/core/TableRow";

import { Booking } from "../../@types/schedule";

const useStyles = makeStyles((theme) => ({
  checkBox: {
    padding: "0px 0px 0px 12px !important",
  },
}));

interface IProps {
  handleSelectClick: (name: number) => void;
  selected: number[];
  bookingData: Booking;
  index: number;
}

export const ScheduleTableRow: React.FC<IProps> = ({
  handleSelectClick,
  index,
  selected,
  bookingData,
}) => {
  const classes = useStyles();
  const {
    activityDetail: { activityType },
    id,
    time,
    diver: {
      email,
      profile: { fullName, certLevel, equipment: userEquipment },
    },
    diverRole,
  } = bookingData;

  // Get instructor name if instructor exists
  let instructorName = "";
  if (bookingData.instructor) {
    instructorName = bookingData.instructor.profile.fullName;
  }

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const isBoatBooking =
    activityType === "AM_BOAT" || activityType === "PM_BOAT";

  return (
    <TableRow
      hover
      role="checkbox"
      onClick={() => handleSelectClick(id)}
      className={"schedule-table__row"}
      aria-checked={isSelected(id)}
      tabIndex={-1}
      selected={isSelected(id)}
    >
      {selected.length > 0 ? (
        <TableCell className={classes.checkBox}>
          <Checkbox
            size="small"
            checked={isSelected(id)}
            inputProps={{ "aria-labelledby": email }}
          />
        </TableCell>
      ) : (
        <TableCell className={"schedule-table__first-cell"}>
          <Typography>{index + 1}</Typography>
        </TableCell>
      )}
      <TableCell id={email}>{fullName}</TableCell>
      <TableCell align="center">{diverRole.toUpperCase()}</TableCell>
      {isBoatBooking ? (
        <TableCell align="center">{certLevel}</TableCell>
      ) : (
        <TableCell align="center">{instructorName}</TableCell>
      )}
      <TableCell align="center">{userEquipment}</TableCell>
      {!isBoatBooking && <TableCell align="center">{time}</TableCell>}
    </TableRow>
  );
};
