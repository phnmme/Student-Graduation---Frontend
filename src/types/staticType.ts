export interface CoopChartItem {
  year: number;
  graduates: number;
  coopEmployed: number;
}

export interface GraduationStatusItem {
  year: number;
  onTime: number;
  late: number;
}

export interface EmploymentSectorItem {
  year: number;
  private: number;
  government: number;
  stateEnterprise: number;
  selfEmployed: number;
}

export interface DashboardStatistics {
  coopChart: CoopChartItem[];
  graduationStatusChart: GraduationStatusItem[];
  employmentSectorChart: EmploymentSectorItem[];
}
