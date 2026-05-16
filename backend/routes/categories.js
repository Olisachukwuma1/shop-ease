 
const express = require('express')
const router = express.Router()
const Category = require('../models/Category')
const auth = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

// @route GET /api/categories
// @desc Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 })
    res.json(categories)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route GET /api/categories/:id
// @desc Get single category (public)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.json(category)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route POST /api/categories
// @desc Create category (protected)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' })
    }

    const existingCategory = await Category.findOne({ name })
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' })
    }

    const category = new Category({
      name,
      description: description || null,
      image: req.file ? req.file.path : null,
    })

    await category.save()
    res.status(201).json(category)
  } catch (_err) {
    console.error('Category error:', _err.message)
    res.status(500).json({ message: _err.message || 'Server error' })
  }
})

// @route PUT /api/categories/:id
// @desc Update category (protected)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body

    const updateData = { name, description }

    if (req.file) {
      updateData.image = req.file.path
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json(category)
  } catch (_err) {
    console.error('Category error:', _err.message)
    res.status(500).json({ message: _err.message || 'Server error' })
  }
})

// @route DELETE /api/categories/:id
// @desc Delete category (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.json({ message: 'Category deleted successfully' })
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router