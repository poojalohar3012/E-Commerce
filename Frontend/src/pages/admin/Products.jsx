import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllProducts, deleteProduct } from "../../services/product.service";


function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchProducts = async () => {

        try {

            const response = await getAllProducts();

           setProducts(response.data || []);
        } catch(error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load products"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchProducts();

    }, []);



    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );


        if(!confirmDelete) return;


        try {

            await deleteProduct(id);

            toast.success("Product deleted");

            fetchProducts();


        } catch(error) {

            toast.error(
                error.response?.data?.message ||
                "Delete failed"
            );

        }

    };



    if(loading){

        return (
            <h1 className="text-2xl">
                Loading products...
            </h1>
        );

    }



    return (

        <div>

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-3xl font-bold">
                    Products
                </h1>


                <Link
                    to="/admin/products/add"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                    + Add Product
                </Link>

            </div>



            <div className="bg-white rounded-xl shadow overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="border-b">

                            <th className="p-4 text-left">
                                Image
                            </th>

                            <th className="p-4 text-left">
                                Name
                            </th>

                            <th className="p-4 text-left">
                                Category
                            </th>

                            <th className="p-4 text-left">
                                Price
                            </th>

                            <th className="p-4 text-left">
                                Stock
                            </th>

                            <th className="p-4 text-left">
                                Action
                            </th>

                        </tr>

                    </thead>



                    <tbody>

                    {
                        products.map((product)=>(

                            <tr
                                key={product._id}
                                className="border-b"
                            >

                                <td className="p-4">

                                    <img
                                        src={product.image?.url}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />

                                </td>


                                <td className="p-4">
                                    {product.name}
                                </td>


                                <td className="p-4">
                                    {product.category}
                                </td>


                                <td className="p-4">
                                    ₹{product.price}
                                </td>


                                <td className="p-4">
                                    {product.stock}
                                </td>


                                <td className="p-4 space-x-3">

                                    <Link
                                        to={`/admin/products/edit/${product._id}`}
                                        className="text-blue-600"
                                    >
                                        Edit
                                    </Link>


                                    <button
                                        onClick={() =>
                                            handleDelete(product._id)
                                        }
                                        className="text-red-600"
                                    >
                                        Delete
                                    </button>

                                </td>


                            </tr>

                        ))
                    }


                    </tbody>

                </table>

            </div>


        </div>

    );

}


export default Products;