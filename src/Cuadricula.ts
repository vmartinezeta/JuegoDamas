import Ficha from "./Ficha"
import Punto from './Punto'

class Cuadricula {
    private fichas: Ficha[][]

    constructor(fichas: Ficha[][]) {
        this.fichas = fichas
    }

    fromXY(x: number, y: number): Ficha {
        return this.fichas[x][y]
    }

    fromPunto(punto: Punto): Ficha {
        return this.fromXY(punto.getX(), punto.getY())
    }

    actualizar(ficha: Ficha): void {
        const ubicacion = ficha.getUbicacion()
        const punto = ubicacion.getPuntoAbstracto()
        this.fichas[punto.getX()][punto.getY()] = ficha
    }

    toFichas(): Ficha[] {
        const fichas: Ficha[] = []
        for (let i: number = 0; i < 8; i++) {
            for (let j: number = 0; j < 8; j++) {
                const ficha = this.fromXY(i, j)
                fichas.push(ficha)
            }
        }
        return fichas
    }

    fromId(id: number): Ficha[] {
        return this.toFichas().filter(ficha => ficha.getId() === id)
    }

    newInstance(): Cuadricula {
        const fichas: Ficha[][] = []
        for (let i: number = 0; i < 8; i++) {
            const l:Ficha[] =[]
            for (let j: number = 0; j < 8; j++) {
                const ficha = this.fromXY(i, j)
                l.push(ficha)
            }
            fichas.push(l)
        }
        return new Cuadricula(fichas)
    }

}

export default Cuadricula