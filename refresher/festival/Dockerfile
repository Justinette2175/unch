FROM base/archlinux

RUN pacman --noconfirm --force -Syu
RUN pacman --noconfirm -S festival festival-us

WORKDIR /
ADD festival.scm ./
CMD festival --server -b /festival.scm 

