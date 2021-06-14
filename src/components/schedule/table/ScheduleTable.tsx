import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useApolloClient, useLazyQuery } from "@apollo/client";
import { useHistory } from "react-router";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Table, TableBody, TableContainer, Box, Card } from "@material-ui/core";

import { TableLoading } from "./TableLoading";
import { ScheduleTableHead } from "./ScheduleTableHead";
import { ScheduleTableToolbar } from "./ScheduleTableToolbar";
import { ScheduleTableRow } from "./ScheduleTableRow";
import { CreateBookingRow } from "./CreateBookingRow";
import { BlankRow } from "./BlankRow";
import { getHeadFields } from "../utils";
import { TableInfo } from "./TableInfo";

import { Booking, ActivityDetail } from "../../../@types/schedule";

import { ACTIVITY_DATA, DELETE_BOOKINGS } from "../../../graphql/schedule";
import useBaseMutation from "../../../hooks/useBaseMutation";
import { messageController } from "../../../controllers/messages";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    minHeight: 700,
    display: "flex",
    flexDirection: "column",
  },
  loading: {
    width: 300,
  },
  tableTotalRow: {
    height: theme.spacing(7),
  },
  row: {
    borderBottom: `0.5px solid ${theme.palette.grey[400]}`,
  },
  firstCell: {
    borderRight: `0.5px solid ${theme.palette.grey[400]}`,
  },
}));

const isBoatTrip = (activityType: string): boolean => {
  if (activityType === "AM_BOAT" || activityType === "PM_BOAT") {
    return true;
  }
  return false;
};

const getTripTime = (tableType: string): string | undefined => {
  switch (tableType) {
    case "AM_BOAT":
      return "9am";
    case "PM_BOAT":
      return "1:30pm";
    default:
      return undefined;
  }
};

interface IScheduleTableProps {
  tableType: string;
  date: Date;
  activityId?: string;
}

export const ScheduleTable: React.FC<IScheduleTableProps> = ({
  tableType,
  date,
  activityId,
}) => {
  // DEBUG --------
  if (tableType === "AM_BOAT") {
    console.log(activityId);
  }

  const history = useHistory();
  const maxDivers = 13;

  const classes = useStyles();
  const [selected, setSelected] = useState<number[]>([]);
  const [creatingBooking, setCreatingBooking] = useState<boolean>(false);

  const client = useApolloClient();
  const { setError } = messageController(client);

  const blankActivityData: ActivityDetail = {
    id: -1,
    time: getTripTime(tableType),
    day: { date },
    bookingSet: [] as Booking[],
    activityType: tableType,
  };

  // Data state
  const [totalDivers, setTotalDivers] = useState(0);
  const [blankBookings, setBlankBookings] = useState([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activity, setActivity] = useState<ActivityDetail>(blankActivityData);

  // Data query
  const [getData, { data, loading, refetch, called }] = useLazyQuery(
    ACTIVITY_DATA,
    {
      onError: (error: any) => {
        setError(error.message);
      },
    }
  );

  const { mutation: deleteBookings } = useBaseMutation(DELETE_BOOKINGS, {
    onCompleted: (data: any) => {
      refetch();
      setSelected([]);
    },
  });

  const handleDeleteBookings = () => {
    console.log(selected);
    deleteBookings({ variables: { ids: selected } });
  };

  const handleSelectAllClick = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.checked) {
      const newSelected: number[] = bookings.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (id: number): void => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const showCreateBookingRow = () => {
    setCreatingBooking(true);
  };

  const editDiverClick = () => {
    const booking = bookings.filter((booking) => booking.id === selected[0])[0];
    const userId = booking.diver.id;
    history.push(PATH_DASHBOARD.user.root + "/edit/" + userId);
  };

  const cancelEditingBooking = () => {
    setCreatingBooking(false);
  };

  // Get table data
  useEffect(() => {
    if (activityId !== "-1") {
      getData({ variables: { activityId } });
    }
  }, []);

  useEffect(() => {
    if (data) {
      const { activityData } = data;
      const { bookingSet } = activityData;
      setBookings(bookingSet);
      setActivity(activityData);
    }
  }, [activityId, data]);

  useEffect(() => {
    // Set number of blank bookings
    let numBookings = bookings.length;
    const availableSpaces = maxDivers - numBookings;
    const tempBlankBookings = [];
    for (let i = 0; i < availableSpaces; i++) {
      numBookings += 1;
      tempBlankBookings.push(numBookings);
    }
    setBlankBookings(tempBlankBookings);

    // Set total number of divers
    if (data) {
      const { activityData } = data;
      const { diveGuides, bookingSet } = activityData;
      setTotalDivers(diveGuides.length + bookings.length);
      setBookings(bookingSet);
      setActivity(activityData);
    }
  }, [data, bookings.length]);

  return (
    <Box dir="ltr">
      <Card>
        <ScheduleTableToolbar
          handleEditDiverClick={editDiverClick}
          tableType={activity.activityType}
          activityDetail={activity}
          numSelected={selected.length}
          showCreateBookingRow={showCreateBookingRow}
          showAddBooking={!creatingBooking}
          deleteBookings={handleDeleteBookings}
        />

        <TableContainer className={classes.tableContainer}>
          <Table
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
          >
            <ScheduleTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={bookings.length}
              headFields={getHeadFields(activity.activityType)}
            />
            {loading ? (
              <TableLoading
                numCol={getHeadFields(activity.activityType).length + 2}
              />
            ) : (
              <TableBody sx={{ minHeight: "400px" }}>
                {bookings.map((bookingData: Booking, index) => {
                  return (
                    <ScheduleTableRow
                      key={index}
                      index={index}
                      bookingData={bookingData}
                      handleSelectClick={handleSelectClick}
                      selected={selected}
                    />
                  );
                })}
                {creatingBooking && (
                  <CreateBookingRow
                    date={date}
                    tableType={activity.activityType}
                    cancelEditingBooking={cancelEditingBooking}
                    refetchBookings={refetch}
                    fetchBookingDataCalled={called}
                  />
                )}
                {!creatingBooking &&
                  isBoatTrip(activity.activityType) &&
                  blankBookings.map((booking, index) => (
                    <BlankRow
                      key={index}
                      showCreateBookingRow={showCreateBookingRow}
                      bookingNumber={booking}
                    />
                  ))}
              </TableBody>
            )}
          </Table>
          {isBoatTrip(activity.activityType) && (
            <TableInfo activity={activity} totalDivers={totalDivers} />
          )}
        </TableContainer>
      </Card>
    </Box>
  );
};
