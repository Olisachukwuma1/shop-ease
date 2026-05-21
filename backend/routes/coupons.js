const express = require('express')
const router = express.Router()
const Coupon = require('../models/Coupon')
const auth = require('../middleware/auth')

// @route GET /api/coupons
// @desc Get all coupons (admin)
router.get('/', auth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    res.json(coupons)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route POST /api/coupons
// @desc Create coupon (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive } = req.body

    if (!code || !discountType || !discountValue) {
      return res.status(400).json({ message: 'Code, discount type and value are required' })
    }

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() })
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' })
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxUses: maxUses || null,
      expiresAt: expiresAt || null,
      isActive: isActive !== undefined ? isActive : true,
    })

    await coupon.save()
    res.status(201).json(coupon)
  } catch (_err) {
    console.error('Coupon error:', _err.message)
    res.status(500).json({ message: _err.message || 'Server error' })
  }
})

// @route PUT /api/coupons/:id
// @desc Update coupon (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive } = req.body

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minOrderAmount,
        maxUses,
        expiresAt,
        isActive,
      },
      { new: true }
    )

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' })
    }

    res.json(coupon)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route DELETE /api/coupons/:id
// @desc Delete coupon (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id)
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' })
    }
    res.json({ message: 'Coupon deleted successfully' })
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route POST /api/coupons/apply
// @desc Apply coupon (user)
router.post('/apply', auth, async (req, res) => {
  try {
    const { code, orderAmount } = req.body

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' })
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() })

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' })
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: 'This coupon is no longer active' })
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired' })
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ message: 'This coupon has reached its maximum uses' })
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount of ₦${coupon.minOrderAmount.toLocaleString()} required for this coupon`,
      })
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discountValue) / 100
    } else {
      discountAmount = coupon.discountValue
    }

    // Make sure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount)

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalAmount: orderAmount - discountAmount,
      message: `Coupon applied! You save ₦${discountAmount.toLocaleString()}`,
    })
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router