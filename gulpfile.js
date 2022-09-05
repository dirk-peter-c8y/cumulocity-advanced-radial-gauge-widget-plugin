const {src, dest, series} = require('gulp');
const zip = require('gulp-zip');
const del = require('del');
const pkgJson = require('./package.json');

function clean() {
    return del(['dist']);
}

const bundle = series(
    function createZip() {
        return src(`./dist/apps/${pkgJson.name}/**/*`)
            .pipe(zip(`${pkgJson.name}-${pkgJson.version}.zip`))
            .pipe(dest('dist/'))
    }
)

exports.clean = clean;
exports.bundle = bundle;
exports.default = series(bundle, async function success() {
    console.log("Build Finished Successfully!");
    console.log(`PluginOutput (Install in the browser): dist/${pkgJson.name}-${pkgJson.version}.zip`);
});
