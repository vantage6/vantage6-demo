${HOME}/venvs/vantage6/bin/vnode start --name demo
docker run -p 80:8000 -v vantage6-demo-user-vol:/mnt harbor2.vantage6.ai/demo/ui
echo 'http://localhost'