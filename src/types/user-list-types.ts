import { User } from "./auth-types";

export type UsersPage = {
  data: User[];
  meta: UsersMeta;
};

export type UsersMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
