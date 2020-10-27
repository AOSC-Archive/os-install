#!/bin/bash

# Run this script as root to deploy os-install on a system image

# apt install git
cd /root/
rm -r .os-install os-install 2> /dev/null
mkdir .os-install
cd .os-install

# git clone https://github.com/neruthes/os-install
OSIVER="v0.1.0"
wget "https://github.com/neruthes/os-install/archive/$OSIVER.tar.gz"
tar -pxf *.tar.gz
mv os-install*/* .
sh /root/.os-install/src/stage2.sh
