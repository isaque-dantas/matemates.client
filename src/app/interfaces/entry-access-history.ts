export interface EntryToAccess {
  id: number;
  content: string;
  accessed_times: number;
}

export interface EntryAccessHistory {
  access_moment: Date;
  entry_content: string;
  entry_id: number;
}
