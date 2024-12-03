const core = require('@actions/core')
const { getBadge, getCoverageBadge } = require('./badges.js')
const opentype = require('opentype.js')
const fs = require('fs')
const path = require('path')

;(async () => {
    try {
        const theme = core.getInput('theme')
        const status = core.getInput('status')
        const os = core.getInput('os')
        const coverage = core.getInput('coverage')

        const dark = theme === 'dark'
        let svg

        if (status !== '') {
            svg = getBadge(os, status, dark)
        } else {
            const fontPath = path.normalize(path.join(__dirname, '..', 'fonts', 'Outfit-Medium.ttf'))
            const buffer = (await fs.promises.readFile(fontPath)).buffer
            const font = opentype.parse(buffer)
            svg = getCoverageBadge(font, coverage, dark)
        }

        core.setOutput('svg', svg)
    } catch (error) {
        core.setFailed(error.message)
    }
})()
