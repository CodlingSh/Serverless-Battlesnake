exports.handler = async event => {
    try {
        return res({
            "apiversion": "1",
            "author": "codlinsh",
            "color": "#a9b4c2",
            "head": "caffine",
            "tail": "bolt",
            "version": "0.0.1-beta"
        })
    } catch (error) {
        return res({ error }, 500)
    }
}

function res(o, statusCode = 200) {
    return { statusCode, body: JSON.stringify(o) }
}