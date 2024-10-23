import {Question} from "./question";
import {Image} from "./image";
import {Definition, DefinitionToSend} from "./definition";
import {Term} from "./term";

export interface EntryToSend {
  content: string,
  main_term_gender: string,
  main_term_grammatical_category: string,
  definitions: DefinitionToSend[],
  images: Image[],
  questions: Question[],
}

export interface Entry {
  id: number,
  content: string,
  main_term_gender: string,
  is_validated: boolean,
  terms: Term[],
  questions: Question[],
  definitions: Definition[],
  images: Image[],
}

