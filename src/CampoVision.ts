import Punto from "./Punto"

class CampoVision {
    private nombre: string
    private izquierda: Punto
    private derecha: Punto

    constructor(nombre: string, izquierda: Punto, derecha: Punto) {
        this.nombre = nombre
        this.izquierda = izquierda
        this.derecha = derecha
    }

    setNombre(nombre: string): void {
        this.nombre = nombre
    }

    getNombre(): string {
        return this.nombre
    }

    getIzquierda(): Punto {
        return this.izquierda
    }

    getDerecha(): Punto {
        return this.derecha
    }

    toVectorArray(): Punto[] {
        return [
            this.izquierda,
            this.derecha
        ]
    }

    pertenece(vector: Punto): boolean {
        return this.toVectorArray().find(v => v.toString() === vector.toString()) !== undefined
    }

    getVectorAdyacente(vector: Punto): Punto {
        const punto = this.toVectorArray().find(v => v.toString() !== vector.toString())
        if (punto === undefined) throw new TypeError("Not found")
        return punto
    }

    toString(): string {
        return `${this.izquierda.toString()},${this.derecha.toString()}`
    }

}

export default CampoVision