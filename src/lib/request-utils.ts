import { RequestStatus } from "@/types/request-types";

export type RequestBuckets<T> = {
  accepted: T[];
  pending: T[];
  rejected: T[];
  unknown: T[];
  counts: {
    accepted: number;
    pending: number;
    rejected: number;
    unknown: number;
    total: number;
  };
};

const asRequestStatus = (
  value?: string | RequestStatus,
): RequestStatus | undefined => {
  if (!value) {
    return undefined;
  }

  const upper = (typeof value === "string" ? value : `${value}`).toUpperCase();

  return Object.values(RequestStatus).find(
    (status) => status.toUpperCase() === upper,
  );
};

type LegacyUser = {
  surname?: string | null;
  lastName?: string | null;
};

const normalizePerson = <T extends LegacyUser>(
  person?: T | null,
): T | null | undefined => {
  if (!person || typeof person !== "object") {
    return person;
  }

  if (person.surname && person.surname.length > 0) {
    const { lastName, ...rest } = person;
    if (lastName === undefined) {
      return person;
    }
    return { ...rest, surname: person.surname } as T;
  }

  if (person.lastName && person.lastName.length > 0) {
    const { lastName, ...rest } = person;
    return { ...rest, surname: lastName } as T;
  }

  return person;
};

type RequestWithPeople = {
  user?: LegacyUser | null;
  approvedBy?: LegacyUser | null;
};

export const normalizeRequestUsers = <T extends RequestWithPeople>(
  requests: T[] = [],
): T[] => {
  return requests.map((request) => {
    const normalized = { ...request };

    if (request.user) {
      normalized.user = normalizePerson(request.user) as T["user"];
    }

    if (request.approvedBy) {
      normalized.approvedBy = normalizePerson(
        request.approvedBy,
      ) as T["approvedBy"];
    }

    return normalized;
  });
};

export const categorizeRequests = <
  T extends { status?: string | RequestStatus },
>(
  requests: T[] = [],
): RequestBuckets<T> => {
  const buckets: RequestBuckets<T> = {
    accepted: [],
    pending: [],
    rejected: [],
    unknown: [],
    counts: {
      accepted: 0,
      pending: 0,
      rejected: 0,
      unknown: 0,
      total: 0,
    },
  };

  requests.forEach((request) => {
    const status = asRequestStatus(request.status);

    switch (status) {
      case RequestStatus.APPROVED:
        buckets.accepted.unshift(request);
        break;
      case RequestStatus.PENDING:
        buckets.pending.push(request);
        break;
      case RequestStatus.REJECTED:
        buckets.rejected.unshift(request);
        break;
      default:
        buckets.unknown.unshift(request);
        break;
    }
  });

  buckets.counts = {
    accepted: buckets.accepted.length,
    pending: buckets.pending.length,
    rejected: buckets.rejected.length,
    unknown: buckets.unknown.length,
    total:
      buckets.accepted.length +
      buckets.pending.length +
      buckets.rejected.length +
      buckets.unknown.length,
  };

  return buckets;
};

export type ParamsMeta = {
  key?: string;
  search: string;
};
export type QueryParams = Record<string, string | number | boolean | undefined>;

export const buildParamsMeta = (params?: QueryParams): ParamsMeta => {
  if (!params) {
    return { search: "" };
  }

  const entries = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    )
    .map(([key, value]) => [key, String(value)] as [string, string])
    .sort(([a], [b]) => a.localeCompare(b));

  if (!entries.length) {
    return { search: "" };
  }

  const searchParams = new URLSearchParams(entries);

  return {
    key: JSON.stringify(entries),
    search: `?${searchParams.toString()}`,
  };
};
