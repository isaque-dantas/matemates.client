export interface Toast {
  title: string;
  body: string;
  id: number | null;
  type: "error" | "warning" | "info" | "success";
}
