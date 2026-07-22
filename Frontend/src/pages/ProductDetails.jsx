import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/product.service";
import { addToCart } from "../services/cart.service";

function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const handleAddToCart = async () => {
    try {
        setAdding(true);

        await addToCart({
            productId: product._id,
            quantity: 1,
        });

        alert("Product added to cart successfully!");
    } catch (error) {
        console.error(error);

        alert(
            error.response?.data?.message ||
            "Failed to add product to cart"
        );
    } finally {
        setAdding(false);
    }
};

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                setProduct(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-2xl font-semibold">
                    Product not found
                </h2>
            </div>
        );
    }

    const image =
        typeof product.image === "string"
            ? product.image
            : product.image?.url;

    return (
        <div className="max-w-6xl mx-auto p-6">

            <div className="grid md:grid-cols-2 gap-10">

                <img
                    src={image}
                    alt={product.name}
                    className="w-full rounded-lg shadow-lg"
                />

                <div>

                    <h1 className="text-4xl font-bold">
                        {product.name}
                    </h1>

                    <p className="text-gray-600 mt-4">
                        {product.description}
                    </p>

                    <p className="text-3xl font-bold text-green-600 mt-6">
                        ₹{product.price}
                    </p>

                    <p className="mt-4">
                        <strong>Category:</strong> {product.category}
                    </p>

                    <p className="mt-2">
                        <strong>Stock:</strong> {product.stock}
                    </p>

                   <button
                        onClick={handleAddToCart}
                        disabled={adding}
                        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                    {adding ? "Adding..." : "Add to Cart"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ProductDetails;