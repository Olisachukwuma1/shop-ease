const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Resend } = require('resend')
const User = require('../models/User')
const auth = require('../middleware/auth')

const resend = new Resend(process.env.RESEND_API_KEY)

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashedPassword })
    await user.save()
    res.status(201).json({ message: 'Account created successfully' })
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log('Login attempt:', email)

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    console.log('Login successful')

    // Generate OTP
    const code = generateCode()
    user.authCode = code
    user.authCodeExpires = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()
    console.log('=================================')
console.log('OTP CODE:', code)
console.log('FOR USER:', user.email)
console.log('=================================')

    console.log('Auth code:', code)

    // Send OTP via Resend
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Your Verification Code',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem; background: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #0a0a0a; margin-bottom: 1rem;">Your Verification Code</h2>
            <p style="color: #666; margin-bottom: 1.5rem;">Enter this code to complete your login:</p>
            <div style="background: #0a0a0a; color: #c9a84c; font-size: 2rem; font-weight: 700; text-align: center; padding: 1rem; border-radius: 4px; letter-spacing: 8px;">
              ${code}
            </div>
            <p style="color: #999; font-size: 0.85rem; margin-top: 1.5rem;">This code expires in 10 minutes.</p>
          </div>
        `,
      })
      console.log('OTP email sent successfully')
    } catch (emailErr) {
      console.log('Email failed (code still works):', emailErr.message)
    }

    // Temp token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role, verified: false },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    )

    res.json({ token })
  } catch (_err) {
    console.error('Login error:', _err.message)
    res.status(500).json({ message: _err.message || 'Server error' })
  }
})

// @route POST /api/auth/verify-code
router.post('/verify-code', async (req, res) => {
  try {
    const { code } = req.body
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' })
    }
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (user.authCode !== code) {
      return res.status(400).json({ message: 'Invalid code' })
    }
    if (user.authCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Code has expired' })
    }

    user.authCode = null
    user.authCodeExpires = null
    await user.save()

    // Final token
    const finalToken = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role, verified: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token: finalToken, message: 'Verified successfully' })
  } catch (_err) {
    console.error('Verify error:', _err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// @route POST /api/auth/resend-code
router.post('/resend-code', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' })
    }
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const code = generateCode()
    user.authCode = code
    user.authCodeExpires = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()
console.log('=================================')
console.log('RESENT OTP CODE:', code)
console.log('FOR USER:', user.email)
console.log('=================================')
    console.log('Resent auth code:', code)

    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Your New Verification Code',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem; background: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #0a0a0a;">Your New Verification Code</h2>
            <div style="background: #0a0a0a; color: #c9a84c; font-size: 2rem; font-weight: 700; text-align: center; padding: 1rem; border-radius: 4px; letter-spacing: 8px;">
              ${code}
            </div>
            <p style="color: #999; font-size: 0.85rem; margin-top: 1.5rem;">This code expires in 10 minutes.</p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.log('Email failed:', emailErr.message)
    }

    res.json({ message: 'Code resent successfully' })
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true }
    ).select('-password')
    res.json(user)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route POST /api/auth/admin/register
router.post('/admin/register', auth, async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashedPassword, role: 'admin' })
    await user.save()
    res.status(201).json({ message: 'Admin created successfully' })
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route GET /api/auth/admins
router.get('/admins', auth, async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password')
    res.json(admins)
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// @route DELETE /api/auth/admins/:id
router.delete('/admins/:id', auth, async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }
    res.json({ message: 'Admin deleted successfully' })
  } catch (_err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router