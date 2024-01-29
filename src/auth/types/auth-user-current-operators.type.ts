import { Module } from "../enum/module.enum";

export type TAuthUserCurrentOperators = {
  [key in Module]: string
}
