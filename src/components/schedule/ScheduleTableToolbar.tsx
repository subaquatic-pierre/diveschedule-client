import React from "react";
import clsx from "clsx";
import {
  lighten,
  makeStyles,
  Toolbar,
  Typography,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";

import { ActivityDetail } from "../../@types/schedule";
import { ActivityDetailForm } from "./ActivityDetailForm";
import { getToolbarHeading } from "../../utils/scheduleUtils";
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  toolbarRoot: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    backgroundColor: lighten(theme.palette.primary.light, 0.5),
  },
  highlight: {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
  },
  title: {
    flex: "1 1 100%",
  },
  moreMenu: {
    width: 150,
    maxWidth: 150,
    backgroundColor: theme.palette.background.paper,
  },
  popoverContainer: {
    padding: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      width: "400px",
    },
  },
}));

interface IProps {
  activityDetail?: ActivityDetail;
  numSelected: number;
  tableType: string;
  creatingBooking: boolean;
  cancelEditingBooking: () => void;
  showCreateBookingRow: () => void;
  handleEditDiverClick: () => void;
  deleteBookings: () => void;
}

export const ScheduleTableToolbar: React.FC<IProps> = ({
  activityDetail,
  numSelected,
  tableType,
  creatingBooking,
  cancelEditingBooking,
  handleEditDiverClick,
  showCreateBookingRow,
  deleteBookings,
}) => {
  const {
    user: {
      profile: { role },
    },
  } = useAuth();
  const isAdmin = role === "admin";
  const classes = useStyles();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = React.useState(null);
  const [
    editTripAnchorEl,
    setEditTripPopoverAnchorEl,
  ] = React.useState<HTMLButtonElement | null>(null);

  const handleEditTripButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setEditTripPopoverAnchorEl(event.currentTarget);
  };

  const handleCancelCreatingBookingClick = () => {
    cancelEditingBooking();
  };

  const handleEditTripPopoverClose = () => {
    setEditTripPopoverAnchorEl(null);
  };

  const editTripPopoverOpen = Boolean(editTripAnchorEl);
  const editTripPopoverId = editTripPopoverOpen
    ? "edit-trip-popover"
    : undefined;

  const handleClose = () => {
    setMoreMenuAnchorEl(null);
  };

  const moreMenuOpen = Boolean(moreMenuAnchorEl);
  const moreMenuId = moreMenuOpen ? "moreMenu" : undefined;

  const isBoatTrip = !!(tableType === "AM_BOAT" || tableType === "PM_BOAT");

  return (
    <Toolbar
      disableGutters
      className={clsx(classes.toolbarRoot, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle2"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {getToolbarHeading(tableType, activityDetail)}
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={deleteBookings}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          {!creatingBooking && isAdmin && (
            <Tooltip title="Add Booking">
              <IconButton onClick={showCreateBookingRow}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          )}
          {creatingBooking && (
            <Tooltip title="Cancel Booking">
              <IconButton onClick={handleCancelCreatingBookingClick}>
                <CancelIcon />
              </IconButton>
            </Tooltip>
          )}
          {isBoatTrip && isAdmin && !creatingBooking && (
            <Tooltip title="Edit trip details">
              <IconButton
                aria-label="filter list"
                onClick={handleEditTripButtonClick}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
      {numSelected === 1 && (
        <>
          <Tooltip title="Edit Diver">
            <IconButton aria-label="edit diver" onClick={handleEditDiverClick}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </>
      )}

      <Popover
        id={moreMenuId}
        open={moreMenuOpen}
        anchorEl={moreMenuAnchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className={classes.moreMenu}>
          <List component="nav" aria-label="secondary mailbox folders">
            <ListItem button>
              <ListItemText primary="Edit Trip" />
            </ListItem>
          </List>
        </div>
      </Popover>
      <Popover
        id={editTripPopoverId}
        open={editTripPopoverOpen}
        anchorEl={editTripAnchorEl}
        onClose={handleEditTripPopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className={classes.popoverContainer}>
          <ActivityDetailForm
            handleClose={handleEditTripPopoverClose}
            activityDetail={activityDetail}
          />
        </div>
      </Popover>
    </Toolbar>
  );
};
