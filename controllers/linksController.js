import shortid from 'shortid'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

import Link from '../models/Link.js'

export const createLink = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { originalName, name } = req.body

    const link = new Link()
    link.url = shortid.generate()
    link.name = name
    link.originalName = originalName

    // If user is authenticated
    if (req.user) {
        const { password, downloads } = req.body

        if (downloads) link.downloads = downloads
        if (password) {
            const salt = await bcrypt.genSalt(10)
            link.password = await bcrypt.hash(password, salt)
        }

        link.author = req.user.id
    }

    try {
        await link.save()
        res.status(201).json({ url: link.url })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            msg: 'Ha ocurrido un error, inténtalo más tarde',
        })
    }
}

export const hasPassword = async (req, res, next) => {
    const { url } = req.params

    // Check if link exists
    const link = await Link.findOne({ url })
    if (!link) {
        return res.status(404).json({
            msg: 'El enlace no existe',
        })
    }

    if (link.password) {
        return res.status(200).json({ password: true, link: link.url })
    }

    next()
}

export const getLink = async (req, res) => {
    const { url } = req.params

    // Check if link exists
    const link = await Link.findOne({ url })
    if (!link) {
        return res.status(404).json({
            msg: 'El enlace no existe',
        })
    }

    res.status(200).json({ url: link.name })
}

export const verifyPassword = async (req, res, next) => {
    const { url } = req.params
    const { password } = req.body

    // Check if link exists
    const link = await Link.findOne({ url })
    if (!link) {
        return res.status(404).json({
            msg: 'El enlace no existe',
        })
    }

    // Check if password is correct
    const isMatch = bcrypt.compareSync(password, link.password)
    if (!isMatch) {
        return res.status(401).json({
            msg: 'No era esa 😕',
        })
    }

    next()
}
