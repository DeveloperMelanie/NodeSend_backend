import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

import User from '../models/User.js'

export const authenticateUser = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
        res.status(401).json({
            msg: 'No tengo ningún usuario con ese email, intenta registrarte 😉',
        })
        return next()
    }

    // Check if password is correct
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
        res.status(401).json({
            msg: 'Esa no es la contraseña 🤨',
        })
        return next()
    }

    // Create token
    const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {
            expiresIn: '8h',
        }
    )

    res.status(200).json({ token })
}

export const getUser = async (req, res) => {
    res.status(200).json({ user: req.user })
}
