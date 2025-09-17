function CBonusPlatformController(iX,iY,oParentContainer){
    var _bCorrectJump;
    var _bEndBonus;
    var _bFinalPrize;
    var _iCurMult;
    var _iClickedButton;
    var _iPlatformWidth;
    var _iCurBet;
    var _iIdInterval;
    var _aPlatformButton;
    var _pStartPos;
    
    var _oPot = null;
    var _oCorrectPlatform;
    var _oGoalPlatform = null;
    var _oCharacter;
    var _oContainer;
    var _oContainerPlatform;
    var _oParentContainer = oParentContainer;

    
    this._init = function(iX,iY){
        _pStartPos = {x:iX,y:iY};
        _aPlatformButton = new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        _oContainerPlatform = new createjs.Container();
        _oContainer.addChild(_oContainerPlatform);
        
        var oSprite = s_oSpriteLibrary.getSprite("platform_0");
        var oPlatform = createBitmap(oSprite);
        _oContainerPlatform.addChild(oPlatform);
        

        _oCharacter = new CBonusCharacter(400,60,_oContainer);
        _oCharacter.addEventListener(ON_CHARACTER_END_JUMP,this._onEndJump,this);
        
        this.addPlatforms(false);
    };
    
    this.reset = function(){
        _bFinalPrize = false;
        _bEndBonus = false;
        _oContainerPlatform.removeAllChildren();
        _oGoalPlatform = null;
        
        if(_oPot !== null){
            _oContainer.removeChild(_oPot);
            _oPot = null;
        }
        
        _oContainer.x = _pStartPos.x;
        _oContainer.y = _pStartPos.y;
        
        var oSprite = s_oSpriteLibrary.getSprite("platform_0");
        var oPlatform = createBitmap(oSprite);
        _oContainerPlatform.addChild(oPlatform);
        
        _oCharacter.reset();
        
        this.addPlatforms(false);
        
        _oContainer.setChildIndex(_oContainerPlatform,0);
        _oContainer.setChildIndex(_oCharacter.getContainer(),1);
    };
    
    this.startBonus = function(iCurBet){
        _iCurBet = iCurBet;
        
        _oCharacter.idle();
    };
    
    this.addPlatforms = function(bFinalPrize){
        _bFinalPrize = bFinalPrize;
        for(var i=0;i<_aPlatformButton.length;i++){
            _aPlatformButton[i].unload();
        }

        _aPlatformButton = new Array();

        
        var iCont = 1;
        var iX = _oCharacter.getX() + 484;
        for(var i=0;i<3;i++){
            var oSprite = s_oSpriteLibrary.getSprite("platform_"+iCont);
            
            var oPlatform = new CBonusBut(iX,CANVAS_HEIGHT,bFinalPrize,oSprite,_oContainerPlatform);
            oPlatform.addEventListenerWithParams(ON_MOUSE_DOWN,this._onPlatformClick,this,i);

            
            _iPlatformWidth = oSprite.width/2;
            
            iX += _iPlatformWidth+38;

            _aPlatformButton.push(oPlatform);
            
            oPlatform.moveY(115,1000,500 + (200*iCont),createjs.Ease.backOut);
            iCont++;
        }
        
        var oParent = this;
        _iIdInterval = setInterval(function(){oParent.shakeRandPlatform();},2500);
    };
    
    this.unload = function(){
        this._removePlatforms();
    };
    
    this._removePlatforms = function(bEndBonus){
        clearInterval (_iIdInterval);
        
        if(_oGoalPlatform !== null){
            //ATTACH FAKE PLATFORM WHERE IS PLACED THE HERO
            var oSprite = s_oSpriteLibrary.getSprite("platform_"+(_iClickedButton+1));
            var oData = {   // image to use
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height,regX:oSprite.width/4,regY:oSprite.height/2}, 
                        animations: {  state_0: 0,state_1:1 }
            };

            var oSpriteSheet = new createjs.SpriteSheet(oData);
            var oPlatform = createSprite(oSpriteSheet, "state_1",oSprite.width/4,oSprite.height/2,oSprite.width/2,oSprite.height);
            oPlatform.x = _oGoalPlatform.getX();
            oPlatform.y = _oGoalPlatform.getY();
            oPlatform.alpha = 0;
            _oContainerPlatform.addChild(oPlatform);
            
            var oParent = this;
            createjs.Tween.get(oPlatform).to({alpha:1}, 1000).call(function(){
                                                                      oParent.addPlatforms(bEndBonus);      
                                                                    });
        }
        
        
    };
    
    this.shakeRandPlatform = function(){
        var iRandPlatform = Math.floor(Math.random()*3);
        _aPlatformButton[iRandPlatform].trembleAnimation();
    };
    
    this.jumpCharacter = function(iClickedIndex,iMult,bCorrectJump){
        _bCorrectJump = bCorrectJump;
        _iCurMult = iMult;
        
        _oGoalPlatform = _aPlatformButton[iClickedIndex];
        var pPos;
        var iTime = 1000 + (iClickedIndex*200);
        var aFallingPlatform = new Array();
        if(bCorrectJump){
            pPos = {x:_oGoalPlatform.getX(),y:77};
            for(var i=0;i<3;i++){
                if(i !== iClickedIndex){
                    aFallingPlatform.push(i);
                }
            }
            
            _oCorrectPlatform = _oGoalPlatform;
        }else{
            pPos = {x:_oGoalPlatform.getX()+100,y:845};
            iTime += 500;
            
            aFallingPlatform.push(iClickedIndex);

            for(var i=0;i<3;i++){
                if(i !== iClickedIndex){
                    aFallingPlatform.push(i);
                    break;
                }
            }
            
            for(var k=0;k<_aPlatformButton.length;k++){
                if(aFallingPlatform.indexOf(k) === -1){
                    _oCorrectPlatform = _aPlatformButton[k];
                    break;
                }
            }
            
        }
        
        //FALLING WRONG PLATFORM
        for(var j=0;j<aFallingPlatform.length;j++){
            _aPlatformButton[aFallingPlatform[j]].moveY(CANVAS_HEIGHT,1000,0,createjs.Ease.cubicOut);
        }
        
        _oCharacter.jump(pPos,iTime);
        
        if(_bFinalPrize){
            //_oContainer.swapChildren(_oContainerPlatform,_oCharacter.getContainer());
            _oContainer.setChildIndex(_oContainerPlatform,1);
            _oContainer.setChildIndex(_oCharacter.getContainer(),0);
        }
    };
    
    this._onEndJump = function(){
        var iAmount = 0;
        if(_bCorrectJump){
            if(_bEndBonus){
                _oCharacter.hide();
              
                _oGoalPlatform.playPotAnim();
                playSound("character_landing_pot",1,false);
                
                setTimeout(function(){s_oBonusPanel.endBonus();},1500);
            }else{
                playSound("character_landing",1,false);
                _oCharacter.moveDown();

                createjs.Tween.get(_oGoalPlatform.getButtonImage()).to({y:_oGoalPlatform.getY() + 26}, 500, createjs.Ease.cubicOut).
                                                                    to({y:_oGoalPlatform.getY() }, 500, createjs.Ease.cubicOut).call(function(){
                                                                                                                                            s_oBonusPanel.scrollLeft();
                                                                                                                                });
            }

            iAmount = formatEntries(_iCurMult);
            new CScoreText(iAmount,_oCorrectPlatform.getX(),_oCorrectPlatform.getY(),_oContainer);
            playSound("bonus_mult",1,false);
            
            s_oBonusPanel.refreshScoreAmount();
        }else{
            //SHOW FINAL PANEL
            playSound("character_falling",1,false);
            setTimeout(function(){s_oBonusPanel.endBonus();},1500);
        }
        
        
    };
    
    this._onPlatformClick = function(iIndex){
        for(var i=0;i<_aPlatformButton.length;i++){
            _aPlatformButton[i].setClickable(false);
        }
        
        _iClickedButton = iIndex;
        s_oBonusPanel._onButtonRelease(iIndex);
    };
    
    this.scrollLeft = function(bLastPlatform){
        _bEndBonus = bLastPlatform;
        this._removePlatforms(_bEndBonus);
        
        var iNewX = _oContainerPlatform.x - _oGoalPlatform.getX() + 384;
        createjs.Tween.get(_oContainer).to({x:iNewX}, 2000, createjs.Ease.cubicOut);
    };
    
    this._init(iX,iY);
}