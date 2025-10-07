export type DataLogStatus =
  | 'updateStock'
  | 'stockIn'
  | 'addUser'
  | 'editUser'
  | 'orderCompleted'
  | 'cancelOrder';

export interface DataLogEntry {
  id: string;
  user: string;
  date: string;
  time: string;
  detail: string;
  status: DataLogStatus;
  statusLabel: string;
}
