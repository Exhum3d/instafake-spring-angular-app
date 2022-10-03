# Instafake

### A Social Media application, using Spring Boot on the backend and Angular on the frontend.

## ER Diagram

![Diagram](https://github.com/Exhum3d/instafake-spring-angular-app/blob/main/instafake-erd.png)

## API Endpoints
### User Controller
- sign up new user: `POST - http://localhost:8080/api/v1/signup`
- login endpoint: `POST - http://localhost:8080/api/v1/login`
- show profile: `GET - http://localhost:8080/api/v1/profile`
- update profile photo: `POST - http://localhost:8080/api/v1/account/update/profile-photo`
- show user by userId: `GET - http://localhost:8080/api/v1/users/{userId}`
- show posts of a single user: `GET - http://localhost:8080/api/v1/users/{userId}/posts`

### Post Controller
- create new post: `POST - http://localhost:8080/api/v1/posts/create"`
- update existing post by postId: `POST - http://localhost:8080/api/v1/posts/{postId}/updaten`
- delete post: `POST - http://localhost:8080/api/v1/posts/{postId}/photo/delete`
- get all users who liked a post: `GET - http://localhost:8080/api/v1/posts/{postId}/likes`
- like a post: `POST - http://localhost:8080/api/v1/posts/{postId}/like`
- unlike a post: `POST - http://localhost:8080/api/v1/posts/{postId}/like`
- get all comments to a post: `GET - http://localhost:8080/api/v1/posts/{postId}/comments`
- create a comment for a specific post: `POST - http://localhost:8080/api/v1/posts/{postId}/comments/create`
- update comment to a specific post: `POST - http://localhost:8080/api/v1/posts/{postId}/comments/{commentId}/update`
- delete a comment: `POST - http://localhost:8080/api/v1/posts/{postId}/comments/{commentId}/delete`
- like a comment: `POST - http://localhost:8080/api/v1/posts/comments/{commentId}/like`
- unlike a comment: `POST - http://localhost:8080/api/v1/posts/comments/{commentId}/unlike`
- get all likes of a comment: `POST - http://localhost:8080/api/v1/posts/comments/{commentId}/likes`

### Feed Controller
`WIP`
### Comment Controller
`WIP`

