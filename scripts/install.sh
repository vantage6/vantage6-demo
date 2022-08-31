#!/bin/bash

echo "1. Updating the system"
apt-get update -y
apt-get upgrade -y

echo "1a. Installing additional packages"
apt-get install curl

echo "2. Setting execution permissions to script"
chmod +x ${HOME}/vantage6-demo/scripts/configure.sh
chmod +x ${HOME}/vantage6-demo/scripts/start.sh
chmod +x ${HOME}/vantage6-demo/scripts/stop.sh

echo "3. Installing Docker"
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

sudo usermod -aG docker ${USER}

echo "4. Creating Python environment"
python3 -m venv ${HOME}/venvs/vantage6

echo "5. Install vantage6"
${HOME}/venvs/vantage6/bin/pip install vantage6==3.3.2

echo "6. Copy configuration files"
mkdir ${HOME}/.config/vantage6/node
cp -R ${HOME}/vantage6-demo/configurations/ ${HOME}/.config/vantage6/node
chown -R ${USER}:${USER} ${HOME}/.config/vantage6/node/

echo "Done!"

