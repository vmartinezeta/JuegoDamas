import Ficha from "./Ficha"
import Ubicacion from "./Ubicacion"
import SistemaVision from './SistemaVision'
import { SuperPoder } from "./types"


class SuperFicha extends Ficha implements SuperPoder {
    private reina: boolean
    private sistemaVision: SistemaVision

    constructor(id: number, nombre: string, ubicacion: Ubicacion, sistemaVision: SistemaVision, isReina:boolean=false) {
        super(id, nombre, ubicacion)
        this.reina = isReina
        this.sistemaVision = sistemaVision
    }

    transformar() {
        if (this.isFichaRoja()) {
            this.setNombre('ficha-reina-roja')
        } else if (this.isFichaAmarilla()) {
            this.setNombre('ficha-reina-amarilla')
        }
        this.setReina(true)
        this.habilitarTodoSistema()
    }

    private setReina(reina: boolean): void {
        this.reina = reina
    }

    isReina(): boolean {
        return this.reina
    }

    private habilitarTodoSistema() {
        this.sistemaVision.habilitarTodo(true)
    }

    getSistemaVision(): SistemaVision {
        return this.sistemaVision
    }

    newInstance(): SuperFicha {
        return new SuperFicha(this.getId(), this.getNombre(), this.getUbicacion(), this.sistemaVision, this.reina)
    }

}

export default SuperFicha