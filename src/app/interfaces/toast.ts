export interface Toast {
  title: string;
  body: string;
  id?: number;
  type: "error" | "warning" | "info" | "success";
}
