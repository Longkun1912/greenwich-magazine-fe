import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdDelete } from "react-icons/md";
import EventService from "../../services/event.service";

const EventManagement = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await EventService.getAllEvent();
      setEvents(response.data);
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
      } catch (error) {
        console.error("Error deleting event:", error);
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
            <button>Edit</button>
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
        <button className="btn btn-success">Add New Event</button>

        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

export default EventManagement;
