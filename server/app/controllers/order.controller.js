const Order = require('../models/Order');
const Paypal = require('../../paypal-api');
const cloudinary = require('../utils/cloudinary');

// Create paypal order
exports.createPaypalOrder = async (req, res) => {
  try {
    console.log('createPaypalOrder');
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await Paypal.createOrder(cart);
    console.log(jsonResponse);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Failed to create order.' });
  }
};
// Capture order
exports.captureOrder = async (req, res) => {
  try {
    console.log('captureOrder');

    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await Paypal.captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Failed to capture order.' });
  }
};

// Create a new order

exports.createOrder1 = async (req, res) => {
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
              folder: `orders/${req.user._id}`,
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

    const order = new Order({
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

    await order.save();

    res.status(201).json({ order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating the order' });
  }
};

// Get a list of orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve the order' });
  }
};

// Update a order
exports.updateOrder = async (req, res) => {
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

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Delete old media files if present
    if (req.body.media && order.media && order.media.length > 0) {
      await Promise.all(
        order.media.map(async (file) => {
          await cloudinary.uploader.destroy(file.public_id, {
            folder: `orders/${req.user._id}`,
          });
        }),
      );
      order.media = [];
    }

    if (req.files) {
      // Upload new media files
      const mediaResults = await Promise.all(
        req.files['media'].map(async (file) => {
          return await new Promise((resolve, reject) => {
            const streamLoad = cloudinary.uploader.upload_chunked_stream(
              { resource_type: req.body.mediaType, folder: 'orders' },
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

      order.media = mediaResults.map((result) => ({
        mediaType: req.body.mediaType,
        public_id: result.public_id,
        url: result.url,
      }));
    }

    // Check if the user owns the order (you may need to implement this check)
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    order.title = req.body.title;
    order.description = req.body.description;
    order.price = req.body.price;
    order.category = req.body.category;

    await order.save();
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Order update failed' });
  }
};

// Delete a order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the user owns the order (you may need to implement this check)
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete media from Cloudinary
    if (order.media && order.media.length > 0) {
      await Promise.all(
        order.media.map(async (file) => {
          await cloudinary.uploader.destroy(file.public_id, {
            folder: `orders/${req.user._id}`,
          });
        }),
      );
    }

    await order.remove();

    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Order deletion failed' });
  }
};
