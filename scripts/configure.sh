echo "> Please enter node name (demoA/demoB/demoC):"
read NODE

echo "> Please enter your API KEY:"
read API_KEY

echo "> Parsing & saving configuration file"
export NODE=$NODE
export API_KEY=$API_KEY
envsubst < ${HOME}/vantage6-demo/data/config.tpl \
> ${HOME}/.config/vantage6/node/demo.yaml

envsubst < ${HOME}/vantage6-demo/data/start.tpl \
> ${HOME}/start.sh