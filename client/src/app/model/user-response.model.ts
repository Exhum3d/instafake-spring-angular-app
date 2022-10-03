import {User} from "./user.model";

export class UserResponse {
  user: User;
  followedByAuthUser: boolean;
}
