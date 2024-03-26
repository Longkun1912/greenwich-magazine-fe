import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import "../../css/User.css";
import UserAddingForm from "../../modals/create.user";
import EditUserForm from "../../modals/edit.user";
import UserInfo from "../../modals/view.user";
import FacultyService from "../../services/faculty.service";
import RoleService from "../../services/role.service";
import UserService from "../../services/user.service";

const UserIndex = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFaculty = async () => {
    try {
      await FacultyService.getAllFaculties().then((response) => {
        localStorage.setItem("faculties", JSON.stringify(response.data));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoles = async () => {
    try {
      await RoleService.viewRoles().then((response) => {
        localStorage.setItem("roles", JSON.stringify(response.data));
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchFaculty().then(() => {
        setFacultyOptions(JSON.parse(localStorage.getItem("faculties")));
      });
      await fetchRoles().then(() => {
        setRoleOptions(JSON.parse(localStorage.getItem("roles")));
      });
    };
    initializeData();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    await UserService.viewSystemUsers().then((response) => {
      setUsers(response.data);
    });
    setLoading(false);
  };

  // Handle view user details
  const [openUserDetails, setOpenUserDetails] = useState(false);

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setOpenUserDetails(true);
  };

  const handleCloseUserDetails = () => {
    setOpenUserDetails(false);
  };

  // Handle create new user
  const [openCreateUser, setOpenCreateUser] = useState(false);

  const handleCreateUser = () => {
    setOpenCreateUser(true);
  };

  const handleCloseCreateUser = async () => {
    await fetchUsers();
    setOpenCreateUser(false);
  };

  const handleCloseDefaultCreateUser = () => {
    setOpenCreateUser(false);
  };

  // Handle edit user
  const [openEditUser, setOpenEditUser] = useState(false);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenEditUser(true);
  };

  const handleCloseEditUser = async () => {
    await fetchUsers();
    setOpenEditUser(false);
    setSelectedUser(null);
  };

  const handleCloseDefaultEditUser = () => {
    setOpenEditUser(false);
    setSelectedUser(null);
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    await UserService.deleteUser(userId);
    await fetchUsers();
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        size: 150,
      },
      {
        accessorKey: "username",
        header: "Username",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 150,
      },
      {
        accessorKey: "faculty",
        header: "Faculty",
        size: 150,
      },
      {
        header: "Actions",
        size: 150,
        Cell: ({ cell }) => (
          <div className="action-buttons">
            <GrView
              className="act-btn"
              onClick={() => handleViewUserDetails(cell.row.original)}
            />
            <AiFillEdit
              className="act-btn"
              onClick={() => handleEditUser(cell.row.original)}
            />
            <MdDelete
              className="act-btn"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this user?")
                ) {
                  handleDeleteUser(cell.row.original._id);
                }
              }}
            />
          </div>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: users,
  });

  return (
    <div className="content-container">
      <h1>User Management</h1>
      <button className="btn btn-success" onClick={() => handleCreateUser()}>
        Create new user
      </button>
      <div className="user-index">
        {loading ? (
          <div className="loading">
            <div className="loader"></div>
          </div>
        ) : (
          <MaterialReactTable table={table} />
        )}
      </div>
      {openCreateUser && (
        <UserAddingForm
          open={openCreateUser}
          close={handleCloseCreateUser}
          closeDefault={handleCloseDefaultCreateUser}
          refreshUsers={fetchUsers}
          roleOptions={roleOptions}
          facultyOptions={facultyOptions}
        />
      )}
      {selectedUser && openUserDetails && (
        <UserInfo
          open={openUserDetails}
          close={handleCloseUserDetails}
          user={selectedUser}
        />
      )}
      {selectedUser && openEditUser && (
        <EditUserForm
          open={openEditUser}
          close={handleCloseEditUser}
          closeDefault={handleCloseDefaultEditUser}
          user={selectedUser}
          refreshUsers={fetchUsers}
          roleOptions={roleOptions}
          facultyOptions={facultyOptions}
        />
      )}
    </div>
  );
};

export default UserIndex;
