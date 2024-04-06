import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/Faculty.css";
import FacultyService from "../../services/faculty.service";
import ModalcreateFaculty from "./CreateFaculty";
import ModalEditFaculty from "./EditFaculty";

const Faculty = () => {
  const [faculties, setFaculties] = useState([]);

  const fetchFaculties = useCallback(async () => {
    try {
      const response = await FacultyService.getAllFaculties();
      setFaculties(response.data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  }, []);

  useEffect(() => {
    fetchFaculties();
  }, [fetchFaculties]);

  //delete
  const handleDelete = useCallback(
    async (id) => {
      try {
        await FacultyService.deleteFaculty(id);
        fetchFaculties(); // Sau khi xóa, cập nhật lại danh sách khoa
        toast.success("Faculty deleted successfully");
      } catch (error) {
        console.error("Error deleting faculty:", error);
        toast.error("Failed to delete faculty");
      }
    },
    [fetchFaculties]
  );

  //confirmDelete
  const confirmDelete = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete this faculty?")) {
        handleDelete(id);
      }
    },
    [handleDelete]
  );

  //edit
  const handleEditFaculty = (faculty) => {
    // console.log(faculty)
    setDataFacultyEdit(faculty);
    setIsShowModalEditFaculty(true); // Hiển thị Modal chỉnh sửa khi nhấn nút
  };

  const [isShowModalcreateFaculty, setIsShowModalcreateFaculty] =
    useState(false);
  const [isShowModalEditFaculty, setIsShowModalEditFaculty] = useState(false);
  const [dataFacultyEdit, setDataFacultyEdit] = useState({});

  const handleClose = () => {
    setIsShowModalcreateFaculty(false);
    setIsShowModalEditFaculty(false);
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
        accessorKey: "image",
        header: "Image",
        size: 100,
        Cell: ({ cell }) => (
          <img
            src={cell.row.original.image}
            alt="Faculty"
            style={{ width: "100px", height: "auto" }}
          />
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 100,
      },
      {
        header: "Actions",
        size: 100,
        Cell: ({ row }) => (
          <div>
            <button onClick={() => handleEditFaculty(row.original)}>
              <MdEdit />
            </button>
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
    data: faculties,
  });

  return (
    <div className="content-container">
      <h1>Faculty Management</h1>
      <div className="faculty-index">
        <button
          className="btn btn-scuccess"
          onClick={() => setIsShowModalcreateFaculty(true)}
        >
          Add New Faculty
        </button>
        <ModalcreateFaculty
          show={isShowModalcreateFaculty}
          handleClose={handleClose}
          fetchFaculties={fetchFaculties}
        />
        <ModalEditFaculty
          show={isShowModalEditFaculty}
          dataFacultyEdit={dataFacultyEdit}
          handleClose={handleClose}
          fetchFaculties={fetchFaculties}
        />
        <MaterialReactTable table={table} />
        <ToastContainer />
      </div>
    </div>
  );
};

export default Faculty;
