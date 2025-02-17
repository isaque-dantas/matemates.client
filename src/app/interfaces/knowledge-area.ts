import {Entry} from "./entry";

export interface KnowledgeArea {
  id: number;
  content: string;
  entries?: Entry[];
}
