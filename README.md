<h1 align="center">
  <br>
  <a href="https://vantage6.ai"><img src="https://github.com/IKNL/guidelines/blob/master/resources/logos/vantage6.png?raw=true" alt="vantage6" width="400"></a>
</h1>

<h3 align=center> A privacy preserving analysis solution</h3>

--------------------

# vantage6 demo
The repository contains all that is needed to setup a demo kit. It requires:

* 4 Raspberry pi's 4 with at least 4Gb of memory (with accessories)
* 4 Touch screens that work with the PI
* A bit of patience to get everything working
* External vantage6 server

The demo will show three nodes in which users can input some sensitive data.
For example, age and weight. The final screen is used as a researcher, it has
a single button to start the analysis. When the button is pressed the Multi
party computation (MPC) algorithm will compute the average of the three nodes.
Finally the results are displayed at the researcher station.


## Setup

### Configure collaboration
Log into the vantage6-server you are using
(e.g. https://portal.petronas.vantage6.ai). This can be either through our
[python client](https://docs.vantage6.ai/usage/running-analyses/python-client)
or with the UI (as of this writing in Beta). Note that the R-client does not
have sufficient tools to do this.

Then add the following:
* Three organizations
* At least one user for one of the organizations
* Collaboration including all three organizations
* In case you are using the Python client: nodes for each organization in the
  collaboration. This is not required for the UI as this happens automatically
  when you create a collaboration

Make sure you copy the API keys to a safe location. You need them later on to
configure the data-stations.


### Raspberry PI OS installation
For both the nodes and researcher Ubuntu ARM needs to be installed. Start with
a fresh [Ubuntu 64bit ARM image](https://ubuntu.com/download/raspberry-pi). And
follow their instruction on how to install it onto the memory card. I would
recommend using the
[Raspberry Pi Imager](https://www.raspberrypi.com/software/) to do so.

Plug the memory card into the PI, boot it up and follow the installation
instructions. Make sure to configure an internet connection and preferable
enable auto login. When you are logged into the system, open the **Terminal**.

### Raspberry PI Node Installation
This section covers the installation of the nodes, for which you need three
Raspberry PIs. See the other section on installation instructions for the
researchers PI.

#### Run installation script
```bash
sudo apt install git
cd ~
git clone https://github.com/vantage6/vantage6-demo
sudo chmod +x ~/vantage6-demo/scripts/install.sh
sudo -E sh ~/vantage6-demo/scripts/install.sh
```

This script will:

1. Update the system
2. Install Docker
3. Configure a virtual environment in Python
4. Install vantage6
5. Move the predefined configuration files to their appropiate location


#### Configure the nodes
Now that we have the API-keys, we can start configuring the nodes. The only
thing we need to do now is add the API keys to the configuration files:
```bash
sh ~/vantage6-demo/scripts/configure.sh
```
Fill in the requested details (Node-name and API key). Now the node has been
setup and is ready to process requests.

### Raspberry PI Researcher Installation

#### Download the Researcher app
Git is already installed in ubuntu, so execute the following:
```bash
cd ~
git clone https://github.com/vantage6/vantage6-demo
```

You need to make some manual changes to the Javascript file:
`~/vantage6-demo/UI/static/vantage.js`

* username/password
* URL to your server at serveral places

## Buidling Docker images
```
docker build -t harbor.carrier-mu.src.surf-hosted.nl/carrier/demo-ui . --push
```

