import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import EventService from "../../services/event.service";
import ModalCreateEvent from './CreateEvent';
import ModalEditEvent from './EditEvent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const EventManagement = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await EventService.getAllEvent();
      // Định dạng lại ngày và giờ trước khi cập nhật vào state
      const formattedEvents = response.data.map(event => ({
        ...event,
        firstDeadLineDate: moment(event.firstDeadLineDate).format('MMMM/DD/YYYY h:mm:ss a'),
        finalDeadLineDate: moment(event.finalDeadLineDate).format('MMMM/DD/YYYY h:mm:ss a')
      }));
      setEvents(formattedEvents);
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
  }

  const [isShowModalCreateEvent, setIsShowModalCreateEvent] = useState(false);
  const [isShowModalEditEvent, setIsShowModalEditEvent] = useState(false);
  const [dataEventEdit, setDataEventEdit] = useState({})

  const handleClose = () => {
    setIsShowModalCreateEvent(false);
    setIsShowModalEditEvent(false);
  }


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
            <button onClick={()=> handleEditEvent(row.original)}><MdEdit /></button> 
            <button onClick={() => confirmDelete(row.original._id)}>
              <MdDelete />
            </button>
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
      <button className="btn btn-scuccess" onClick={() =>setIsShowModalCreateEvent(true)}>
        Add New Event</button>
        <ModalCreateEvent
          show = {isShowModalCreateEvent}
          handleClose = {handleClose}
        />
        <ModalEditEvent
          show={isShowModalEditEvent}
          dataEventEdit = {dataEventEdit}
          handleClose = {handleClose}
        />
        <MaterialReactTable table={table} />
        <ToastContainer />
      </div>
    </div>
  );
};

export default EventManagement;
