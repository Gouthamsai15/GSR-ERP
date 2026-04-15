import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuditLogRecord, ApplicantRecord, StaffRecord, StudentRecord } from "../types/admin";

type CachedPage<T> = {
  items: T[];
  nextCursor: string | null;
  loadedAt: number;
};

type DataState = {
  studentsCache: Record<string, CachedPage<StudentRecord> | undefined>;
  staffCache: Record<string, CachedPage<StaffRecord> | undefined>;
  applicantsCache: Record<string, CachedPage<ApplicantRecord> | undefined>;
  auditLogsCache: Record<string, CachedPage<AuditLogRecord> | undefined>;
  dashboardStatsCache: Record<string, { value: unknown; loadedAt: number } | undefined>;
  setPageCache: <T extends StudentRecord | StaffRecord | ApplicantRecord | AuditLogRecord>(
    bucket: "studentsCache" | "staffCache" | "applicantsCache" | "auditLogsCache",
    key: string,
    value: CachedPage<T>,
  ) => void;
  mergePageCache: <T extends StudentRecord | StaffRecord | ApplicantRecord | AuditLogRecord>(
    bucket: "studentsCache" | "staffCache" | "applicantsCache" | "auditLogsCache",
    key: string,
    value: CachedPage<T>,
  ) => void;
  getCachedPage: <T extends StudentRecord | StaffRecord | ApplicantRecord | AuditLogRecord>(
    bucket: "studentsCache" | "staffCache" | "applicantsCache" | "auditLogsCache",
    key: string,
  ) => CachedPage<T> | undefined;
  setDashboardStats: (key: string, value: unknown) => void;
  getDashboardStats: (key: string) => unknown | undefined;
  clearSchoolCache: (schoolId: string) => void;
};

export const dataStore = create<DataState>()(
  persist(
    (set, get) => ({
      studentsCache: {},
      staffCache: {},
      applicantsCache: {},
      auditLogsCache: {},
      dashboardStatsCache: {},
      setPageCache: (bucket, key, value) =>
        set((state) => ({
          ...state,
          [bucket]: { ...(state[bucket] as Record<string, CachedPage<unknown> | undefined>), [key]: value },
        })),
      mergePageCache: (bucket, key, value) =>
        set((state) => {
          const current = (state[bucket] as Record<string, CachedPage<unknown> | undefined>)[key];
          const items = current ? [...(current.items as unknown[]), ...(value.items as unknown[])] : value.items;
          return {
            ...state,
            [bucket]: {
              ...(state[bucket] as Record<string, CachedPage<unknown> | undefined>),
              [key]: { ...value, items },
            },
          };
        }),
      getCachedPage: (bucket, key) => (get()[bucket] as Record<string, CachedPage<unknown> | undefined>)[key] as CachedPage<any> | undefined,
      setDashboardStats: (key, value) =>
        set((state) => ({
          ...state,
          dashboardStatsCache: { ...state.dashboardStatsCache, [key]: { value, loadedAt: Date.now() } },
        })),
      getDashboardStats: (key) => get().dashboardStatsCache[key]?.value,
      clearSchoolCache: (schoolId) =>
        set((state) => {
          const prefix = `${schoolId}::`;
          const filterBucket = <T,>(bucket: Record<string, T | undefined>) =>
            Object.fromEntries(Object.entries(bucket).filter(([key]) => !key.startsWith(prefix)));
          return {
            ...state,
            studentsCache: filterBucket(state.studentsCache),
            staffCache: filterBucket(state.staffCache),
            applicantsCache: filterBucket(state.applicantsCache),
            auditLogsCache: filterBucket(state.auditLogsCache),
            dashboardStatsCache: filterBucket(state.dashboardStatsCache),
          };
        }),
    }),
    {
      name: "inddia-data-cache",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        studentsCache: state.studentsCache,
        staffCache: state.staffCache,
        applicantsCache: state.applicantsCache,
        auditLogsCache: state.auditLogsCache,
        dashboardStatsCache: state.dashboardStatsCache,
      }),
    },
  ),
);
