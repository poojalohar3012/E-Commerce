import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../services/admin.service";


function OrderDetails(){

    const { id } = useParams();

    const [order,setOrder] = useState(null);


    useEffect(()=>{

        const fetchOrder = async()=>{

            const response = await getOrderById(id);

            setOrder(response.order);

        }

        fetchOrder();

    },[id]);



    if(!order){

        return <h2>Loading...</h2>

    }


    return (

        <div>

            <h1 className="text-3xl font-bold mb-6">
                Order Details
            </h1>


            <div className="bg-white p-6 rounded shadow">


                <h2 className="text-xl font-bold">
                    Customer
                </h2>

                <p>
                    {order.user.name}
                </p>

                <p>
                    {order.user.email}
                </p>



                <h2 className="text-xl font-bold mt-6">
                    Shipping Address
                </h2>

                <p>
                    {order.shippingAddress.address}
                </p>

                <p>
                    {order.shippingAddress.city}
                </p>



                <h2 className="text-xl font-bold mt-6">
                    Products
                </h2>


                {
                    order.orderItems.map(item=>(

                        <div key={item._id}
                        className="border-b py-2">

                            {item.name} 
                            {" "}x{" "}
                            {item.quantity}

                        </div>

                    ))
                }



                <h2 className="text-xl font-bold mt-6">
                    Payment
                </h2>

                <p>
                    Method: {order.paymentMethod}
                </p>

                <p>
                    Status: {order.paymentStatus}
                </p>


                <h2 className="text-xl font-bold mt-6">
                    Total: ₹{order.totalPrice}
                </h2>


            </div>

        </div>

    )

}


export default OrderDetails;