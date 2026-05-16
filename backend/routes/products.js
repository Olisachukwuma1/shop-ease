 
const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const auth = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

// @route GET /api/products
// @desc Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, featured } = req.query

    let query = {}

    // Filter by category
    if (category) {
      query.category = category
    }

    // Filter by featured
    if (featured) {
      query.featured = true
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    // Sort
    let sortOption = { createdAt: -1 }
    if (sort === 'price_asc') sortOption = { price: 1 }
    if (sort === 'price_desc') sortOption = { price: -1 }
    if (sort === 'latest') sortOption = { createdAt: -1 }
    if (sort === 'popular') sortOption = { sold: -1 }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sortOption)

    res.json(products)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route GET /api/products/:id
// @desc Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route POST /api/products
// @desc Create product (protected)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, stock, featured } = req.body

    const images = req.files ? req.files.map(file => file.path) : []

    const product = new Product({
      name,
      description,
      price,
      discountPrice: discountPrice || null,
      category,
      stock,
      featured: featured === 'true',
      images,
    })

    await product.save()
    res.status(201).json(product)
  } catch (_err) {
    console.error('Product error:', _err.message)
    res.status(500).json({ message: _err.message || 'Server error' })
  }
})

// @route PUT /api/products/:id
// @desc Update product (protected)
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, stock, featured } = req.body

    const updateData = {
      name,
      description,
      price,
      discountPrice: discountPrice || null,
      category,
      stock,
      featured: featured === 'true',
    }

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path)
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
  } catch (_err) {
    console.error('Product error:', _err.message)
    res.status(500).json({ message: _err.message || 'Server error' })
  }
})

// @route DELETE /api/products/:id
// @desc Delete product (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ message: 'Product deleted successfully' })
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router