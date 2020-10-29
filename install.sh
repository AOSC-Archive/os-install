#!/bin/bash

# Run this script as root to deploy os-install on a system image

isERR=1
cd /root/
rm -r .os-install os-install 2> /dev/null
mkdir .os-install
cd .os-install

OSIVER="v0.1.2"
TARBALURL="https://github.com/neruthes/os-install/archive/$OSIVER.tar.gz"

# Download
if [[ x`which wget 2> /dev/null` == x/* ]]; then
    wget "$TARBALURL" -O os-install.tar.gz
    isERR=0
elif [[ x`which curl 2> /dev/null` == x/* ]]; then
    curl "$TARBALURL" -o os-install.tar.gz
    isERR=0
fi

if [[ isERR == 1 ]]; then
    echo "Error: Cannot find a downloader (wget or curl). Exiting."

    exit 1
fi

tar -pxf os-install.tar.gz
mv os-install*/* .
rm -r os-install*
source /root/.os-install/src/stage2.sh
