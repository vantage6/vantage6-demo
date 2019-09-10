# basic python3 image as base
FROM python:3

# copy all local files to the image
COPY . /

# for testing locally only
# ENV DATABASE_URI /app/local/database.csv

# install pytaskmanager
WORKDIR /ppdli
RUN git clone -b E2EE https://github.com/IKNL/ppDLI.git .
RUN pip install .


# install external dependancies into environment
WORKDIR /
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# execute algorithm in the container
CMD ["python", "./main.py"]