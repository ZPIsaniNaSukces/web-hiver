import { User } from "./auth-types";

export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum AvailabilityType {
  VACATION = "VACATION",
  ONLINE_WORK = "ONLINE_WORK",
  OFFLINE_WORK = "OFFLINE_WORK",
}

export type AvailabilityRequest = {
  id: number;
  userId: number;

  date: string;
  hours: number;

  type: AvailabilityType;
  status: RequestStatus;

  approvedById: number | null;
  acceptedRejectedAt: string | null;

  createdAt: string;
  updatedAt: string;

  user: User;
  approvedBy: User | null;
};

export type GeneralRequest = {
  id: number;
  userId: number;

  description: string;

  status: RequestStatus;
  approvedById: number | null;
  acceptedRejectedAt: string | null;

  user: User;
  approvedBy: User | null;

  createdAt: string;
  updatedAt: string;
};
