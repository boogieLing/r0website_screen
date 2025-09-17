FROM node:alpine AS prd

WORKDIR '/app'

COPY package.json .
# RUN yarn add -D @craco/craco
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# CMD ["npm","start", "y"]
RUN npm i -g serve

#RUN serve -s ./build
CMD ["serve","-s", "./build"]
EXPOSE 3000

# docker build -f Dockerfile -t r0website-screen .
# docker run -d -p 3000:3001 --name r0website-screen r0website-screen