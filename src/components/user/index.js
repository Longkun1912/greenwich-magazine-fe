import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import UserService from "../../services/user.service";

const UserIndex = () => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    await UserService.viewSystemUsers().then((response) => {
      setUsers(response.data);
    });
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
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: users, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return (
    <div className="content-container">
      <h1>User Management</h1>
      <div className="user-index">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

export default UserIndex;
