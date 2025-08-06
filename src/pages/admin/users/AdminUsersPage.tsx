import React from "react";
import adminApi from "../api";

export const AdminUsersPage = () => {
    const [, setUsers] = React.useState([]);
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await adminApi.fetchAllUser();
                setUsers(res);
                console.log(res)
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        }
        fetchData();
    }, [])
    return (
        <div>Admin Users Page </div>
    )
}
