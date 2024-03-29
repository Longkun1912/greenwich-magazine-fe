import React, { useEffect, useMemo, useState, useCallback } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import FacultyService from "../../services/faculty.service";
import { MdEdit, MdDelete } from "react-icons/md";
import "../../css/Faculty.css";
import ModalcreateFaculty from './CreateFaculty';
import ModalEditFaculty from './EditFaculty';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Faculty = () => {
  const [faculties, setFaculties] = useState([]);

  const fetchFaculties = useCallback(async () => {
    try {
      const response = await FacultyService.getAllFaculties();
      setFaculties(response.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  }, []);

  useEffect(() => {
    fetchFaculties();
  }, [fetchFaculties]);

  //delete
  const handleDelete = useCallback(async (id) => {
    try {
      await FacultyService.deleteFaculty(id);
      fetchFaculties(); // Sau khi xóa, cập nhật lại danh sách khoa
      toast.success("Faculty deleted successfully");
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast.error("Failed to delete faculty");
    }
  }, [fetchFaculties]);

  //confirmDelete
  const confirmDelete = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      handleDelete(id);
    }
  }, [handleDelete]);

  //edit
  const handleEditFaculty = (faculty) => {
    // console.log(faculty)
    setDataFacultyEdit(faculty);
    setIsShowModalEditFaculty(true); // Hiển thị Modal chỉnh sửa khi nhấn nút
  }

  const [isShowModalcreateFaculty, setIsShowModalcreateFaculty] = useState(false);
  const [isShowModalEditFaculty, setIsShowModalEditFaculty] = useState(false);
  const [dataFacultyEdit, setDataFacultyEdit] = useState({})

  const handleClose = () => {
    setIsShowModalcreateFaculty(false);
    setIsShowModalEditFaculty(false);
  }


  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        size: 150,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "image",
        header: "Image",
        size: 200,
        Cell: ({ cell }) => <img src={cell.row.original.image} alt="Faculty" style={{ width: '100px', height: 'auto' }} />,
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 150,
      },
      {
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <div>
            <button onClick={()=> handleEditFaculty(row.original)}><MdEdit /></button> 
            <button onClick={() => confirmDelete(row.original._id)}><MdDelete /></button>
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
        <button className="btn btn-scuccess" onClick={() =>setIsShowModalcreateFaculty(true)}>
        Add New Faculty</button>
        <ModalcreateFaculty
          show = {isShowModalcreateFaculty}
          handleClose = {handleClose}
        />
         <ModalEditFaculty
          show={isShowModalEditFaculty}
          dataFacultyEdit = {dataFacultyEdit}
          handleClose = {handleClose}
        />
        <MaterialReactTable table={table} />
        <ToastContainer />
      </div>
    </div>
  );
};

export default Faculty;
