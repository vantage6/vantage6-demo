FROM python:3.7-alpine

LABEL author="Frank Martin <f.martin@iknl.nl>"


RUN pip install gunicorn 
RUN pip install flask

COPY . /

EXPOSE 8000

# docker run -p 80:8000 -e DATABASE_URI=/mnt/database.csv 
# -v C:\Users\FMa1805.36838\Repositories\demo_kit\input\database.csv:/mnt/database.csv 
# harbor.distributedlearning.ai/demo-kit/ui
CMD [ "gunicorn", "--bind",":8000" ,"--workers", "4", "app:app" ]
