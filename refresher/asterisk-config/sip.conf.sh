#!/bin/bash

read -p "SIP username: " user
read -p "SIP secret: " key

cat > sip.conf <<EOF
[general]
register => ${user}:${key}@montreal5.voip.ms
context=public
allowguest=no
tcpenable=no
nat=force_rport,comedia

[voipms]
canreinvite=no
context=mycontext
host=montreal5.voip.ms
secret=${key}
type=peer
username=${user}
disallow=all
allow=ulaw
fromuser=${user}
trustrpid=yes
sendrpid=yes
insecure=invite
nat=force_rport,comedia
qualify=yes
EOF

echo sip.conf generated
