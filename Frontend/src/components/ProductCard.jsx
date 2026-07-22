import { Link } from "react-router-dom";

function ProductCard({ product }) {

    const image =
        typeof product.image === "string"
            ? product.image
            : product.image?.url;

    return (
         <Link to={`/products/${product._id}`}>
        <div className="border rounded-lg shadow-lg p-4 hover:shadow-xl transition">

            <img
                src={image}
                alt={product.name}
                className="w-full h-52 object-cover rounded"
            />

            <h2 className="text-xl font-semibold mt-3">
                {product.name}
            </h2>

            <p className="text-gray-500">
                {product.description}
            </p>

            <p className="text-2xl font-bold mt-3">
                ₹{product.price}
            </p>

        </div>
         </Link>
    );
}

export default ProductCard;