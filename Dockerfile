FROM docker.m.daocloud.io/library/node:20-alpine

WORKDIR /app

# npm 国内镜像
RUN npm config set registry https://registry.npmmirror.com

# 利用缓存
COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# React build
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node","server.js"]