const copyNodeModules = require('copy-node-modules');
const path = require('path');

const copyDir = (sourceDirs, destinationDir) => {
    const folder = sourceDirs.shift();

    if (!folder) {
        // eslint-disable-next-line no-console
        console.error('\nCopy node dependencies for server done');
        return;
    }

    copyNodeModules(folder, destinationDir, { devDependencies: false }, (err, results) => {
        // eslint-disable-next-line no-console
        console.log(`\nProcess folder ${folder}`);

        if (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            return;
        }

        results.forEach((entry) => {
            // eslint-disable-next-line no-console
            console.log(`Copy package name: ${entry.name}, version: ${entry.version}`);
        });

        copyDir(sourceDirs, destinationDir);
    });
};

if (require.main === module) {
    const args = process.argv.slice(2);
    const projectDir = args[0];
    const dstDir = args[1];

    if (!projectDir) {
        console.error('Please provide project directory');
        process.exit(1);
    }

    if (!dstDir) {
        console.error('Please provide destination directory');
        process.exit(1);
    }

    // Copy dependencies
    const srcDir = [path.resolve(projectDir, `./`)];
    const dirs = [...srcDir];

    console.log(`Copy dependencies for server. Project direcory ${projectDir}`);
    copyDir(dirs, dstDir);
}

module.exports = copyDir;
