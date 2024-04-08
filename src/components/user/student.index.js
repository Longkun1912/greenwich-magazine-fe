import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import "../../css/User.css";
import auth from "../../services/auth.service";
import UserService from "../../services/user.service";
import StudentUpdateForm from "./update.student";

const StudentIndex = () => {
  const currentUser = auth.getCurrentUser();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isOpenUpdateStudentModal, setIsOpenUpdateStudentModal] =
    useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      await UserService.viewStudentByFaculty(currentUser.id).then(
        (response) => {
          setStudents(response.data);
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentUser.id]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle update student
  const handleUpdateStudent = (student) => {
    setSelectedStudent(student);
    setIsOpenUpdateStudentModal(true);
  };

  const handleCloseUpdateStudentModal = () => {
    setIsOpenUpdateStudentModal(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        size: 100,
      },
      {
        accessorKey: "username",
        header: "Username",
        size: 100,
      },
      {
        accessorKey: "avatar",
        header: "Avatar",
        size: 100,
        Cell: ({ cell }) => (
          <img
            src={cell.row.original.avatar}
            alt="avatar"
            className="avatar-img"
          />
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 150,
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
        size: 100,
      },
      {
        header: "Actions",
        size: 100,
        Cell: ({ cell }) => (
          <AiFillEdit
            className="act-btn"
            onClick={() => handleUpdateStudent(cell.row.original)}
          />
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: students,
  });

  return (
    <div className="container">
      <div className="header">
        <h1>
          Students in <span>{currentUser.faculty}</span>
        </h1>
      </div>
      <div className="content-container">
        <div id="student-table">
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
        </div>
      </div>
      {isOpenUpdateStudentModal && (
        <StudentUpdateForm
          student={selectedStudent}
          open={isOpenUpdateStudentModal}
          close={handleCloseUpdateStudentModal}
          fetchStudents={fetchStudents}
        />
      )}
    </div>
  );
};

export default StudentIndex;
