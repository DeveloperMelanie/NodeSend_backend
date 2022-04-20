import multer from 'multer'
import shortid from 'shortid'
import fs from 'fs'
import getExtension from '../helpers/getExtension.js'

import Link from '../models/Link.js'

const SIZES = {
    mbyte: 1024 * 1024,
    tenMbytes: 10 * 1024 * 1024,
}

export const uploadFile = async (req, res, next) => {
    const multerConfig = {
        limits: {
            fileSize: req.user ? SIZES.tenMbytes : SIZES.mbyte,
        },
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads/')
            },
            filename: (req, file, cb) => {
                const ext = getExtension(file.originalname)
                cb(null, `${shortid.generate()}${ext}`)
            },
        }),
    }

    const upload = multer(multerConfig).single('file')

    upload(req, res, async err => {
        if (!err) {
            return res.status(201).json({ file: req.file.filename })
        }
        console.error(err)
        return next()
    })
}

export const deleteFile = async (req, res) => {
    const { file } = req

    try {
        fs.unlinkSync(`uploads/${file}`)
    } catch (error) {
        console.error(error)
    }
}

export const downloadFile = async (req, res, next) => {
    const { file } = req.params
    const link = await Link.findOne({ name: file })

    const filePath = `uploads/${file}`
    res.download(filePath)

    const { downloads, name } = link

    if (downloads === 1) {
        // Delete link
        await Link.findOneAndDelete({ name })

        // Delete the file
        req.file = name
        return next()
    }

    link.downloads--
    await link.save()
}
