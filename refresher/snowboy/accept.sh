#!/bin/bash

export PYTHONUNBUFFERED=1
stdbuf -i0 -o0 -e0 sox --buffer 256 -b 16 -e signed-integer -r 8000 -c 1 -t raw - -t raw -r 16000 -b 16 -e signed-integer -c 1 - | stdbuf -i0 -o0 -e0 python3 snowboystdin.py resources/alexa.umdl 2>&1
