FROM python:3.6

WORKDIR /refresher
ADD requirements.txt ./
RUN pip install -r requirements.txt

ADD ./*.py ./
ADD ./call_controller ./call_controller

CMD python main.py
