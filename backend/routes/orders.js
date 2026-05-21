 
const express = require('express')
const router = express.Router()
const axios = require('axios')
const Order = require('../models/Order')
const Product = require('../models/Product')
const auth = require('../middleware/auth')
const Coupon = require('../models/Coupon')

// @route POST /api/orders/initialize
// @desc Initialize Paystack payment
router.post('/initialize', auth, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, couponCode } = req.body
    // Initialize Paystack transaction
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: req.user.email,
        amount: totalAmount * 100, // Paystack uses kobo
        currency: 'NGN',
        callback_url: `${process.env.CLIENT_URL}/checkout/verify`,
        metadata: {
          userId: req.user.id,
          items: JSON.stringify(items),
          shippingAddress: JSON.stringify(shippingAddress),
          couponCode,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    res.json({
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    })
  } catch (_err) {
    console.error('Paystack error:', _err.message)
    res.status(500).json({ message: _err.message || 'Server error' })
  }
})

// @route POST /api/orders/verify
// @desc Verify Paystack payment and create order
router.post('/verify', auth, async (req, res) => {
  try {
    const { reference } = req.body

    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const data = response.data.data

    if (data.status !== 'success') {
      return res.status(400).json({ message: 'Payment failed' })
    }

    // Get metadata
    const { userId, items, shippingAddress } = data.metadata
    const parsedItems = JSON.parse(items)
    const parsedAddress = JSON.parse(shippingAddress)

    // Create order
    const order = new Order({
      user: userId,
      items: parsedItems,
      shippingAddress: parsedAddress,
      totalAmount: data.amount / 100,
      paymentStatus: 'paid',
      paymentReference: reference,
      orderStatus: 'processing',
    })

    await order.save()
    // Update coupon used count if coupon was applied
if (data.metadata.couponCode) {
  await Coupon.findOneAndUpdate(
    { code: data.metadata.couponCode },
    { $inc: { usedCount: 1 } }
  )
}

    // Update product sold count and stock
    for (const item of parsedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { sold: item.quantity, stock: -item.quantity },
      })
    }

    res.json({ message: 'Order created successfully', order })
  } catch (_err) {
    console.error('Verify error:', _err.message)
    res.status(500).json({ message: _err.message || 'Server error' })
  }
})

// @route GET /api/orders
// @desc Get all orders (admin)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route GET /api/orders/my-orders
// @desc Get logged in user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route GET /api/orders/:id
// @desc Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price images')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route PUT /api/orders/:id/status
// @desc Update order status (admin)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { orderStatus } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router