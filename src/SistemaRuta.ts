import Ruta from './Ruta'

class SistemaRuta {
    private rutas: Ruta[]

    constructor(rutas: Ruta[]) {
        this.rutas = rutas
    }

    hayRutas(): boolean {
        return this.rutas.length !== 0
    }

    toRutasArray(): Ruta[] {
        return this.rutas
    }

    destruir() {
        this.rutas = []
    }

}

export default SistemaRuta