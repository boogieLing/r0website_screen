FROM node:alpine AS prd

WORKDIR '/app'

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

CMD ["npm","start"]

EXPOSE 3001

# docker build -f screen.Dockerfile -t r0website-screen .
# docker run -d -p 3001:3001 r0website-screen