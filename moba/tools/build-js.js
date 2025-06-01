// Used to be:
// browserify -d -p [minifyify --map app.js.map --output gen/app.js.map] js/app.js -o gen/app.js
// ...but then it got too complicated, and this seemed easier

const browserify = require('browserify');
const blacklistify = require('blacklistify/custom');
const collapse = require('bundle-collapser/plugin');
const envify = require('envify/custom');
const exorcist = require('exorcist');
const fs = require('fs');
const path = require('path');

// Ensure build directory exists
const buildDir = path.join(__dirname, '../build/gen');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

console.log('Bundling JavaScript files...');

const BLACKLIST = {
    ui: [/.*\/worker.*/],
    worker: [/.*\/ui.*/, /.*react.*/],
};

for (const name of ['ui', 'worker']) {
    const isWorker = name === 'worker';
    const baseDir = path.join(__dirname, '../src/js');

    console.log(`Starting bundle for ${name}`);
    console.log(`Base directory: ${baseDir}`);

    const b = browserify(`src/js/${name}/index.ts${name === 'ui' ? 'x' : ''}`, {
        debug: true,
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        resolveExtensions: ['.ts', '.tsx', '.js', '.jsx'],
        transform: [
            ['babelify', {
                presets: [
                    ['@babel/preset-env', {
                        targets: {
                            browsers: ['last 2 versions']
                        }
                    }],
                    ['@babel/preset-react', {
                        runtime: 'automatic'
                    }],
                    ['@babel/preset-typescript', {
                        isTSX: true,
                        allExtensions: true
                    }]
                ],
                plugins: [
                    '@babel/plugin-transform-runtime'
                ],
                extensions: ['.ts', '.tsx', '.js', '.jsx']
            }]
        ],
        browserField: !isWorker,
        builtins: isWorker ? false : undefined,
        paths: [
            baseDir,
            path.join(baseDir, 'common'),
            path.join(baseDir, 'worker'),
            path.join(baseDir, 'worker/api'),
            path.join(baseDir, 'worker/core'),
            path.join(baseDir, 'worker/db'),
            path.join(baseDir, 'worker/util'),
            path.join(baseDir, 'ui')
        ],
        basedir: path.join(baseDir, name)
    });

    // Add debugging events
    b.on('dep', function(dep) {
        console.log('Dependency:', dep.id);
    });

    b.on('transform', function(tr, file) {
        console.log('Transform:', file);
    });

    b.transform(blacklistify(BLACKLIST[name]))
        .transform({global: true}, envify({NODE_ENV: 'production'}))
        .plugin(collapse)
        .bundle()
        .on('error', function(err) {
            console.error(`Error bundling ${name}:`, err);
            console.error('Stack:', err.stack);
        })
        .pipe(exorcist(`build/gen/${name}.js.map`))
        .pipe(fs.createWriteStream(`build/gen/${name}.js`));

    console.log(`Finished bundle for ${name}`);
}
