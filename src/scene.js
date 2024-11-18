export default class Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Scene" });

    this.Health;
    this.Score;
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("Tileset", "assets/Tileset.png");
    this.load.image("Tileset", "assets/Tileset.png");
    this.load.tilemapTiledJSON("map", "assets/escena.json");
    this.load.atlas("player", "assets/player.png", "assets/player.json");

    this.load.audio("player_attack", "assets/player_attack.mp3");
    this.load.audio('theme', 'assets/theme.mp3');
    this.load.audio('get_hit', 'assets/get_hit.mp3');
    this.load.audio('kill', 'assets/kill.mp3');

    this.load.atlas("skeleton", "assets/skeleton.png", "assets/skeleton.json");
    this.load.atlas("mushroom", "assets/mushroom.png", "assets/mushroom.json");
    this.load.atlas(
      "flying_eye",
      "assets/flying_eye.png",
      "assets/flying_eye.json"
    );
    this.load.atlas("goblin", "assets/goblin.png", "assets/goblin.json");

    this.Health = 30;
    this.Score = 0;
  }

  create() {
    // Delete the animations if already exists
    this.anims.remove("idle");
    this.anims.remove("attackLeft");
    this.anims.remove("attackRight");
    this.anims.remove("skeleton_die");
    this.anims.remove("skeleton_walk");
    this.anims.remove("mushroom_walk");
    this.anims.remove("mushroom_die");
    this.anims.remove("goblin_die");
    this.anims.remove("goblin_walk");
    this.anims.remove("flying_eye_die");
    this.anims.remove("skeleton_attack");
    this.anims.remove("mushroom_attack");
    this.anims.remove("goblin_attack");
    this.anims.remove("flying_eye_attack");
    this.anims.remove("flying_eye_fly");


    const map = this.make.tilemap({ key: "map" });

    const tileset = map.addTilesetImage("Tileset", "Tileset");
    const backgroundTile = map.addTilesetImage("background", "background");
    const backgroundLayer = map.createLayer("background", backgroundTile);
    const bushesLayer = map.createLayer("bushes", tileset);
    this.groundLayer = map.createLayer("ground", tileset);
    this.groundLayer.setCollisionByExclusion([-1], true);

    const centerX = map.widthInPixels / 2;
    const centerY = map.heightInPixels / 2;
    this.player = this.physics.add.sprite(centerX, centerY, "player");
    this.player.body.gravity.y = 300;
    this.physics.add.collider(this.player, this.groundLayer);
    this.player.setVelocityX(0);

    this.enemies = this.physics.add.group();

    if (!this.sound.get('theme') || !this.sound.get('theme').isPlaying) {
      this.sound.play('theme', {
        loop: true,
        volume: 0.050,
      });
    }
    // Create attack hitbox (temporary and disabled by default)
    this.hitbox = this.physics.add.sprite(0, 0, null);
    this.hitbox.body.setAllowGravity(false);
    this.hitbox.setVisible(false);
    this.hitbox.body.enable = false;

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerHit,
      null,
      this
    );

    this.physics.add.overlap(
      this.hitbox,
      this.enemies,
      this.handleHitboxCollision,
      null,
      this
    );


    // Set a timer to spawn enemies
    this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    // Create controls
    this.attackLeftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.attackRightKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );

    ////////////////////////////////////////// ANIMATIONS //////////////////////////////////////////

    // PLAYER ATTACK
    this.anims.create({
      key: "attackLeft",
      frames: [
        { key: "player", frame: "attack_01" },
        { key: "player", frame: "attack_02" },
        { key: "player", frame: "attack_03" },
      ],
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "attackRight",
      frames: [
        { key: "player", frame: "attack_01" },
        { key: "player", frame: "attack_02" },
        { key: "player", frame: "attack_03" },
      ],
      frameRate: 10,
      repeat: 0,
    });

    // PLAYER IDLE
    this.anims.create({
      key: "idle",
      frames: [
        { key: "player", frame: "idle_01" },
        { key: "player", frame: "idle_02" },
        { key: "player", frame: "idle_05" },
        { key: "player", frame: "idle_06" },
      ],
      frameRate: 3,
      repeat: -1,
    });

    // ENEMY ATTACK ANIMATIONS
    this.anims.create({
      key: "skeleton_attack",
      frames: this.anims.generateFrameNames("skeleton", {
        prefix: "attack_0",
        start: 1,
        end: 8,
      }),
      frameRate: 16,
      repeat: -1,
    });

    this.anims.create({
      key: "mushroom_attack",
      frames: this.anims.generateFrameNames("mushroom", {
        prefix: "attack_0",
        start: 1,
        end: 8,
      }),
      frameRate: 16,
      repeat: -1,
    });

    this.anims.create({
      key: "goblin_attack",
      frames: this.anims.generateFrameNames("goblin", {
        prefix: "attack_0",
        start: 1,
        end: 8,
      }),
      frameRate: 16,
      repeat: -1,
    });

    this.anims.create({
      key: "flying_eye_attack",
      frames: this.anims.generateFrameNames("flying_eye", {
        prefix: "attack_0",
        start: 1,
        end: 8,
      }),
      frameRate: 16,
      repeat: -1,
    });

    // ENEMY MOVE ANIMATIONS
    this.anims.create({
      key: "skeleton_walk",
      frames: this.anims.generateFrameNames("skeleton", {
        prefix: "move_0",
        start: 1,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });


    this.anims.create({
      key: "mushroom_walk",
      frames: this.anims.generateFrameNames("mushroom", {
        prefix: "move_0",
        start: 1,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "flying_eye_fly",
      frames: this.anims.generateFrameNames("flying_eye", {
        prefix: "move_0",
        start: 1,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });


    this.anims.create({
      key: "goblin_walk",
      frames: this.anims.generateFrameNames("goblin", {
        prefix: "move_0",
        start: 1,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // ENEMY DEATH ANIMATIONS
    this.anims.create({
      key: "skeleton_die",
      frames: this.anims.generateFrameNames("skeleton", {
        prefix: "die_0",
        start: 1,
        end: 2,
      }),
      frameRate: 6,
      repeat: 0,
    });

    this.anims.create({
      key: "mushroom_die",
      frames: this.anims.generateFrameNames("mushroom", {
        prefix: "die_0",
        start: 1,
        end: 2,
      }),
      frameRate: 6,
      repeat: 0,
    });

    this.anims.create({
      key: "goblin_die",
      frames: this.anims.generateFrameNames("goblin", {
        prefix: "die_0",
        start: 1,
        end: 2,
      }),
      frameRate: 6,
      repeat: 0,
    });

    this.anims.create({
      key: "flying_eye_die",
      frames: this.anims.generateFrameNames("flying_eye", {
        prefix: "die_0",
        start: 1,
        end: 2,
      }),
      frameRate: 6,
      repeat: 0,
    });

    this.get_hit = this.sound.add("get_hit");
    this.get_hit.setVolume(0.5);

    this.attackSound = this.sound.add("player_attack");
    this.attackSound.setVolume(0.5);

    this.kill = this.sound.add("kill");
    this.kill.setVolume(0.5);


    // Create text for health
    this.lifeText = this.add.text(16, 16, "Health: " + this.Health, {
      fontSize: "15px",
      color: "#ffffff",
    });

    // Create text for score
    this.scoreText = this.add.text(16, 48, "Score: " + this.Score, {
      fontSize: "15px",
      color: "#ffffff",
    });

    this.player.anims.play("idle", true); // When not moving, play idle animation
  }

  update() {

    if (this.attackLeftKey.isDown) {

      if (!this.attackSound.isPlaying) {
        this.attackLeft();
        this.attackSound.play();
      }
    }


    if (this.attackRightKey.isDown) {

      if (!this.attackSound.isPlaying) {
        this.attackRight();
        this.attackSound.play();
      }
    }


    if (!this.attackSound.isPlaying) {

      this.player.anims.play("idle", true);
    }

    // update health on the text
    this.lifeText.setText("Health: " + this.Health);
  }

  ////////////////////////////////////// METHODS //////////////////////////////////////

  attackLeft() {
    this.player.setFlipX(true);
    this.player.anims.play("attackLeft", true);


    this.hitbox.setPosition(this.player.x - 20, this.player.y);
    this.hitbox.body.setSize(20, 25);
    this.activateHitbox();
  }

  attackRight() {
    this.player.setFlipX(false);
    this.player.anims.play("attackRight", true);


    this.hitbox.setPosition(this.player.x + 18, this.player.y);
    this.hitbox.body.setSize(20, 25);
    this.activateHitbox();
  }


  activateHitbox() {
    this.hitbox.body.setSize(12, 25);
    this.hitbox.setVisible(false);
    this.hitbox.body.enable = true;
    console.log('Hitbox ON');


    this.time.delayedCall(300, () => {
      this.hitbox.body.enable = false;
      console.log('Hitbox OFF');

    });
  }



  handleHitboxCollision(hitbox, enemy) {

    if (!enemy.isDying) {
      enemy.isDying = true;
      enemy.body.enable = false;

      this.kill.play();

      switch (enemy.constructor.name) {
        case "Skeleton":
          enemy.anims.play("skeleton_die", true);
          break;
        case "Mushroom":
          enemy.anims.play("mushroom_die", true);
          break;
        case "Goblin":
          enemy.anims.play("goblin_die", true);
          break;
        case "FlyingEye":
          enemy.anims.play("flying_eye_die", true);
          break;
      }

      // Destroy the enemy object
      enemy.on("animationcomplete", () => {
        enemy.destroy();
        this.Score += 10;
        this.scoreText.setText("Score: " + this.Score);
      });
    }
  }


  spawnEnemy() {
    const enemyType = Phaser.Math.RND.pick([
      "Skeleton",
      "Goblin",
      "Mushroom",
      "FlyingEye",
    ]);
    const side = Phaser.Math.RND.pick(["left", "right"]);
    let xPosition;


    if (side === "left") {
      xPosition = -50; // out of the left border
    } else {
      xPosition = this.game.config.width + 50; // out of the right border
    }


    let enemy;
    switch (enemyType) {
      case "Skeleton":
        enemy = new Skeleton(this, xPosition, 0);
        break;
      case "Goblin":
        enemy = new Goblin(this, xPosition, 0);
        break;
      case "Mushroom":
        enemy = new Mushroom(this, xPosition, 0);
        break;
      case "FlyingEye":
        enemy = new FlyingEye(this, xPosition, 0);
        break;
    }


    this.enemies.add(enemy);

    // flips if it is coming from the right
    if (side === "left") {
      enemy.setFlipX(false);
      enemy.setVelocityX(enemy.speed);
    } else {
      enemy.setFlipX(true);
      enemy.setVelocityX(-enemy.speed);
    }


    enemy.body.setGravityY(300);
    this.physics.add.collider(enemy, this.groundLayer);
  }


  handlePlayerHit(player, enemy) {


    if (!enemy.isAttacking && !enemy.isDying) {

      enemy.isAttacking = true;


      switch (enemy.constructor.name) {
        case "Skeleton":
          enemy.anims.play("skeleton_attack", true);
          break;
        case "Mushroom":
          enemy.anims.play("mushroom_attack", true);
          break;
        case "Goblin":
          enemy.anims.play("goblin_attack", true);
          break;
        case "FlyingEye":
          enemy.anims.play("flying_eye_attack", true);
          break;
      }


      enemy.body.setVelocity(0, 0);


      const attackInterval = setInterval(() => {

        if (enemy.anims?.currentAnim?.key?.includes("attack")) {
          this.get_hit.play();
          this.Health -= enemy.damage;

          this.lifeText.setText("Health: " + this.Health);

          if (this.Health <= 0) {
            this.sound.stopAll();
            this.scene.start("GameOver", { score: this.Score });
          }
        }


        enemy.isAttacking = false;


        clearInterval(attackInterval);
      }, 475);
    }
  }



}


////////////////////////////////////// BASE CLASS ENEMY //////////////////////////////////////

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.body.setSize(this.width, this.height);

    this.damage = 0;
    this.scene = scene;
    this.speed = 0;
  }
}

////////////////////////////////////// SPECIFIC CLASSES //////////////////////////////////////

class Skeleton extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, "skeleton");
    this.damage = 10;
    this.speed = 38;
    this.anims.play("skeleton_walk", true);
    this.body.setSize(this.width * 1.1, this.height * 0.9);
  }
}

class Goblin extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, "goblin");
    this.damage = 5;
    this.speed = 70;
    this.anims.play("goblin_walk", true);
    this.body.setSize(this.width * 0.5, this.height * 0.9);
  }

}

class Mushroom extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, "mushroom");
    this.damage = 3;
    this.speed = 45;
    this.anims.play("mushroom_walk", true);
  }

}

class FlyingEye extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, "flying_eye");
    this.damage = 1;
    this.speed = 140;
    this.anims.play("flying_eye_fly", true);
  }


}

