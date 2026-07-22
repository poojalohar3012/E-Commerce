import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getProductById,
    updateProduct
} from "../../services/product.service";


function EditProduct() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [formData, setFormData] = useState({

        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",

    });


    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(false);



    useEffect(() => {

        fetchProduct();

    }, []);



    const fetchProduct = async () => {

        try {

            const response = await getProductById(id);

            const product = response.data;


            setFormData({

                name: product.name,

                description: product.description,

                price: product.price,

                category: product.category,

                stock: product.stock,

            });


        } catch(error) {

            toast.error("Failed to load product");

        }

    };



    const handleChange = (e)=>{

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };



    const handleSubmit = async(e)=>{

        e.preventDefault();


        try {

            setLoading(true);


            const data = new FormData();


            Object.keys(formData).forEach((key)=>{

                data.append(
                    key,
                    formData[key]
                );

            });



            if(image){

                data.append(
                    "image",
                    image
                );

            }



            await updateProduct(
                id,
                data
            );


            toast.success(
                "Product updated successfully"
            );


            navigate("/admin/products");



        } catch(error){

            toast.error(
                error.response?.data?.message ||
                "Update failed"
            );


        } finally {

            setLoading(false);

        }

    };



    return (

        <div>

            <h1 className="text-3xl font-bold mb-8">
                Edit Product
            </h1>



            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow max-w-xl space-y-5"
            >


                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                />


                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                />


                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                />


                <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                />


                <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                />



                <input
                    type="file"
                    accept="image/*"
                    onChange={(e)=>setImage(e.target.files[0])}
                />



                <button
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded w-full"
                >

                    {
                        loading
                        ? "Updating..."
                        : "Update Product"
                    }

                </button>


            </form>


        </div>

    );

}


export default EditProduct;