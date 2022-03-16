FROM node:17.6

WORKDIR /app

# ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN apt-get update && apt-get upgrade -y

RUN npm install -g meteor

RUN	TOOL_NODE_FLAGS=--max-old-space-size=3300 NODE_TLS_REJECT_UNAUTHORIZED=0 meteor --port 3000




