const babel = require("@babel/core")
const babel_preset_env = require("@babel/preset-env")
const babel_preset_typescript = require("@babel/preset-typescript")
const babel_plugin_proposal_decorators = require("@babel/plugin-proposal-decorators")
const babel_plugin_proposal_class_properties = require("@babel/plugin-proposal-class-properties")
const babel_plugin_proposal_object_rest_spread = require("@babel/plugin-proposal-object-rest-spread")
const babel_plugin_proposal_optional_chaining = require("@babel/plugin-proposal-optional-chaining")
const babel_plugin_transform_typescript_metadata = require("babel-plugin-transform-typescript-metadata")
const http = require("http")

function transpile(filename, code) {
    const ext = filename.split(".").pop().toLowerCase()
    const plugins = [
        // NB: plugin-transform-typescript-metadata must go before
        //     plugin-proposal-decorators!
        babel_plugin_transform_typescript_metadata,
        // NB: plugin-proposal-decorators must go before
        //     plugin-proposal-class-properties!
        [
            babel_plugin_proposal_decorators, {
            decoratorsBeforeExport: true
        }],
        babel_plugin_proposal_class_properties,
        babel_plugin_proposal_object_rest_spread,
        babel_plugin_proposal_optional_chaining
    ]

    if (ext == "ts") {
        return babel.transform(code, {
            filename: filename,
            presets: [
                babel_preset_typescript,
                babel_preset_env
            ],
            plugins: plugins,
            sourceMaps: "inline"
        })
    } else {
        return babel.transform(code, {
            filename: filename,
            presets: [
                babel_preset_env
            ],
            plugins: plugins,
            sourceMaps: "inline"
        })
    }
}

const server = http.createServer(function(request, response) {
    if (request.method !== "POST") {
        response.writeHead(404)
        response.end()
        return
    }

    const chunks = []

    request.on("data", function(data) {
        chunks.push(data)
    })

    request.on("end", function() {
        try {
            const input = JSON.parse(Buffer.concat(chunks))

            if (input.quit) {
                response.end()
                process.exit(0)
            }

            response.end(JSON.stringify({
                code: transpile(input.filename, input.code).code
            }))
        } catch (err) {
            response.end(JSON.stringify({
                message: err.message,
                codeFrame: err.codeFrame
            }))
        }
    })
})

server.listen(0, "127.0.0.1", function() {
    process.stdout.write("port:" + server.address().port + "\n")
})
