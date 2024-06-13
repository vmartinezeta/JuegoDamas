import Ubicacion from "./Ubicacion"

class Ficha {
    private id: number
    private nombre: string
    private ubicacion: Ubicacion | undefined

    constructor(id: number, nombre?: string, ubicacion?: Ubicacion) {
        this.id = id
        this.nombre = nombre || ""
        this.ubicacion = ubicacion
    }

    setId(id: number) {
        this.id = id
    }

    getId(): number {
        return this.id
    }

    setNombre(nombre: string): void {
        this.nombre = nombre
    }

    getNombre(): string {
        return this.nombre
    }

    getUbicacion(): Ubicacion {
        if (!this.ubicacion) {
            throw new TypeError()
        }
        return this.ubicacion
    }

    setUbicacion(ubicacion: Ubicacion) {
        this.ubicacion = ubicacion
    }

    isEspacio(): boolean {
        return this.getId() === 0
    }

    isFichaColor(): boolean {
        return !this.isEspacio()
    }

    isFichaAmarilla(): boolean {
        return this.getId() === 1
    }

    isFichaRoja(): boolean {
        return this.getId() === 3
    }

    newInstance() {
        return new Ficha(0, 'ficha-espacio', this.ubicacion)
    }
    
}

export default Ficha