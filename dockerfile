FROM node:latest 
WORKDIR /app     
COPY package.json .
RUN npm install
ENV PORT=3000
CMD [ "npm", "start" ]
