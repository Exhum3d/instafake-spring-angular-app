# Instafake

### A Social Media application, using Spring Boot on the backend and Angular on the frontend.

## ER Diagram

![Diagram](https://github.com/Exhum3d/instafake-spring-angular-app/blob/main/instafake-erd.png)

## API Endpoints
### User Controller
- sign up a new user: `POST - http://localhost:8080/api/v1/signup`
- login endpoint: `POST - http://localhost:8080/api/v1/login`
- show profile: `GET - http://localhost:8080/api/v1/profile`
- update profile photo: `POST - http://localhost:8080/api/v1/account/update/profile-photo`
- show user by userId: `GET - http://localhost:8080/api/v1/users/{userId}`
- show posts of a single user: `GET - http://localhost:8080/api/v1/users/{userId}/posts`

