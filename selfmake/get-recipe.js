// Run with Nodejs

const exec = require('child_process').execSync;
const SWD = __dirname;

exec(`rm ${SWD}/recipe.json`);
exec(`curl "https://releases.aosc.io/manifest/recipe.json" -o ${SWD}/recipe.json`);
exec(`rm ${SWD}/variant-archs/*`);
exec(`rm ${SWD}/variant-arch-tarballs/*`);
exec(`rm ${SWD}/variant-arch-tarball-detail/*`);
exec(`rm ${SWD}/mirrors/*`);
