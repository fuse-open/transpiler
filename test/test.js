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

    fs.writeFileSync(path.join(__dirname, file) + ".g.js", String(client.stdout));
    return client.status;
}

function runTests(port) {
    let failed = 0;

    for (file of fs.readdirSync(__dirname)) {
        if (file.endsWith('.g.js'))
            continue;

        switch (file.split('.').pop()) {
            case "ts":
            case "js":
                break;
            default:
                continue;
        }

        console.log(file);
        const status = transpile(port, file);

        if (status != 0)
            failed++;
    }

    if (!failed)
        console.log(`\nall tests passed`);
    else
        console.log(`\n${failed} tests failed`);

    return failed;
}

// Start transpiler server.
const server = spawn("node", [
    process.argv.length > 2
        ? process.argv[2]
        : path.join(__dirname, "..", "src", "server.js")
]);

server.stdout.on('data', data => {
    // Get port from log.
    const port = data.toString().trim().split(":")[1];

    // Run test suite.
    process.exit(runTests(port));
});
