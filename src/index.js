const core = require('@actions/core')
const { getBadge, getCoverageBadge, getLinesBadge } = require('./badges.js')
const opentype = require('opentype.js')
const fs = require('fs')
const path = require('path')

;(async () => {
    try {
        const theme = core.getInput('theme')
        const status = core.getInput('status')
        const os = core.getInput('os')
        const coverage = core.getInput('coverage')
        const linesData = core.getInput('lines_data')

        const dark = theme === 'dark'
        let svg

        if (status !== '') {
            svg = getBadge(os, status, dark)
        } else {
            const fontPath = path.normalize(path.join(__dirname, '..', 'fonts', 'Outfit-Medium.ttf'))
            const buffer = (await fs.promises.readFile(fontPath)).buffer
            const fontMedium = opentype.parse(buffer)

            if (coverage !== '') {
                svg = getCoverageBadge(fontMedium, coverage, dark)
            } else {
                const fontPath = path.normalize(path.join(__dirname, '..', 'fonts', 'Outfit-Regular.ttf'))
                const buffer = (await fs.promises.readFile(fontPath)).buffer
                const fontRegular = opentype.parse(buffer)
                const data = JSON.parse(linesData)

                svg = getLinesBadge(fontMedium, fontRegular, data, dark)
            }
        }

        core.setOutput('svg', svg)
    } catch (error) {
        core.setFailed(error.message)
    }
})()
