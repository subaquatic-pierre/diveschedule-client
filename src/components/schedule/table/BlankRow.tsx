import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TableRow, TableCell } from "@material-ui/core";

interface IProps {
  bookingNumber: number;
  showCreateBookingRow?: () => void;
}

const useStyles = makeStyles((theme) => ({
  row: {
    borderBottom: `0.5px solid ${theme.palette.grey[400]}`,
    "& :hover": {
      cursor: "pointer",
    },
  },
  firstCell: {
    borderRight: `0.5px solid ${theme.palette.grey[400]}`,
  },
}));

export const BlankRow = ({ bookingNumber, showCreateBookingRow }: IProps) => {
  const classes = useStyles();

  return (
    <TableRow onClick={showCreateBookingRow} className={classes.row}>
      <TableCell className={classes.firstCell}>{bookingNumber}</TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};
