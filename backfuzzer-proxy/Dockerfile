FROM node:8.7.0

RUN mkdir /app
WORKDIR /app

ADD src/* /app

RUN git clone https://github.com/aoh/radamsa.git
RUN cd radamsa && make

CMD ["node", "server.js"]
