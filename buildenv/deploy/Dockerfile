FROM ubuntu:16.04

# Install python, pip and virtualenv
RUN apt-get update && apt-get install -y python-pip
RUN pip install --upgrade pip
RUN pip install --upgrade virtualenv

# Install node
RUN apt-get update && apt-get install -qyy curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get update && apt-get install -qyy nodejs
