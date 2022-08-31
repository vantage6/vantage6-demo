FROM python:3.7-alpine

LABEL author="Frank Martin <f.martin@iknl.nl>"


RUN pip install gunicorn
RUN pip install flask

COPY . /

EXPOSE 8000

ENV DATABASE_URI=/mnt/default.csv

# docker run -p 80:8000 -v vantage6-demo-user-vol:/mnt harbor2.vantage6.ai/demo/ui
CMD [ "gunicorn", "--bind",":8000" ,"--workers", "4", "app:app" ]
