import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProduct } from "../../services/product.service";


function AddProduct() {

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



    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value,

        });

    };



    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            setLoading(true);


            const data = new FormData();


            data.append(
                "name",
                formData.name
            );


            data.append(
                "description",
                formData.description
            );


            data.append(
                "price",
                formData.price
            );


            data.append(
                "category",
                formData.category
            );


            data.append(
                "stock",
                formData.stock
            );


            data.append(
                "image",
                image
            );



            const response = await createProduct(data);


            toast.success(
                "Product created successfully"
            );


            navigate("/admin/products");



        } catch(error) {


            toast.error(

                error.response?.data?.message ||
                "Failed to create product"

            );


        } finally {

            setLoading(false);

        }

    };




    return (

        <div>

            <h1 className="text-3xl font-bold mb-8">
                Add Product
            </h1>


            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow max-w-xl space-y-5"
            >


                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    required
                />


                <textarea

                    name="description"

                    placeholder="Description"

                    value={formData.description}

                    onChange={handleChange}

                    className="w-full border p-3 rounded"

                    required

                />



                <input

                    type="number"

                    name="price"

                    placeholder="Price"

                    value={formData.price}

                    onChange={handleChange}

                    className="w-full border p-3 rounded"

                    required

                />



                <input

                    type="text"

                    name="category"

                    placeholder="Category"

                    value={formData.category}

                    onChange={handleChange}

                    className="w-full border p-3 rounded"

                    required

                />



                <input

                    type="number"

                    name="stock"

                    placeholder="Stock"

                    value={formData.stock}

                    onChange={handleChange}

                    className="w-full border p-3 rounded"

                    required

                />



                <input

                    type="file"

                    accept="image/*"

                    onChange={(e)=>setImage(e.target.files[0])}

                    className="w-full"

                    required

                />



                <button

                    disabled={loading}

                    className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full"

                >

                    {
                        loading
                        ? "Creating..."
                        : "Create Product"
                    }


                </button>



            </form>


        </div>

    );

}


export default AddProduct;