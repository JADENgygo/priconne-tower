import Phaser from "phaser";
import { useEffect, useRef } from "react";
import { parseCookies } from "nookies";

export default function Game() {
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) {
      return;
    }
    ref.current = true;

    const config = {
      parent: "game",
      type: Phaser.AUTO,
      width: 640,
      height: 480,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      }
    };

    new Phaser.Game(config);

    function preload(this: Phaser.Scene) {
      this.load.image('plate', '/plate.webp');
      this.load.image('peko', '/pudding_peko.webp');
    }

    const scales = [0.6, 0.5, 0.4, 0.3, 0.2];
    let positions = [[0, 1, 2, 3, 4], [], []];
    let puddings: Phaser.GameObjects.Image[] = [];
    let target: null | number = null;
    let offset = 0;
    let score = 0;
    let exploded = false;
    let scoreText: Phaser.GameObjects.Text;
    let passedText: Phaser.GameObjects.Text;
    let resetText: Phaser.GameObjects.Text;

    let background: Phaser.GameObjects.Rectangle;
    let frame: Phaser.GameObjects.Rectangle;
    function create(this: Phaser.Scene) {
      background = this.add.rectangle(320, 240, 640, 480, 0xff0000);

      const leftPlate = this.add.image(110, 425, 'plate');
      leftPlate.setScale(0.8);
      const centerPlate = this.add.image(320, 425, 'plate');
      centerPlate.setScale(0.8);
      const rightPlate = this.add.image(530, 425, 'plate');
      rightPlate.setScale(0.8);

      for (let i = 0; i < 5; ++i) {
        const image = this.add.image(0, 0, "peko");
        image.setScale(scales[i]);
        puddings.push(image);
      }

      const left = this.add.graphics().fillStyle(0xffffff, 0).fillRect(0, 0, 640 / 3, 480).setInteractive(
        new Phaser.Geom.Rectangle(0, 0, 640 / 3, 480), Phaser.Geom.Rectangle.Contains
      );
      left.on('pointerdown', () => move(0));
      const center = this.add.graphics().fillStyle(0xffffff, 0).fillRect(640 / 3, 0, 640 * 2 / 3, 480).setInteractive(
        new Phaser.Geom.Rectangle(640 / 3, 0, 640 * 2 / 3, 480), Phaser.Geom.Rectangle.Contains
      );
      center.on('pointerdown', () => move(1));
      const right = this.add.graphics().fillStyle(0xffffff, 0).fillRect(640 * 2 / 3, 0, 640, 480).setInteractive(
        new Phaser.Geom.Rectangle(640 * 2 / 3, 0, 640, 480), Phaser.Geom.Rectangle.Contains
      );
      right.on('pointerdown', () => move(2));

      scoreText = this.add.text(530, 20, "????????????\n0???", {font: "20px sans-serif", color: "#000"});
      passedText = this.add.text(260, 200, "", {font: "30px sans-serif", color: "#ff0000"});
      resetText = this.add.text(25, 20, "????????????", {font: "20px sans-serif", color: "#ff0000"}).setInteractive();
      resetText.on("pointerdown", () => {
        positions = [[0, 1, 2, 3, 4], [], []];
        puddings.forEach(e => e.angle = 0);
        target = null;
        offset = 0;
        score = 0;
        scoreText.text = "????????????\n0???";
        exploded = false;
        passedText.text = "";
        resetText.text = "????????????";
        resetText.x = 25;
        resetText.y = 20;
        resetText.setFill("#ff0000");
      });
      frame = this.add.rectangle(320, 240, 640, 480);
      frame.setStrokeStyle(5, 0x000);
    }

    const move = (index: number) => {
      if (positions[2].length === 5) {
        exploded = true;
        return;
      }
      if (target === null) {
        if (positions[index].length === 0) {
          return;
        }
        offset = 50 - offset;
        target = index;
        return;
      }

      if (target === index) {
        offset = 50 - offset;
        target = null;
        return;
      }
      if (positions[target][positions[target].length - 1] < positions[index][positions[index].length - 1]) {
        return;
      }
      const e = positions[target].pop();
      if (e === undefined) {
        console.error('move pop error');
        return;
      }
      positions[index].push(e);
      offset = 50 - offset;
      target = null;
      score++;
      scoreText.text = `????????????\n${score}???`;
    };

    const xs = [...Array(5)].map(_ => Math.random() * 10);
    const ys = [...Array(5)].map(_ => Math.random() * 10);
    const rotations = [...Array(5)].map(_ => (Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);

    function update() {
      const cookie = parseCookies();
      const theme = cookie.theme === "dark" ? "dark" : "light";
      // const theme = localStorage.getItem('theme');
      if (theme === "light") {
        background.setFillStyle(0xffffff, 1);
        frame.setStrokeStyle(5, 0x000);
        scoreText.setFill("#000");
      }
      else {
        background.setFillStyle(0x1a1e22, 1);
        frame.setStrokeStyle(5, 0xffffff);
        scoreText.setFill("#ffffff");
      }

      if (positions[2].length === 5) {
        passedText.text = "????????????";
        resetText.text = "?????????????????????";
        if (theme === "light") {
          resetText.setFill("#000");
        }
        else {
          resetText.setFill("#ffffff");
        }
        resetText.x = 245;
        resetText.y = 280;
        if (exploded) {
          puddings.forEach((e, i) => {
            if (e.x + xs[i] < 0 || 640 < e.x + xs[i]) {
              xs[i] = -xs[i];
            }
            if (e.y + ys[i] < 0 || 480 < e.y + ys[i]) {
              ys[i] = -ys[i];
            }
            e.x += xs[i];
            e.y += ys[i];
            e.angle += rotations[i];
          });
          return;
        }
      }

      for (let [i, e] of positions.entries()) {
        if (e.length === 0) {
          continue;
        }
        for (let [ii, ee] of e.entries()) {
          const xs = [115, 325, 535];
          const ys = [350, 365, 375, 385, 395].map(e => e + 25);
          const coefficient = i === target && ii + 1 === e.length ? 1 : 0;
          const height = e.slice(0, ii).map(e => puddings[e].height * scales[e] / 2).reduce((previousValue, currentValue) => previousValue + currentValue, 0);
          puddings[ee].x = xs[i];
          puddings[ee].y = ys[e[0]] - height  - offset * coefficient;
        }
      }
    }
  }, []);
  return null;
};
