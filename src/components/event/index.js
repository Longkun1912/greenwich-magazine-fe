import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EventService from "../../services/event.service";
import ModalCreateEvent from "./CreateEvent";
import ModalEditEvent from "./EditEvent";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await EventService.getAllEvent();
      // Định dạng lại ngày và giờ trước khi cập nhật vào state
      const formattedEvents = response.data.map((event) => ({
        ...event,
        firstDeadLineDate: moment(event.firstDeadLineDate).format(
          "MMMM/DD/YYYY h:mm:ss a"
        ),
        finalDeadLineDate: moment(event.finalDeadLineDate).format(
          "MMMM/DD/YYYY h:mm:ss a"
        ),
      }));
      setEvents(formattedEvents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await EventService.deleteEvent(id);
        fetchEvents(); // Sau khi xóa, cập nhật lại danh sách sự kiện
        toast.success("Event deleted successfully");
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
      }
    },
    [fetchEvents]
  );

  const confirmDelete = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete this event?")) {
        handleDelete(id);
      }
    },
    [handleDelete]
  );

  //edit
  const handleEditEvent = (event) => {
    // console.log(event)
    setDataEventEdit(event);
    setIsShowModalEditEvent(true); // Hiển thị Modal chỉnh sửa khi nhấn nút
  };

  const [isShowModalCreateEvent, setIsShowModalCreateEvent] = useState(false);
  const [isShowModalEditEvent, setIsShowModalEditEvent] = useState(false);
  const [dataEventEdit, setDataEventEdit] = useState({});

  const handleClose = () => {
    setIsShowModalCreateEvent(false);
    setIsShowModalEditEvent(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        size: 100,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 100,
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 100,
      },
      {
        accessorKey: "firstDeadLineDate",
        header: "First Deadline",
        size: 100,
      },
      {
        accessorKey: "finalDeadLineDate",
        header: "Final Deadline",
        size: 100,
      },
      {
        header: "Actions",
        size: 100,
        Cell: ({ row }) => (
          <div>
            <AiFillEdit
              className="act-btn"
              onClick={() => handleEditEvent(row.original)}
            />
            <MdDelete
              className="act-btn"
              onClick={() => confirmDelete(row.original._id)}
            />
          </div>
        ),
      },
    ],
    [confirmDelete]
  );

  const table = useMaterialReactTable({
    columns,
    data: events,
  });

  return (
    <div className="content-container">
      <h1>Event Management</h1>
      <div className="event-index">
        <button
          className="btn btn-scuccess"
          onClick={() => setIsShowModalCreateEvent(true)}
        >
          Create Event
        </button>
        <ModalCreateEvent
          show={isShowModalCreateEvent}
          fetchEvents={fetchEvents}
          handleClose={handleClose}
        />
        <ModalEditEvent
          show={isShowModalEditEvent}
          dataEventEdit={dataEventEdit}
          fetchEvents={fetchEvents}
          handleClose={handleClose}
        />
        <div className="event-table">
          {loading ? (
            <Box>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
              <Skeleton animation="wave" />
              <Skeleton />
              <Skeleton animation={false} />
              <Skeleton animation="wave" />
              <Skeleton />
              <Skeleton animation={false} />
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
          ) : (
            <MaterialReactTable table={table} />
          )}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
