import { LimbDance } from "./LimbDance";
import { SubDance } from "./SubDance";

export type Dance = {
  head: SubDance;
  body: SubDance;
  leg: LimbDance;
  arm: LimbDance;
};
