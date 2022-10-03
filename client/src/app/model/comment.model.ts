import {User} from "./user.model";

export class Comment {
  id: number;
  text: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  author: User;
}
