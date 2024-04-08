import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../css/Faculty.css";
import FacultyService from "../../services/faculty.service";
import ModalcreateFaculty from "./CreateFaculty";
import ModalEditFaculty from "./EditFaculty";

const Faculty = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFaculties = useCallback(async () => {
    setLoading(true);
    try {
      const response = await FacultyService.getAllFaculties();
      setFaculties(response.data);
      setLoading(false);
    } catch (error) {
      // console.error("Error fetching faculties:", error);
      toast.error("Error fetching faculties", error);
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
        toast.error("Failed to delete faculty" , error);
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

  const [isShowModalCreateFaculty, setIsShowModalCreateFaculty] =
    useState(false);
  const [isShowModalEditFaculty, setIsShowModalEditFaculty] = useState(false);
  const [dataFacultyEdit, setDataFacultyEdit] = useState({});

  const handleClose = () => {
    setIsShowModalCreateFaculty(false);
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
            style={{ width: "15vh", height: "15vh" , borderRadius: "3vh" }}
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
              <AiFillEdit 
                className="act-btn"
                onClick={() => handleEditFaculty(row.original)}
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
    data: faculties,
  });

  return (
    <div className="content-container">
      <ToastContainer />
      <h1>Faculties Management</h1>
      <div className="faculty-index">
        <button
          className="btn btn-successFaculty"
          onClick={() => setIsShowModalCreateFaculty(true)}
        >
          Create Faculty
        </button>
        <ModalcreateFaculty
          show={isShowModalCreateFaculty}
          handleClose={handleClose}
          fetchFaculties={fetchFaculties}
        />
        <ModalEditFaculty
          show={isShowModalEditFaculty}
          dataFacultyEdit={dataFacultyEdit}
          handleClose={handleClose}
          fetchFaculties={fetchFaculties}
        />
        <div className="faculty-table">
          {loading ? (
            <div className="loading">
              <span>Loading Faculties... </span>
            </div>
          ) : (
            <MaterialReactTable table={table} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Faculty;
