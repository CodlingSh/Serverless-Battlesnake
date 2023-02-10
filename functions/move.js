exports.handler = async event => {
    try {
        // const body = JSON.parse(event.body);
        // console.log(body);
        console.log(event);
        // return res({ligma: "balls"});
        return res(event);
    } catch (error) {
        return res({ error }, 500)
    }
}

function res(o, statusCode = 200) {
    return { statusCode, body: JSON.stringify(o) }
}