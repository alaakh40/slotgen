function CBonusParallax(iX,iY,oParentContainer){
    
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("rock_0");
        var oRock = createBitmap(oSprite);
        oRock.regY = oSprite.height;
        oRock.x = -50;
        oRock.y = 0;
        _oContainer.addChild(oRock);
        
        oSprite = s_oSpriteLibrary.getSprite("rock_1");
        var oRock = createBitmap(oSprite);
        oRock.regY = oSprite.height;
        oRock.x = 1000;
        oRock.y = 100;
        _oContainer.addChild(oRock);
        
        
        var oSprite = s_oSpriteLibrary.getSprite("rock_0");
        var oRock = createBitmap(oSprite);
        oRock.regY = oSprite.height;
        oRock.x = 2600;
        oRock.y = 200;
        oRock.scaleX = -1;
        _oContainer.addChild(oRock);
        
        oSprite = s_oSpriteLibrary.getSprite("rock_1");
        var oRock = createBitmap(oSprite);
        oRock.regY = oSprite.height;
        oRock.x = 3500;
        oRock.y = 150;
        _oContainer.addChild(oRock);

    };
    
    this.reset = function(){
        _oContainer.x = 0;
    };
    
    this.scrollLeft = function(){
        createjs.Tween.get(_oContainer).to({x:_oContainer.x - 100 }, 2000, createjs.Ease.cubicOut);
    };
    
    this._init(iX,iY);
}