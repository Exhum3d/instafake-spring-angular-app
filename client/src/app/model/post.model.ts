import {User} from "./user.model";

export class Post {
  id: number;
  text: string;
  image: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  author: User;
}
