export interface Pagination {
  index: number;
  length: number;
  totalCount: number;
}

export interface Filters {
  id?: number;
  groupName?: string;
  coordinateX?: number;
  coordinateY?: number;
  studentsCount?: number;
  transferredStudents?: number;
  averageMark?: number;
  adminName?: string;
  semester?: number;
  creationDate?: string;
}

export interface PrimaryActions {
  delete: {
    value?: number;
    isLoading: boolean;
  };
  getGroupWithSmallestCoordinate: {
    isLoading: boolean;
  };
  getGroupsWithTransferredLess: {
    value?: number;
    isLoading: boolean;
  };
}

export interface SecondaryActions {
  move: {
    from?: string;
    to?: string;
    isLoading: boolean;
  };
  count: {
    value?: number;
    isLoading: boolean;
  };
}

export enum SortCriteria {
  Id = 'id',
  Coordinates = 'coordinates',
  CreationDate = 'creationDate',
  StudentsCount = 'studentsCount',
  TransferredStudents = 'transferredStudents',
  AverageMark = 'averageMark',
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
  Default = 'default',
}

export interface SortParams {
  criteria: SortCriteria;
  order: SortOrder;
}
