class Game {
    constructor(){

    }
    
    start(){
        selectObj.selectPlane();
        selectObj.selectPlaneOther();

        if(gameState === "menu"){
            if(mousePressedOver(startGame)){
                gameState = "play";
                fc3 = frameCount;
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
