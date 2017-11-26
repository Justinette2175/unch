FROM python:3

WORKDIR /call_controller
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

ADD main.py config.py backend.py ./

EXPOSE 8080
CMD [ "python", "/call_controller/main.py" ]
