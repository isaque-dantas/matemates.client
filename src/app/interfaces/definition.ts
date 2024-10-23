import {KnowledgeArea} from "./knowledge-area";

export interface DefinitionToSend {
  content: string;
  knowledge_area__content: string;
}

export interface Definition {
  content: string;
  knowledge_area: KnowledgeArea;
}
