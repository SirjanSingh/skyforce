// Score class kept as a thin shell. Hit detection + scoring now lives in
// Laser.collision() (lasersGroup.overlap(enemiesGroup, ...)), which is the
// single source of truth for laser-vs-enemy. Previously score1() ran a
// second, parallel collision pass that double-counted hits and required a
// hand-rolled this.j/this.k/this.l "every-other-frame" hack to compensate.
class Score {
    constructor(){
        // kept for backwards compat in case anything reads these
        this.l = 0;
        this.j = 0;
        this.k = 0;
    }

    score1(){
        // intentionally empty — see header comment
    }

    display(){

    }
}
