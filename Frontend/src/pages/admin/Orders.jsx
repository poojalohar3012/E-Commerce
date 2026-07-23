import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/admin.service";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchOrders = async () => {

        try {

            const response = await getAllOrders();

            console.log(response);

            setOrders(response.orders);

        } catch(error) {

            toast.error("Failed to load orders");

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchOrders();

    }, []);



 const handleStatusChange = async (id, status) => {
    try {
        await updateOrderStatus(id, {
            orderStatus: status,
        });

        toast.success("Order status updated");
        fetchOrders();
    } catch (error) {
        console.error(error.response?.data);
        toast.error(
            error.response?.data?.message || "Failed to update status"
        );
    }
};



    if(loading){

        return <h2>Loading Orders...</h2>

    }


    return (

        <div>

            <h1 className="text-3xl font-bold mb-6">
                Manage Orders
            </h1>

            <div className="bg-white shadow rounded-lg overflow-x-auto">


            <table className="w-full table-fixed">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="p-4 text-left w-[25%]">
                            Customer
                        </th>

                        <th className="p-4 text-left w-[30%]">
                            Products
                        </th>


                        <th className="p-4 text-left w-[15%]">
                            Amount
                        </th>


                        <th className="p-4 text-left w-[15%]">
                            Payment
                        </th>


                        <th className="p-4 text-left w-[15%]">
                            Status
                        </th>

                        <th className="p-4 text-center w-[10%]">
                                Action
                        </th>


                    </tr>

                </thead>


                <tbody>


                {
                    orders.map((order)=>(


                    <tr 
                    key={order._id}
                    className="border-b"
                    >


                        <td className="p-4">

                            <p className="font-semibold">
                                {order.user?.name}
                            </p>

                            <p className="text-sm text-gray-500">
                                {order.user?.email}
                            </p>

                        </td>



                        <td className="p-4">

                            {
                                order.orderItems.map(item=>(

                                    <p key={item._id}>
                                        {item.name} x {item.quantity}
                                    </p>

                                ))
                            }

                        </td>



                        <td className="p-4 font-semibold">

                            ₹{order.totalPrice}

                        </td>


                        <td className="p-4">

                            <p>
                                {order.paymentMethod}
                            </p>

                            <span className="text-sm">
                                {order.paymentStatus}
                            </span>

                        </td>

                        


                        <td className="p-4">


                        <select

                        value={order.orderStatus}

                        onChange={(e)=>
                            handleStatusChange(
                                order._id,
                                e.target.value
                            )
                        }

                        className="border rounded px-3 py-2"

                        >

                            <option>
                                Processing
                            </option>

                            <option>
                                Shipped
                            </option>

                            <option>
                                Delivered
                            </option>

                            <option>
                                Cancelled
                            </option>


                        </select>


                        </td>
                         {/* ADD THIS */}
    <td className="p-4 text-center">

        <Link
            to={`/admin/orders/${order._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
            View
        </Link>

    </td>


                    </tr>


                    ))
                }


                </tbody>


            </table>


            </div>


        </div>

    )

}


export default Orders;