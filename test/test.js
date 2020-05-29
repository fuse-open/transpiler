const fs = require("fs");
const path = require("path");
const {spawn} = require("child_process");
const {spawnSync} = require("child_process");

function transpile(port, file) {
    const client = spawnSync("node", [
        path.join(__dirname, "..", "src", "client.js"),
        port, path.join(__dirname, file)
    ]);

    if (client.error)
        throw client.error;

    const stderr = String(client.stderr);
    if (stderr.length)
        console.error(stderr);

    return client.status;
}

function runTests(port) {
    let retval = 0;

    for (file of fs.readdirSync(__dirname)) {
        switch (file.split('.').pop()) {
            case "ts":
            case "js":
                break;
            default:
                continue;
        }

        console.log(file);
        const status = transpile(port, file);

        if (retval == 0 && status != 0)
            retval = status;
    }

    return retval;
}

// Start transpiler server.
const server = spawn("node", [
    path.join(__dirname, "..", "src", "server.js")
]);

server.stdout.on('data', data => {
    // Get port from log.
    const port = data.toString().trim().split(":")[1];

    // Run test suite.
    process.exit(runTests(port));
});
