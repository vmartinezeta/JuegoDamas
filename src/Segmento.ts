import Ficha from './Ficha'
import SuperFicha from './SuperFicha'


const SEGMENTO_LARGO: number[] = [130, 310]
const SEGMENTO_CORTO: number[] = [10, 30]


class Segmento {
    private fichaEnJuego: SuperFicha
    private fichas: Ficha[]

    constructor(fichaEnJuego: SuperFicha, fichas: Ficha[]) {
        this.fichaEnJuego = fichaEnJuego
        this.fichas = fichas
    }

    getApartir2daFicha():Ficha[] {
        const fichas = []
        for (let i=1;i<this.fichas.length; i++) {
            fichas.push(this.fichas[i])
        }
        return fichas
    }

    getFichas(): Ficha[] {
        return this.fichas
    }

    getFichaEnJuego(): SuperFicha {
        return this.fichaEnJuego
    }

    getUltimaFicha(): Ficha {
        return this.fichas[this.fichas.length - 1]
    }

    esValido(): boolean {
        if (SEGMENTO_LARGO.includes(this.toNumber())) {
            return true
        }
        if (this.fichas.length > 2) {
            this.quitarUltimaFicha()
        }
        return SEGMENTO_CORTO.includes(this.toNumber())
    }

    esCorto(): boolean {
        return this.getFichas().length === 2
    }

    esLargo():boolean {
        return !this.esCorto()
    }

    quitarUltimaFicha(): void {
        this.fichas.pop()
    }

    toString(): string {
        const pk = this.fichas.map(ficha => ficha.getId())
        pk[0] = this.fichaEnJuego.getId()
        return pk.join('')
    }

    toBit(): number {
        return this.fichas.map(ficha => ficha.getId()).reduce((total, actual) => {
            return total + actual
        }, 0)
    }

    toNumber(): number {
        return +this.toString()
    }

    newInstance(): Segmento {
        return new Segmento(this.fichaEnJuego, this.fichas)
    }

}

export default Segmento