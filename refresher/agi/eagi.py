#!/usr/bin/python

"""
Example to get and set variables via AGI.
You can call directly this script with AGI() in Asterisk dialplan.
"""

from asterisk.agi import *

agi = AGI()

agi.verbose("python agi started")

# Get variable environment
extension = agi.env['agi_extension']

# Get variable in dialplan
# phone_exten = agi.get_variable('PHONE_EXTEN')

# Set variable, it will be available in dialplan
# agi.set_variable('EXT_CALLERID', '1')

import time, os, signal, socket, select, re

def _handler_sighup(signum, frame):
    exit(0)

signal.signal(signal.SIGHUP, _handler_sighup)

data = b''
partial = ''

sb = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sb.connect(('snowboy', 7890))

agi.verbose("connected to snowboy")

call = os.fdopen(3, 'rb')

agi.verbose("looping")

while True:
    readable, writeable, exceptional = select.select([call, sb], [], [call, sb])

    if len(exceptional) > 0:
        break

    if call in readable:
        data = call.read(512)
        sb.send(data)

    if sb in readable:
        agi.verbose('snowboy -> eagi')
        buf = sb.recv(4096)
        partial += buf.decode('utf-8', 'ignore')
        if re.search('Detected speech', partial):
            agi.verbose('Detected speech - exiting!')
            break
        else:
            agi.verbose('Received buffer {} - no match'.format(partial))
