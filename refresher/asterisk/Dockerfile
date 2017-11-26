FROM base/archlinux

RUN pacman --noconfirm --force -Syu \
  && pacman --noconfirm -S git sudo binutils gcc make fakeroot \
     vim alsa-lib speex popt libvorbis curl libxml2 \
     jansson libxslt opus ncurses sqlite3 gsm \
     python python-pip sox swig patch \
  && cd /tmp \
  && sudo -u nobody git clone https://aur.archlinux.org/asterisk.git \
  && cd asterisk \
  && sed -i -e "s/'pjproject'//g" -e "s/'termcap'//g" PKGBUILD \
  && sudo -u nobody makepkg -c \
  && pacman --noconfirm -U asterisk-*.pkg.tar.xz \
  && cd .. \
  && rm -rf asterisk \
  && pacman --noconfirm --force -Scc

WORKDIR /ast
RUN chown asterisk:asterisk /ast

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./sounds/ /var/lib/asterisk/sounds/

EXPOSE 5038
ADD ./entrypoint.sh /
ENTRYPOINT /entrypoint.sh
