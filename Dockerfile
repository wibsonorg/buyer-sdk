############################################################
# Dockerfile to build the Wibson Platform on Jenkins
# Based on Node 8
############################################################

FROM node:8.11.3
MAINTAINER Wibson Development Team <developers@wibson.org>

# Add jenkins as user to fix issue:
# https://github.com/istanbuljs/nyc/issues/743

USER root

ARG USER_ID=1001
ARG GROUP_ID=1001
ARG USER_NAME=jenkins
ARG GROUP_NAME=jenkins
ARG HOME_DIR=/opt/jenkins

RUN groupadd -g ${GROUP_ID} ${GROUP_NAME}
RUN useradd -u ${USER_ID} -g ${GROUP_ID} -m -d ${HOME_DIR} -s /bin/bash ${USER_NAME}
RUN chmod 766 ${HOME_DIR}

# Install basic applications
RUN npm install -g npm@6.1.0

USER jenkins
