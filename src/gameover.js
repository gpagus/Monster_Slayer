export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: "GameOver" });
    }

    preload() {

    }

    create() {
        const centerX = this.game.config.width / 2;
        const centerY = this.game.config.height / 2;

        // gets the final score of the last scene
        const finalScore = this.scene.settings.data.score;

        //  "Game Over" text
        this.add.text(centerX, centerY - 50, "GAME OVER", {
            fontSize: "48px",
            color: "#ff0000",
        }).setOrigin(0.5);

        // Final score
        this.add.text(centerX, centerY + 10, "Score: " + finalScore, {
            fontSize: "32px",
            color: "#ffffff",
        }).setOrigin(0.5);

        const restartText = this.add.text(centerX, centerY + 50, "Press SPACE to Restart", {
            fontSize: "24px",
            color: "#ffffff",
        }).setOrigin(0.5);

        // Input to restart the game
        this.input.keyboard.on("keydown-SPACE", () => {
            this.scene.start("Scene");
        });
    }
}
