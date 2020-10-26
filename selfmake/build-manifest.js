// Run with Nodejs

const fs = require('fs');
const exec = require('child_process').execSync;

const SWD=__dirname;

// Get latest manifest recipe json
let recipe = JSON.parse(fs.readFileSync(`${SWD}/recipe.json`));

// Render os-install script components

// Component: askVariant
(function () {
    let txt = '';
    txt += 'VARIANT_INDEX_ARR=(' + recipe.variants.map(function (variant, i) {
        if (variant.tarballs.length === 0) {
            return 'SKIP';
        };
        return i;
    }).filter(x => x !== 'SKIP').join(' ') + ')\n';
    recipe.variants.map(function (variant, i) {
        if (variant.tarballs.length === 0) {
            return 0;
        };
        txt += [
            `echo "    [$(c_green ${i})]${(new Array(6-i.toString().length)).fill(' ').join('')}${variant.name}${variant.retro ? ' (Retro)' : ''}"`
        ].join('') + '\n';

        // Map variant => array<arch>
        let possibleArchsSet = {};
        variant.tarballs.map(function (tarball, i) {
            if (possibleArchsSet[tarball.arch] === undefined) {
                possibleArchsSet[tarball.arch] = [tarball];
            } else {
                possibleArchsSet[tarball.arch].push(tarball);
            }
        });
        let possibleArchsArr = Object.keys(possibleArchsSet);
        // txt += 'ARCH_INDEX_ARR=(' + possibleArchsArr.map(function (arch, ii) {
        //     return ii;
        // }).join(' ') + ')\n';
        let txt_varArch = '';
        txt_varArch += 'ARCH_INDEX_ARR=(' + possibleArchsArr.map(function (archName, ii) {
            return ii;
        }).join(' ') + ')\n';
        possibleArchsArr.map(function (archName, ii) {
            let archObj = possibleArchsSet[archName];
            txt_varArch += [
                `echo "    [$(c_green ${ii})]    ${archName}"`
            ].join('') + '\n';
            let txt_archTar = '';

            txt_archTar += 'TARBALL_INDEX_ARR=(' + archObj.map(function (tarball, iii) {
                return iii;
            }).join(' ') + ')\n';
            archObj.map(function (tarball, iii) {

                let sizeDownload = (Math.ceil(tarball.downloadSize/2**30*100)/100).toString();
                sizeDownload = sizeDownload.replace(/(\.\d)$/, '$1/0').replace('/', '').replace(/^(\d\.)/, ' $1');
                sizeDownload += ' GB' + (new Array(5-sizeDownload.length)).fill(' ').join('');
                let sizeInstall = (Math.ceil(tarball.instSize/2**30*100)/100).toString();
                sizeInstall = sizeInstall.replace(/(\.\d)$/, '$1/0').replace('/', '').replace(/^(\d\.)/, ' $1') + ' GB';
                txt_archTar += `echo "    [$(c_green ${iii})]    Date ${tarball.date}${(new Array(12-tarball.date.length)).fill(' ').join('')}Download ${sizeDownload}   Disk ${sizeInstall}"\n`
                let txt_tarItem = Object.keys(tarball).map(function (key) {
                    return `_TARBALL_${key}="${tarball[key]}"`
                }).join('\n');
                fs.writeFileSync(`${SWD}/variant-arch-tarball-detail/${i}-${ii}-${iii}`, txt_tarItem);
            });
            fs.writeFileSync(`${SWD}/variant-arch-tarballs/${i}-${ii}`, txt_archTar + `NUM_MAX_ALLOW=${archObj.length-1}`);
        });
        fs.writeFileSync(`${SWD}/variant-archs/${i}`, txt_varArch + `NUM_MAX_ALLOW=${possibleArchsArr.length-1}`);
    });
    fs.writeFileSync(`${SWD}/../etc/x-askVariant.sh`, txt + `NUM_MAX_ALLOW=${recipe.variants.length-1}`);
})();


// Component: askMirror
(function () {
    let txt = '';
    txt += 'MIRROR_INDEX_ARR=(' + recipe.mirrors.map(function (mirror, i) {
        return i;
    }).join(' ') + ')\n';
    recipe.mirrors.map(function (mirror, i) {
        txt += `echo "    [$(c_green ${i})]${(new Array(6-i.toString().length)).fill(' ').join('')}${mirror.name}"\n`;
        let txt_mirrorItem = Object.keys(mirror).map(function (key) {
            return `_MIRROR_${key}="${mirror[key]}"`
        }).join('\n');
        fs.writeFileSync(`${SWD}/mirrors/${i}`, txt_mirrorItem);
    });
    fs.writeFileSync(`${SWD}/../etc/x-askMirror.sh`, txt + `NUM_MAX_ALLOW=${recipe.mirrors.length-1}`)
})();
