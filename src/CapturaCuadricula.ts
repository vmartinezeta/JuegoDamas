import Cuadricula from './Cuadricula'
import Ficha from './Ficha'

class CapturaCuadricula {
    private cuadricula:Cuadricula
    private fichaEnJuego:Ficha

    constructor(cuadricula:Cuadricula, fichaEnJuego:Ficha) {
        this.cuadricula = cuadricula
        this.fichaEnJuego = fichaEnJuego
    }

    getCuadricula() {
        return this.cuadricula
    }

    getFicha() {
        return this.fichaEnJuego
    }
}

export default CapturaCuadricula