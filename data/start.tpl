# Start the node
${HOME}/venvs/vantage6/bin/vnode start --name demo

# Start the node and couple the node volume (which contains data.csv) to this
# UI app. The app will update this data.csv when the user inputs its values
docker run -p 80:8000 -v vantage6-demo-user-vol:/mnt -d harbor2.vantage6.ai/demo/ui

chromium --kiosk http://localhost/${NODE}