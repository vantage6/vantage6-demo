#!/bin/bash

echo "1. Updating the system"
apt-get update -y
apt-get upgrade -y

echo "1a. Installing additional packages"
apt-get install curl
apt-get install python3.10-venv
apt-get install chromium-browser

echo "2. Setting execution permissions to script"
chmod +x ${HOME}/vantage6-demo/scripts/configure.sh
chmod +x ${HOME}/vantage6-demo/scripts/start.sh
chmod +x ${HOME}/vantage6-demo/scripts/stop.sh

echo "3. Installing Docker"
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

usermod -aG docker ${USER}

echo "4. Creating Python environment"

python3 -m venv ${HOME}/venvs/vantage6

echo "5. Install vantage6"
${HOME}/venvs/vantage6/bin/pip install vantage6==3.3.2

echo "6. Create config folder"
mkdir -p ${HOME}/.config/vantage6/node
chown ${USER}:${USER} ${HOME}/.config/vantage6/node

echo "7. Copy dummy data"
cp ${HOME}/vantage6-demo/data/data.csv ${HOME}/data.csv

echo "8. Disable lock-screen, sleep and idle"
gsettings set org.gnome.desktop.screensaver lock-enabled false
gsettings set org.gnome.desktop.session idle-delay 0
gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-type 'nothing'

echo "9. Adding cronjob"
echo "@reboot demo export DISPLAY=:0 && ${HOME}/vantage6-demo/scripts/start.sh" >> /etc/crontab

echo "Done!"


