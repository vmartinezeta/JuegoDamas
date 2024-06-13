import Punto from './Punto'
import { PuntoGiro } from './types'
import Segmento from './Segmento'


class Trayectoria {
    private vectorPrincipal: Punto
    private vectorSecundario: Punto
    private segmentos: Segmento[]
    private puntoGiro: PuntoGiro
    private trabajando: boolean

    constructor(vectorPrincipal: Punto, vectorSecundario: Punto, segmentos: Segmento[], puntoGiro: PuntoGiro = undefined, trabajando: boolean = true) {
        this.vectorPrincipal = vectorPrincipal
        this.vectorSecundario = vectorSecundario
        this.segmentos = segmentos
        this.puntoGiro = puntoGiro
        this.trabajando = trabajando
    }

    getVectorPrincipal(): Punto {
        return this.vectorPrincipal
    }

    getVectorSecundario(): Punto {
        return this.vectorSecundario
    }

    setSegmentos(segmentos: Segmento[]) {
        this.segmentos = segmentos
    }

    getSegmentos(): Segmento[] {
        return this.segmentos
    }

    setPuntoGiro(punto: PuntoGiro): void {
        this.puntoGiro = punto
    }

    getPuntoGiro(): PuntoGiro {
        return this.puntoGiro
    }

    setEstaTrabajando(trabajando: boolean) {
        this.trabajando = trabajando
    }

    estaTrabajando(): boolean {
        return this.trabajando
    }

    newInstance() {
        return new Trayectoria(
            this.vectorPrincipal,
            this.vectorSecundario,
            this.segmentos,
            this.puntoGiro,
            this.trabajando)
    }
}

export default Trayectoria