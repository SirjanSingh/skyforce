// Drifting rock obstacles. Use the bundled Rock-Obstacles.png art.
// Asteroids are *not* enemies in the threat-pattern sense -- they're
// dumb projectiles you have to either dodge or grind through. They:
//   - drift down at variable speed
//   - rotate slowly (purely visual)
//   - take 4 laser hits to break (asteroid.hp = 4)
//   - deal 12 contact damage (more than a small enemy ram, less than
//     boss contact)
//   - award only 30 points -- they're filler, not the main scoring
//
// Sit on enemiesGroup so Laser.collision automatically handles laser
// hits and Player.checkCollision automatically handles contact.

class Asteroid {
    constructor(){}

    spawn(x){
        var a = createSprite(x, -30, 50, 50);
        a.addImage(rockImg);
        a.scale = random(0.16, 0.24);
        a.velocityY = random(1.2, 2.4);
        a.rotationSpeed = random(-1.2, 1.2);
        a.lifetime = (height + 60) / a.velocityY;
        a.points = 30;
        a.hp = 4;
        a.setCollider("circle", 0, 0, 28);
        enemiesGroup.add(a);
    }
}
