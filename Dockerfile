
# Use official Node.js image as base
FROM node:slim
WORKDIR /app
COPY  . .
RUN npm install
EXPOSE 4002
CMD ["npm", "start"]

