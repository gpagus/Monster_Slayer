export default class MainMenu extends Phaser.Scene {
    constructor() {
      super({ key: 'MainMenu' });
    }

    preload() {

    }

    create() {

      const centerX = this.game.config.width / 2;
      const centerY = this.game.config.height / 2;


      this.add.text(centerX, centerY - 50, "👹 Monster Slayer 👹", {
        fontSize: "24px",
        color: "#ffffff",
      }).setOrigin(0.5);


      const startText = this.add.text(centerX, centerY + 50, "Press ENTER to Start", {
        fontSize: "16px",
        color: "yellow",
      }).setOrigin(0.5);


      this.input.keyboard.on("keydown-ENTER", () => {
        this.scene.start("Scene");
      });
    }
  }
