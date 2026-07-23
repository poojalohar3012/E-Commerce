import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    getAllUsers,
    updateUserRole,
} from "../../services/admin.service";




function Users() {

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [searchInput, setSearchInput] = useState("");

    const [search, setSearch] = useState("");

    const [role, setRole] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);



    const fetchUsers = async () => {

        try {

            setLoading(true);


            const response = await getAllUsers({
                search,
                role,
                page,
                limit: 10
            });


            setUsers(response.users);

            setTotalPages(
                response.totalPages
            );


        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load users"
            );

        } finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        fetchUsers();

    }, [
        search,
        role,
        page
    ]);

    useEffect(() => {

    const timer = setTimeout(() => {
        setSearch(searchInput);
        setPage(1);
    }, 500);


    return () => clearTimeout(timer);

}, [searchInput]);




    const handleRoleChange = async (
        id,
        currentRole
    ) => {

        try {

            const newRole =
                currentRole === "admin"
                    ? "user"
                    : "admin";


            await updateUserRole(
                id,
                newRole
            );


            toast.success(
                "User role updated"
            );


            fetchUsers();


        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to update role"
            );

        }

    };



    if (loading) {

        return (
            <h2 className="text-center mt-10">
                Loading Users...
            </h2>
        );

    }



    return (

        <div className="p-6">


            <h1 className="text-3xl font-bold mb-6">
                User Management
            </h1>



            {/* Filters */}

            <div className="flex gap-4 mb-6">


                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                    className="border p-3 rounded-lg w-80"
                />



                <select

                    value={role}

                    onChange={(e) => {

                        setRole(e.target.value);
                        setPage(1);

                    }}

                    className="border p-3 rounded-lg"

                >

                    <option value="">
                        All Roles
                    </option>

                    <option value="user">
                        Users
                    </option>

                    <option value="admin">
                        Admins
                    </option>


                </select>


            </div>




            <div className="overflow-x-auto bg-white shadow rounded-lg">


                <table className="min-w-full">


                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-3 text-left">
                                Name
                            </th>

                            <th className="p-3 text-left">
                                Email
                            </th>

                            <th className="p-3 text-left">
                                Role
                            </th>

                            <th className="p-3 text-left">
                                Joined
                            </th>

                            <th className="p-3 text-center">
                                Actions
                            </th>

                        </tr>

                    </thead>



                    <tbody>


                        {
                            users.length > 0 ? (

                                users.map((user) => (

                                    <tr
                                        key={user._id}
                                        className="border-t hover:bg-gray-50"
                                    >


                                        <td className="p-3">
                                            {user.name}
                                        </td>


                                        <td className="p-3">
                                            {user.email}
                                        </td>


                                        <td className="p-3">

                                            <span
                                                className={`px-3 py-1 rounded text-white ${user.role === "admin"
                                                        ? "bg-red-500"
                                                        : "bg-green-500"
                                                    }`}
                                            >
                                                {user.role}
                                            </span>

                                        </td>


                                        <td className="p-3">

                                            {
                                                new Date(
                                                    user.createdAt
                                                ).toLocaleDateString()
                                            }

                                        </td>


                                        <td className="p-3 text-center">


                                            <button

                                                onClick={() =>
                                                    handleRoleChange(
                                                        user._id,
                                                        user.role
                                                    )
                                                }

                                                className="bg-yellow-500 text-white px-3 py-1 rounded"

                                            >

                                                {
                                                    user.role === "admin"
                                                        ? "Make User"
                                                        : "Make Admin"
                                                }

                                            </button>


                                        </td>


                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center p-5"
                                    >
                                        No users found
                                    </td>

                                </tr>

                            )

                        }


                    </tbody>


                </table>


            </div>




            {/* Pagination */}


            <div className="flex justify-center gap-4 mt-6">


                <button

                    disabled={page === 1}

                    onClick={() =>
                        setPage(page - 1)
                    }

                    className="px-4 py-2 bg-gray-200 rounded"

                >

                    Previous

                </button>



                <span className="px-4 py-2">

                    Page {page} of {totalPages}

                </span>




                <button

                    disabled={
                        page === totalPages
                    }

                    onClick={() =>
                        setPage(page + 1)
                    }

                    className="px-4 py-2 bg-gray-200 rounded"

                >

                    Next

                </button>


            </div>


        </div>

    );

}


export default Users;