function CSuspanceEffect(iX,iY,oParentContainer){
    
    var _oSpriteSuspance;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oContainer.x = iX-92;
        _oContainer.y = iY-34;
        _oParentContainer.addChild(_oContainer);
        
        var aSprites = new Array();
        for(var k=0;k<191;k++){
            aSprites.push( s_oSpriteLibrary.getSprite("suspance_"+k));
        }
        
        var oData = {   // image to use
                        images: aSprites, 
                        framerate:60,
                        // width, height & registration point of each sprite
                        frames: {width:426,height:754},
                        animations: {  start:0,start_anim:[0,61,"anim"],anim:[62,126] ,end:[127,190,"stop"],stop:191}
        };
       
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oSpriteSuspance = createSprite(oSpriteSheet, "start",0,0,426,754);
        _oSpriteSuspance.on("animationend",this._onAnimEnd,this);
        _oContainer.addChild(_oSpriteSuspance);

    };
    
    this.show = function(){
        if(_oContainer.visible){
            return;
        }
        _oContainer.visible = true;
        _oContainer.alpha = 0;
        
        _oSpriteSuspance.gotoAndPlay("start_anim");

        
        createjs.Tween.get(_oContainer).to({alpha:1}, 500, createjs.Ease.cubicOut);
        
        playSound("suspance",1,true);
    };
    
    this.hide = function(){
        _oSpriteSuspance.gotoAndPlay("end");

        stopSound("suspance");
    };
    
    this._onAnimEnd = function(evt){
        if (evt.name === "end"){
             _oContainer.visible = false;
             _oSpriteSuspance.gotoAndStop("start");
        }
    };
    
    this._init(iX,iY);
}