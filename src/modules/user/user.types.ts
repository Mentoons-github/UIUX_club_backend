export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  phone?: string;
  occupation?: string;
  location?: string;
  password: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isPrivate: boolean;
  blockedUsers?: string[];
  blockedEmployers?: string[];
}

export type CreateUserInput = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export interface UpdateUserDetailsPayload {
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  occupation?: string;
  skills?: string[];
  location?: string;
  isPrivate?: boolean;
  profilePicture?: string;
}
