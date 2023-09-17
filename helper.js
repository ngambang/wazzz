function toArray(params) {
    return JSON.parse(JSON.stringify(params));
}

module.exports = { toArray }