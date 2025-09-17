function CAvatar(oParentContainer){
    var _pStartPosAvatar;
    
    var _oSpriteAvatar;
    var _oContainer;
    var _oParentContainer;
    
    this._init = function(){
        _pStartPosAvatar = {x:-100,y:CANVAS_HEIGHT};
        
        _oContainer = new createjs.Container();
        _oContainer.x = _pStartPosAvatar.x;
        _oContainer.y = _pStartPosAvatar.y;
        _oParentContainer.addChild(_oContainer);
        
        
        
        var aSprites = new Array();
        for(var t=0;t<289;t++){
            aSprites.push(s_oSpriteLibrary.getSprite("avatar_"+t))
        }

        var oData = {   // image to use
                        images: aSprites, 
                        framerate:60,
                        // width, height & registration point of each sprite
                        frames: {width: 382, height: 518,regX:0,regY:518},

                        animations: {  
                                        idle: [0, 121],win:[122,288,"idle"]
                                    }
        };
       
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oSpriteAvatar =  createSprite(oSpriteSheet, "start",0,635,649,635);    
        _oContainer.addChild(_oSpriteAvatar);

        this.refreshButtonPos();
    };
    
    this._hideAllAnims = function(){
   
    };
    
    this.refreshButtonPos = function(){

        if( s_iOffsetX  > 150){
            _oContainer.x = _pStartPosAvatar.x + s_iOffsetX;
        }else{
            _oContainer.x = 0;
        }
        
        _oContainer.y = _pStartPosAvatar.y - s_iOffsetY;
    };
    
    this.show = function(szAnim){
        _oSpriteAvatar.gotoAndPlay(szAnim);
    };
    
    _oParentContainer = oParentContainer;
    
    this._init();
}