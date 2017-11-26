#!/bin/bash
socat TCP-LISTEN:7890,nodelay,rcvlowat=128,fork EXEC:'./accept.sh'
