const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.price ||
      !req.body.category ||
      !req.files
    ) {
      return res.status(400).json({
        error:
          'All fields (title, description, price, category, media) are required.',
      });
    }

    // Upload media (image or video) to Cloudinary
    const mediaResults = await Promise.all(
      req.files['media'].map(async (file) => {
        return await new Promise((resolve, reject) => {
          const streamLoad = cloudinary.uploader.upload_chunked_stream(
            {
              resource_type: req.body.mediaType,
              folder: `products/${req.user._id}`,
            },
            function (error, result) {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            },
          );
          streamLoad.end(file.buffer);
        });
      }),
    );

    const product = new Product({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      media: mediaResults.map((result) => ({
        type: result.mimetype.startsWith('image') ? 'image' : 'video',
        public_id: result.public_id,
        url: result.secure_url,
      })),
    });

    await product.save();

    res.status(201).json({ product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating the product' });
  }
};

// Get a list of products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};

// Get a specific product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve the product' });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.price ||
      !req.body.category
    ) {
      return res.status(400).json({
        error: 'All fields (title, description, price, category) are required.',
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete old media files if present
    if (req.body.media && product.media && product.media.length > 0) {
      await Promise.all(
        product.media.map(async (file) => {
          await cloudinary.uploader.destroy(file.public_id, {
            folder: `products/${req.user._id}`,
          });
        }),
      );
      product.media = [];
    }

    if (req.files) {
      // Upload new media files
      const mediaResults = await Promise.all(
        req.files['media'].map(async (file) => {
          return await new Promise((resolve, reject) => {
            const streamLoad = cloudinary.uploader.upload_chunked_stream(
              { resource_type: req.body.mediaType, folder: 'products' },
              function (error, result) {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              },
            );
            streamLoad.end(file.buffer);
          });
        }),
      );

      product.media = mediaResults.map((result) => ({
        mediaType: req.body.mediaType,
        public_id: result.public_id,
        url: result.url,
      }));
    }

    // Check if the user owns the product (you may need to implement this check)
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;
    product.category = req.body.category;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Product update failed' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the user owns the product (you may need to implement this check)
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete media from Cloudinary
    if (product.media && product.media.length > 0) {
      await Promise.all(
        product.media.map(async (file) => {
          await cloudinary.uploader.destroy(file.public_id, {
            folder: `products/${req.user._id}`,
          });
        }),
      );
    }

    await product.remove();

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Product deletion failed' });
  }
};
