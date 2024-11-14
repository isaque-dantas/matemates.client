import {Syllable} from "./syllable";

export interface Term {
  content: string,
  gender: string,
  grammatical_category: string,
  is_main_term: boolean,
  syllables: string[]
}
