## Overview

Full-Stack Website made using MongoDB, Express, React.js and Node.js (MERN). It has features like authentication, authorization, creating new post, liking/disliking post, commenting on post, following users, unfollowing users, user profile and real-time chat.

## Built With

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Socket.IO](https://socket.io/)

## Set Up

1. Change directory to backend
   ```sh
   cd backend
   ```
2. Make `config.env` file
   ```sh
   touch config.env
   ```
3. ## Define following properties:
   - `DATABASE_LOCAL` for local mongoDB database link
   - `DATABASE_URL` for cloud mongoDB database link, replace username and password in the link with '<username>' and '<password>' respectively
   - `DATABASE_USERNAME` for 'DATABASE_URL' username
   - `DATABASE_PASSWORD` for 'DATABASE_URL' password
   - `JWT_SECRET` for JWT secret
   - `JWT_EXPIRES_IN` for JWT token expiry time (in valid format)
   - `JWT_COOKIE_EXPIRES_IN` for JWT cookie expiry time
