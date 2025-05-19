import products from '../models/products.js'
import dotenv from 'dotenv'
dotenv.config()




const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, region, state, city, images, contactEmail } = req.body;

        if (!name || !description || !price || !category || !region || !contactEmail) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Create a new product
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized: User information is missing." });
        }

        const newProduct = await products.create({
            name,
            description,
            price,
            state,
            city,
            category,
            region,
            images,
            contactEmail,
            user: req.user.userId, 
        });

        res.status(201).json({ message: "Product created successfully.", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error creating product.", error: error.message });
    }
};

// get all the products by user id
const getProductsByUserId = async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID from the authenticated user
        const userProducts = await products.find({ user: userId });

        if (!userProducts || userProducts.length === 0) {
            return res.status(404).json({ message: "No products found for this user." });
        }

        res.status(200).json(userProducts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products.", error: error.message });
    }
}


// get all the products 
const getProducts = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized: User information is missing." });
        }

        const allProducts = await products.find();
        res.status(200).json(allProducts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products.", error: error.message });
    }
};
// get a single product by id
const getProductById = async (req, res) => {
    try {
        const product = await products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product.", error: error.message });
    }
};
// update a product by id       

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, region, images, contactEmail } = req.body;

        if (!name || !description || !price || !category || !region || !contactEmail) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        const updatedProduct = await products.findByIdAndUpdate(
            req.params.id,
            { name, description, price, category, region, images, contactEmail },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json({ message: "Product updated successfully.", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product.", error: error.message });
    }
}
// delete a product by id
const deleteProduct = async (req, res) => {
    try {
        const product = await products.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product.", error: error.message });
    }
}


export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByUserId
}

