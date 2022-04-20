import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

import User from '../models/User.js'

export const createUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Check if user already exists
    const user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).json({
            msg: 'Ya estás registrado, mejor inicia sesión 😉',
        })
    }

    // Create new user
    const newUser = new User(req.body)

    // Hash password
    const salt = await bcrypt.genSalt(10)
    newUser.password = await bcrypt.hash(newUser.password, salt)

    try {
        // Save user
        await newUser.save()
        res.status(201).json({ msg: 'Perfecto, he creado tu cuenta' })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            msg: 'Ha ocurrido un error, inténtalo más tarde',
        })
    }
}
