const http = require("http")
const fs = require("fs")

if (process.argv.length != 4) {
    console.error("Usage: client.js <port> <filename>")
    process.exit(1)
}

const port = parseInt(process.argv[2])
const filename = process.argv[3]

const request = http.request({
    host: "127.0.0.1",
    port: port,
    method: "POST"
}, function(response) {
    const chunks = []

    response.on("data", function(data) {
        chunks.push(data)
    })

    response.on("end", function() {
        const result = JSON.parse(Buffer.concat(chunks))
        
        if (result.code) {
            console.log(result.code)
            return
        }

        console.error(result.message)
        if (result.codeFrame)
            console.error(result.codeFrame)
        process.exit(1)
    })
})

fs.readFile(filename, "utf8", function(err, data) {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    request.end(JSON.stringify({
        filename: filename,
        code: data
    }))
})
