# To be copied into chroot container for executing.

# Update
echo ""
printf "Update system now? It may take several minutes. (y/N) "
read isUPDATENOW
if [[ x${isUPDATENOW,,} == 'xy' ]]; then
    # Update Now!
    apt update
    apt full-upgrade
fi

# Grub
if [[ $BOOTMODE == 'EFI' ]]; then
    mkdir -p /efi
    set +e
    mount /dev/$GRUBPATH /efi 2> /dev/null
    set -e
    source /etc/os-release
    grub-install --target=x86_64-efi --bootloader-id="$NAME" --efi-directory=/efi
else
    grub-install --target=i386-pc /dev/$GRUBPATH
fi
grub-mkconfig -o /boot/grub/grub.cfg

# Add user
echo ""
echo "Now create your user."
printf "Your full name: "
read inputFULLNAME
echo "Using full name '$inputFULLNAME'"
echo ""
printf "Your username: "
read inputUSERNAME
echo "Using username '$inputUSERNAME'"
useradd -m -s /bin/bash $inputUSERNAME
usermod -a -G audio,cdrom,video,wheel $inputUSERNAME
chfn -f "$inputFULLNAME" $inputUSERNAME
echo ""
echo "Now set a password."
passwd $inputUSERNAME
echo ""
echo "Now set the hostname of this computer."
printf "Hostname: "
read inputHOSTNAME
echo "$inputHOSTNAME" > /etc/hostname
echo "Using hostname '$inputHOSTNAME'"
echo ""
echo ""
echo "========================================="
echo ""
echo "The setup is almost done."
echo -e "Then run '\e[38;5;118mreboot\e[0m' to restart this computer."
echo ""
echo ""
neofetch
echo ""
echo ""
echo "Remember to remove this installation media. Is it a USB flash drive?"
echo ""
echo "Enjoy your new OS :)"
echo ""

rm /stage3.sh
