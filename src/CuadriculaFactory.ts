import Cuadricula from "./Cuadricula"
import Ficha from "./Ficha"
import SuperFicha from "./SuperFicha"
import EspacioVacio from "./EspacioVacio"
import Punto from "./Punto"
import Ubicacion from "./Ubicacion"
import SistemaVision from './SistemaVision'

class CuadriculaFactory {
    private celdas: Ficha[][]

    constructor(filas: number = 8, columnas: number = 8) {
        let espacioFicha: boolean = false
        const sistema:SistemaVision = new SistemaVision()
        this.celdas = []
        let linea: Ficha[] = []
        for (let i: number = 0; i < filas; i++) {
            linea = []
            for (let j: number = 0; j < columnas; j++) {
                const x = j * 97 + 71
                const y = i * 87 + 254
                const areaFichasAmarilla = i < 3 && espacioFicha
                const areaFichasRoja = i > 4 && espacioFicha
                const areaEspaciosDisponible = (i > 2 && i < 5) && espacioFicha
                const ubicacion = new Ubicacion(new Punto(i, j), new Punto(x, y))
                if (areaFichasAmarilla) {
                    linea.push(new SuperFicha(1, 'ficha-amarilla', ubicacion, sistema.newInstance()))
                } else if (areaEspaciosDisponible) {
                    linea.push(new Ficha(0, 'ficha-espacio', ubicacion))
                } else if (areaFichasRoja) {
                    linea.push(new SuperFicha(3, 'ficha-roja', ubicacion, sistema.newInstance().voltear()))
                } else {
                    linea.push(new EspacioVacio())
                }
                espacioFicha = !espacioFicha
            }
            this.celdas.push(linea)
            espacioFicha = !espacioFicha
        }
    }

    crear(): Cuadricula {
        return new Cuadricula(this.celdas)
    }

}

export default CuadriculaFactory