export type ActivityLogStatusVariant =
  | "update"
  | "stock-in"
  | "add-user"
  | "edit-user"
  | "completed"
  | "cancelled";

export type ActivityLogEntry = {
  user: string;
  date: string;
  time: string;
  detail: string;
  status: {
    label: string;
    variant: ActivityLogStatusVariant;
  };
};
