FROM fedora:24
# In order to extract the phantonjs tar.bz file.
RUN dnf -y install tar bzip2
# npm and bower use git.
RUN dnf -y install git
# some of our deps need dev tools
RUN dnf -y install python gcc make
# It contains libfontconfig.so.1 which is used by phantonjs.
RUN dnf -y install fontconfig
# To extract nodejs.tar.xz
RUN dnf -y install xz
# Remove all dangling files not used after dnf install.
RUN dnf clean all
RUN mkdir -p /opt/bin
RUN curl https://nodejs.org/dist/v6.8.1/node-v6.8.1-linux-x64.tar.xz --output nodejs.tar.xz
RUN tar xf nodejs.tar.xz
RUN rm nodejs.tar.xz
RUN mv node-v6.8.1-linux-x64 /opt/bin/nodejs
ENV PATH="/opt/bin/nodejs/bin:${PATH}"
RUN npm i webpack typings typescript webpack-dev-server -g
RUN useradd mykola
RUN mkdir -p /home/mykola/project
RUN chown -R mykola:mykola /home/mykola/
USER mykola
WORKDIR /home/mykola/project
ENTRYPOINT ["npm"]
EXPOSE 8082

