function CBonusBut(iXPos,iYPos,bFinalPrize,oSprite, oParentContainer){
    var _bDisabled;
    
    var _iScaleFactor;
    
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams;
    var _oListenerDown;
    var _oListenerRelease;
    var _oListenerOver;
    
    var _oContainer;
    var _oButton;
    var _oPot;
    var _oTween;
    var _oParent;
    
    this._init =function(iXPos,iYPos,bFinalPrize,oSprite, oParentContainer){
        _bDisabled = false;
        
        _iScaleFactor = 1;
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos; 
        _oContainer.scaleX =   _oContainer.scaleY = _iScaleFactor;   
        oParentContainer.addChild(_oContainer);
        
        var oData = {   // image to use
                    images: [oSprite], 
                    // width, height & registration point of each sprite
                    frames: {width: oSprite.width/2, height: oSprite.height,regX:oSprite.width/4,regY:oSprite.height/2}, 
                    animations: {  state_0: 0,state_1:1 }
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _oButton = createSprite(oSpriteSheet, "state_0",oSprite.width/4,oSprite.height/2,oSprite.width/2,oSprite.height);                   
        _oContainer.addChild(_oButton);        
        
        if(bFinalPrize){
            //ATTACH GOLD POT
            var aSprites = new Array();
            for(var k=0;k<56;k++){
                aSprites.push(s_oSpriteLibrary.getSprite("character_pot_"+k));
            }
            var oData = {   
                        images: aSprites,
                        // width, height & registration point of each sprite
                        frames: {width: 283, height: 459, regX: 141, regY: 459}, 
                        animations: {start:0,anim:[8,55,"stop"],stop:55}
                   };

            var oSpriteSheet = new createjs.SpriteSheet(oData);
            _oPot = createSprite(oSpriteSheet, "start",166,538,332,538);
            _oPot.y = -32;
            _oContainer.addChild(_oPot);
        }      
        
        this._initListener();
    };
    
    this.unload = function(){
        if(s_bMobile){
            _oContainer.off("mousedown", _oListenerDown);
            _oContainer.off("click" , _oListenerRelease);
        } else {
            _oContainer.off("mousedown", _oListenerDown);
            _oContainer.off("mouseover", _oListenerOver);
            _oContainer.off("click" , _oListenerRelease);
        }
        
       oParentContainer.removeChild(_oContainer);
    };
    
    this.setVisible = function(bVisible){
        _oContainer.visible = bVisible;
    };
    
    this.setClickable = function(bVal){
        _bDisabled = !bVal;
    };
    
    this._initListener = function(){
        if(s_bMobile){
            _oListenerDown = _oContainer.on("mousedown", this.buttonDown);
            _oListenerRelease = _oContainer.on("click" , this.buttonRelease);
        } else {
            _oListenerDown = _oContainer.on("mousedown", this.buttonDown);
            _oListenerOver = _oContainer.on("mouseover", this.buttonOver);
            _oListenerRelease = _oContainer.on("click" , this.buttonRelease);
        }     
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,aParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
    
    this.buttonRelease = function(){
        if(_bDisabled){
            return;
        }
        _oContainer.scaleX = _iScaleFactor;
        _oContainer.scaleY = _iScaleFactor;
        
        playSound("click",1,false);
        
        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisabled){
            return;
        }
        
       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
       }
    };
    
    this.buttonOver = function(evt){
        if(!s_bMobile){
            if(_bDisabled){
                return;
            }
            evt.target.cursor = "pointer";
        }  
    };

    this.trembleAnimation = function () {
        _oTween = createjs.Tween.get(_oContainer).to({rotation: 5}, 75, createjs.Ease.quadOut).to({rotation: -5}, 140, createjs.Ease.quadIn).to({rotation: 0}, 75, createjs.Ease.quadIn);
    };
    
    this.moveY = function(iFinalY,iTime,iDelay,oEasing){
        _oTween = createjs.Tween.get(_oContainer).wait(iDelay).to({y:iFinalY}, iTime, oEasing);
    };
    
    this.playPotAnim = function(){
        _oPot.gotoAndPlay("anim");
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oContainer.x = iXPos;
         _oContainer.y = iYPos;
    };
    
    this.setX = function(iXPos){
         _oContainer.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oContainer.y = iYPos;
    };
    
    this.getButtonImage = function(){
        return _oContainer;
    };

    this.getX = function(){
        return _oContainer.x;
    };
    
    this.getY = function(){
        return _oContainer.y;
    };

    _oParent = this;
    this._init(iXPos,iYPos,bFinalPrize,oSprite, oParentContainer);
    
}