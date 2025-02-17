import {KnowledgeArea} from "./knowledge-area";

export interface DefinitionToSend {
  id: number | undefined;
  content: string;
  knowledge_area__content: string;
}

export interface Definition {
  id: number;
  content: string;
  knowledge_area: string;
}
