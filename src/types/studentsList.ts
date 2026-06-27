export type StudentApi = {
  id: number;
  studentCode: string;
  firstNameTh: string;
  lastNameTh: string;
  department: string;
  entryYear: number;
  gradYear: number | null;
  jobField: string | null;
};

export type StudentGroup = {
  gradYear: number;
  count: number;
  students: StudentApi[];
  nextSkip: number;
  hasMore: boolean;
};

export type ApiResponse<T> = {
  message: string;
  data: T;
};

export type GetAllYearData = { years: number[] };
export type GetAllGroupedData = { groups: StudentGroup[] };
export type GetStudentByYearData = {
  gradYear: number;
  count: number;
  students: StudentApi[];
  nextSkip: number;
  hasMore: boolean;
};
