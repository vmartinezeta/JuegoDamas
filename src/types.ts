import Punto from "./Punto";
import SistemaVision from "./SistemaVision";

export type PuntoGiro = Punto | undefined


export interface SuperPoder {
    transformar: ()=>void
    isReina(): boolean
    getSistemaVision(): SistemaVision
}