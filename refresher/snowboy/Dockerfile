FROM debian:buster

RUN apt-get update \
  && apt-get upgrade -y \
  && apt-get install -y build-essential git swig python3 python3-dev libblas-dev libatlas-base-dev socat sox expect-dev

RUN git clone https://github.com/m4burns/snowboy.git

WORKDIR /snowboy

RUN cd /snowboy/swig/Python3 && make

ADD server.sh accept.sh snowboystdin.py ./

EXPOSE 7890
ENTRYPOINT /snowboy/server.sh
