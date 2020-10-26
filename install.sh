#!/bin/bash

# Run this script as root to deploy os-install on a system image

apt install git
cd /root/
rm -r .os-install os-install
git clone https://github.com/neruthes/os-install
mv os-install .os-install
source /root/.os-install/src/stage2.sh
