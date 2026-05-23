class Game {
    constructor(){

    }
    
    start(){
        selectObj.selectPlane();
        selectObj.selectPlaneOther();

        if(gameState === "menu"){
            if(mousePressedOver(startGame)){
                // Route into the level-select map instead of straight to
                // level 1, so the player can pick any unlocked level.
                gameState = "levelSelect";
                main_Screen.visible = false;
                fc2 = frameC; // re-arm any debounce that reads fc2
            }
            if(frameC > (fc2 + 50) || fc2 === undefined){
                if(mousePressedOver(plane_Selection)){
                    gameState = "selectPlane";
                    selectObj.displayPlane();
                    fc1 = frameC;
                }
            }
        }
        else if(gameState === "selectPlane"){
            if(frameC > (fc1 + 100)){
                if(mousePressedOver(backButton) && planeNumber !== undefined){
                    backObj.backFromPlaneSelection();
                    fc2 = frameC;
                }
            }
        }
        else if(gameState === "play"){
            gameObj.play();
            level = 1;
        }
    }

    play(){
        if(level === 1){
            levelObj.level1();
        }
    }
    display(){
        
    }
}
