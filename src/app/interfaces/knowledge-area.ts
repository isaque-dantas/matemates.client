import {Entry} from "./entry";

export interface KnowledgeArea {
  content: string;
  subject: string;
  entries?: Entry[];
}

export interface KnowledgeAreaToSend {
  content: string;
  subject: string;
}
