import Phaser from 'phaser'
import ConfiguracionFicha from './ConfiguracionFicha'
import Game from './Game'
import MenuPrincipal from './MenuPrincipal'


const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
    backgroundColor: '#efefef',
    width: 821,
    height: 908,
    disableContextMenu: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    loader: {
        baseURL: 'assets'
    },
    scene: [
        MenuPrincipal,
        ConfiguracionFicha,
        Game
    ]
}

export default new Phaser.Game(config)
