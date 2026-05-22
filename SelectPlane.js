// 9 plane-picker tiles laid out in a 3-column x 3-row grid. The previous
// version expanded this into 9 named globals (planeMenu1..planeMenu9)
// and re-stated every scale assignment inside every branch of every
// handler (~290 lines for what is one 3x3 grid). Now: one planeMenus[]
// array, three small loops.

// Index by 1..9; slot 0 unused so planeNumber maps directly.
var planeMenus = [null, null, null, null, null, null, null, null, null, null];

class Select_Plane {
    constructor(){

    }

    _planeImages(){
        // Returned lazily — these globals are populated by preload().
        return [null, plane1, plane2, plane3, plane4, plane5,
                      plane6, plane7, plane8, plane9];
    }

    _highlight(selected){
        for(var i = 1; i <= 9; i++){
            planeMenus[i].scale = (i === selected) ? 0.75 : 0.6;
        }
    }

    displayPlane(){
        gameState = "selectPlane";
        main_Screen.visible = false;
        selectPlaneMenu.visible = true;
        selectPlaneMenu.addImage(plane_SelectionMenuImg);
        selectPlaneMenu.scale = 0.45;

        plane_Selection.destroy();

        // back-nav button
        backButton = createSprite(67, displayHeight - 65);
        backButton.addImage("back", backButtonImg);
        backButton.visible = true;
        backButton.scale = 0.8;

        var cols = [65, 250, 435];
        var rows = [150, 350, 550];
        var images = this._planeImages();
        for(var i = 1; i <= 9; i++){
            var col = (i - 1) % 3;
            var row = Math.floor((i - 1) / 3);
            var s = createSprite(cols[col], rows[row], 50, 50);
            s.addImage(images[i]);
            s.scale = 0.6;
            planeMenus[i] = s;
            // back-compat globals so any external code still resolves them
            window["planeMenu" + i] = s;
        }
    }

    selectPlane(){
        if(gameState !== "selectPlane") return;
        for(var i = 1; i <= 9; i++){
            if(mousePressedOver(planeMenus[i])){
                planeNumber = i;
                this._highlight(i);
                return;
            }
        }
    }

    selectPlaneOther(){
        if(!planeNumber || planeNumber < 1 || planeNumber > 9) return;
        if(!planeMenus[planeNumber]) return;
        this._highlight(planeNumber);
    }

    destroyP(){
        for(var i = 1; i <= 9; i++){
            if(planeMenus[i]){
                planeMenus[i].destroy();
                planeMenus[i] = null;
            }
        }
    }

    display(){

    }
}
