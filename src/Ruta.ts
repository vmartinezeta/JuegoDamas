import Segmento from './Segmento'
import Ficha from './Ficha'
import SuperFicha from './SuperFicha'


class Ruta {
    private segmentos: Segmento[]
    private fichas: Ficha[]

    constructor(segmentos: Segmento[]) {
        this.segmentos = segmentos
        this.fichas = []
        segmentos.forEach(actual => {
            if (this.fichas.length === 0) {
                this.fichas = [...actual.getFichas()]
            } else {
                this.fichas = [...this.fichas, ...actual.getApartir2daFicha()]
            }
        })
    }

    getFichaEnJuego(): SuperFicha {
        const [s] = this.segmentos
        return s.getFichaEnJuego()
    }

    getFichasRival(): Ficha[] {
        const fichaEnJuego = this.getFichaEnJuego()
        return this.fichas.filter(ficha => ficha.getId() !== fichaEnJuego.getId() && ficha.getId() !== 0)
    }

    getEspaciosFinal(): Ficha[] {
        const segmentos: Segmento[] = []
        const reverso = this.segmentos.slice().reverse()
        for (let s of reverso) {
            if (s.toBit() !== 0) {
                if (segmentos.length === 0) {
                    segmentos.push(s)
                }
                break
            }
            segmentos.push(s)
        }

        const [s]:Segmento[] = segmentos
        if (segmentos.length === 1 && s.toBit() !== 0) {
            return [s.getUltimaFicha()]
        }

        segmentos.reverse()
        let espacios:Ficha[] = []
        for (let actual of segmentos) {
            if (espacios.length === 0) {
                espacios = [...actual.getFichas()]
            } else {
                espacios = [...espacios, ...actual.getApartir2daFicha()]
            }
        }
        return espacios
    }

    getFichasEspacio(): Ficha[] {
        return this.fichas.filter(f => f.isEspacio())
    }

    tieneKO(): boolean {
        return this.getFichasRival().length > 0
    }

}

export default Ruta