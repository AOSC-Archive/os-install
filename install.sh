#!/bin/bash

# Run this script as root to deploy os-install on a system image

# apt install git
cd /root/
rm -r .os-install os-install 2> /dev/null
mkdir .os-install
cd .os-install

# git clone https://github.com/neruthes/os-install
OSIVER="v0.1.1"

# Download
if [[ x`which wget 2> /dev/null` == x/* ]]; then
    # Found wget
    wget -O osi-install.tar.gz "https://github.com/neruthes/os-install/archive/$OSIVER.tar.gz"
elif [[ x`which curl 2> /dev/null` == x/* ]]; then
    #statements
    curl "https://github.com/neruthes/os-install/archive/$OSIVER.tar.gz" -o osi-install.tar.gz
fi


tar -pxf *.tar.gz
mv os-install*/* .
source /root/.os-install/src/stage2.sh
