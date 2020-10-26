#!/bin/bash

# To be executed as part of installation of this repo.

REPODIR=/root/.os-install

cat $REPODIR/etc/desktop-readme.md > /root/README.md
cat $REPODIR/etc/bashrc > /root/.bashrc

source /root/.bashrc
