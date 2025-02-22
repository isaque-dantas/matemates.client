import {Question} from "./question";
import {Image} from "./image";
import {Definition, DefinitionToSend} from "./definition";
import {Term} from "./term";
import {ImageToSend} from "./image-to-send";

export interface EntryToSend {
  content: string,
  main_term_gender: string,
  main_term_grammatical_category: string,
  definitions: DefinitionToSend[],
  images: ImageToSend[],
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
