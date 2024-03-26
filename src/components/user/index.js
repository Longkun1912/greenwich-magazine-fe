import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import "../../css/User.css";
import EditUserForm from "../../modals/edit.user";
import UserInfo from "../../modals/view.user";
import UserService from "../../services/user.service";

const UserIndex = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    await UserService.viewSystemUsers().then((response) => {
      setUsers(response.data);
      setLoading(false);
    });
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

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    await UserService.deleteUser(userId);
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
      <div className="user-index">
        {loading ? (
          <div className="loading">
            <div className="loader"></div>
          </div>
        ) : (
          <MaterialReactTable table={table} />
        )}
      </div>
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
          user={selectedUser}
          refreshUsers={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserIndex;
