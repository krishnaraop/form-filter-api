
# Use official Node.js image as base
FROM node:slim
WORKDIR /app
COPY  . .
RUN npm install
RUN npm run build
EXPOSE 4002
CMD ["npm", "start"]

