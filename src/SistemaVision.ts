import CampoVision from './CampoVision'
import Punto from './Punto'

class SistemaVision {
    private camposVision: CampoVision[] = []
    private habilitadoTodo: boolean

    constructor() {
        this.habilitadoTodo = false

        this.camposVision = [
            new CampoVision('frontal', new Punto(1, -1), new Punto(1, 1)),
            new CampoVision('trasera', new Punto(-1, -1), new Punto(-1, 1))
        ]
    }

    voltear(): SistemaVision {
        this.camposVision = [
            new CampoVision('frontal', new Punto(-1, -1), new Punto(-1, 1)),
            new CampoVision('trasera', new Punto(1, -1), new Punto(1, 1))
        ]
        return this
    }

    habilitarTodo(todo: boolean): void {
        this.habilitadoTodo = todo
    }

    toVectorArray(): Punto[] {
        if (!this.habilitadoTodo) {
            return this.camposVision[0].toVectorArray()
        } else {
            return this.camposVision.reduce((vectores: Punto[], actual: CampoVision) => {
                vectores = [...vectores, ...actual.toVectorArray()]
                return vectores
            }, [])
        }
    }

    getCamposVision(): CampoVision[] {
        return this.camposVision
    }

    newInstance(): SistemaVision {
        return new SistemaVision()
    }

}

export default SistemaVision