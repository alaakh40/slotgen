function CBonusPanel(){
    var _bUpdate;
    var _bSpriteLoaded = false;
    var _bFinalPrize;
    var _iGameState;
    var _iMaskWidth;
    var _iMaskHeight;
    var _iCurResources;
    var _iTotResources;
    var _iTotWin;
    var _iCurBet;
    var _iCurMult;
    var _aBonusSeq;
    var _oMaskPreloader;
    var _oListenerBlock;
    var _pStartPosScore;

    var _oBg;
    var _oBgLoading;
    var _oLoadingText;
    var _oProgressBar;
    var _oParallax;
    var _oPlatform;
    var _oResultPanel;
    var _oScoreText = null;
    var _oSparkleRainbow;
    var _oTextInstructions;
    var _oMultAmountText;
    var _oContainerScore;
    var _oBlock;
    var _oContainer;
    
    this._init = function(){
        _bUpdate = false;
        _bSpriteLoaded = true;
        _iGameState = -1;
        
        _oContainer.removeAllChildren();
        _oContainer.visible = false;
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('bg_bonus');
        _oBg = createBitmap(oSpriteBg);
        _oContainer.addChild(_oBg);

        _oBlock = new createjs.Shape();
        _oBlock.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oListenerBlock = _oBlock.on("click",function(){});
        _oContainer.addChild(_oBlock);

        var aSprites = new Array();
        for(var t=0;t<76;t++){
            aSprites.push(s_oSpriteLibrary.getSprite("particle_rainbow_"+t));
        }
        
        var oData = {   
                        images: aSprites,
                        // width, height & registration point of each sprite
                        frames: {width: 800, height: 260},
                        animations: {start:0,anim:[0,75]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oSparkleRainbow = createSprite(oSpriteSheet, "start",0,0,800,260);
        _oSparkleRainbow.x = 584;
        _oSparkleRainbow.y = 132;
        _oContainer.addChild(_oSparkleRainbow);
        
        _oParallax = new CBonusParallax(0,CANVAS_HEIGHT,_oContainer);

        _oPlatform = new CBonusPlatformController(0,580,_oContainer);

        _pStartPosScore = {x:10,y:10};
        _oContainerScore = new createjs.Container();
        _oContainerScore.x = _pStartPosScore.x;
        _oContainerScore.y = _pStartPosScore.y;
        _oContainer.addChild(_oContainerScore);
        
        var oSpiteScoreBg = s_oSpriteLibrary.getSprite("amount_bonus_win");
        var oBgScore = createBitmap(oSpiteScoreBg);
        _oContainerScore.addChild(oBgScore);
        
        _oMultAmountText = new createjs.Text(formatEntries(0),"56px "+FONT_GAME_1, "#fede00");
        _oMultAmountText.textAlign="center";
        _oMultAmountText.textBaseline = "alphabetic";
        _oMultAmountText.x = oSpiteScoreBg.width/2;
        _oMultAmountText.y = 64;
        _oContainerScore.addChild(_oMultAmountText);
        
        _oTextInstructions = new createjs.Text(TEXT_BONUS_HELP,"60px "+FONT_GAME_1, "#fede00");
        _oTextInstructions.x = CANVAS_WIDTH/2;
        _oTextInstructions.y = 150;
        _oTextInstructions.textAlign = "center";
        _oTextInstructions.textBaseline = "alphabetic";
        _oTextInstructions.lineWidth = 900;
        _oTextInstructions.shadow = new createjs.Shadow("#000", 1, 1, 1);
        _oContainer.addChild(_oTextInstructions);
        
        
        this._startBonus();
    };
    
    this._loadAllResources = function(){

        _oContainer = new createjs.Container();
        s_oAttachSection.addChild(_oContainer);

        var oSprite = s_oSpriteLibrary.getSprite('bg_loading_bonus');
        _oBgLoading = createBitmap(oSprite);
        _oContainer.addChild(_oBgLoading);
        
        var oSprite = s_oSpriteLibrary.getSprite('progress_bar');
       _oProgressBar  = createBitmap(oSprite);
       _oProgressBar.x = CANVAS_WIDTH/2 - (oSprite.width/2);
       _oProgressBar.y = CANVAS_HEIGHT - 91;
       _oContainer.addChild(_oProgressBar);
       
       _iMaskWidth = oSprite.width;
       _iMaskHeight = oSprite.height;
       _oMaskPreloader = new createjs.Shape();
       _oMaskPreloader.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(_oProgressBar.x, _oProgressBar.y, 1,_iMaskHeight);
       _oContainer.addChild(_oMaskPreloader);
       
       _oProgressBar.mask = _oMaskPreloader;
       
        _oLoadingText = new createjs.Text("","21px "+FONT_GAME_1, "#fff");
        _oLoadingText.x = CANVAS_WIDTH/2;
        _oLoadingText.y = CANVAS_HEIGHT - 59;
        _oLoadingText.shadow = new createjs.Shadow("#000", 2, 2, 2);
        _oLoadingText.textBaseline = "alphabetic";
        _oLoadingText.textAlign = "center";
        _oContainer.addChild(_oLoadingText);

        s_oSpriteLibrary.init( this._onResourceBonusLoaded,this._onAllImagesLoaded, this );
        
        //LOAD BONUS SPRITES        
        s_oSpriteLibrary.addSprite("bg_bonus","./sprites/bonus/bg_bonus.jpg");
        s_oSpriteLibrary.addSprite("platform_0","./sprites/bonus/platform_0.png");
        s_oSpriteLibrary.addSprite("platform_1","./sprites/bonus/platform_1.png");
        s_oSpriteLibrary.addSprite("platform_2","./sprites/bonus/platform_2.png");
        s_oSpriteLibrary.addSprite("platform_3","./sprites/bonus/platform_3.png");
        s_oSpriteLibrary.addSprite("rock_0","./sprites/bonus/rock_0.png");
        s_oSpriteLibrary.addSprite("rock_1","./sprites/bonus/rock_1.png");
        
        for(var t=0;t<76;t++){
            s_oSpriteLibrary.addSprite("particle_rainbow_"+t,"./sprites/bonus/particle_rainbow/particle_rainbow_"+t+".png");
        }
        
        for(var k=0;k<119;k++){
            s_oSpriteLibrary.addSprite("character_idle_"+k,"./sprites/bonus/character/idle/character_idle_"+k+".png");
        }
        
        for(var k=0;k<97;k++){
            s_oSpriteLibrary.addSprite("character_jump_"+k,"./sprites/bonus/character/jump/character_jump_"+k+".png");
        }
        
        for(var k=0;k<56;k++){
            s_oSpriteLibrary.addSprite("character_pot_"+k,"./sprites/bonus/character/pot/character_pot_"+k+".png");
        }
        
        _iCurResources = 0;
       
        _iTotResources = s_oSpriteLibrary.getNumSprites();
        if(_iTotResources === 0){
            this._startBonus();
        }else{
            s_oSpriteLibrary.loadSprites();
        }

    };
    
    // CALLBACK FOR LOADED RESOURCES
    this._onResourceBonusLoaded = function(){
        _iCurResources++;
        var iPerc = Math.floor(_iCurResources/_iTotResources *100);
        _oLoadingText.text = iPerc+"%";
        _oMaskPreloader.graphics.clear();
        var iNewMaskWidth = Math.floor((iPerc*_iMaskWidth)/100);
        _oMaskPreloader.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(_oProgressBar.x, _oProgressBar.y, iNewMaskWidth,_iMaskHeight);
        
        if(_iCurResources === _iTotResources){
           this._init();
        }
    };
    
    
    this.refreshButtonPos = function(){
        if(_oContainerScore !== undefined){
            _oContainerScore.x = _pStartPosScore.x + s_iOffsetX;
            _oContainerScore.y = _pStartPosScore.y + s_iOffsetY;
        }
    };
    
    this.unload = function(){
        _oBlock.off("click",_oListenerBlock);

        _oPlatform.unload();
    };
    
    this._onAllImagesLoaded = function(){
    };
    
    this.reset = function(){
        _oResultPanel.unload();
        _oPlatform.reset();
        
        if(_oScoreText !== null){
            _oScoreText.unload();
            _oScoreText = null;
        }
        
        _oMultAmountText.text = formatEntries(0);
        
        _oParallax.reset();
        _oSparkleRainbow.gotoAndStop("start");
    };
    
    this.show = function(aBonusSeq,iCurBet,bFinalPrize){
        _iCurBet = iCurBet;
        _aBonusSeq = aBonusSeq;
        
        _bFinalPrize = bFinalPrize;
 
        
        if(_bSpriteLoaded){
            this._startBonus();
        }else{
            this._loadAllResources();
        }
    };
    
    this.hide = function(){
        _bUpdate = false;
        
        stopSound("soundtrack_bonus");
        setVolume("ambience_game",1);
        
        _oBg.off("click",function(){});
        _oContainer.visible = false;

        this.reset();
        s_oGame.exitFromBonus(_iTotWin);
    };
    
    this._startBonus = function(){
        _iTotWin = 0;
        
        playSound("soundtrack_bonus",1,true);
        
        
        _oSparkleRainbow.gotoAndPlay("anim");
        
        _oPlatform.startBonus(_iCurBet);
        _oTextInstructions.alpha = 0;
        createjs.Tween.get(_oTextInstructions).to({alpha:1}, 800);
        
        _oBg.on("click",function(){});
        _oContainer.visible = true;
        _bUpdate = true;
        _iGameState = STATE_BONUS_IDLE;
        
        this.refreshButtonPos();
    };
    
    this.endBonus = function(){
        _oResultPanel = new CBonusResultPanel(_iTotWin,_oContainer);
        
        if(_bFinalPrize){
            playSound("bonus_end_win",1,false);
        }else{
            playSound("bonus_end",1,false);
        }
        stopSound("soundtrack_bonus");
    };
    
    this.refreshScoreAmount = function(){
        _oMultAmountText.text = formatEntries(_iTotWin);
    };
    
    this.prepareForJump = function(iClickedIndex){
        if(_aBonusSeq.length-1 === 0){
            /*if(_bFinalPrize){
                //REACH GOLD POT
                _oPlatform.jumpCharacter(iClickedIndex,_aBonusSeq[0],true);
            }else{*/
               //MAKE A RIGHT JUMP
               _iCurMult = _aBonusSeq.shift();
               _iTotWin += _iCurMult//*_iCurBet;
               _oPlatform.jumpCharacter(iClickedIndex,_iCurMult,true);
            //}
        }else if(_aBonusSeq.length === 0){
            _oPlatform.jumpCharacter(iClickedIndex,0,false);
        }else{
            _iCurMult = _aBonusSeq.shift();
            _iTotWin += _iCurMult//*_iCurBet;

            //MAKE A RIGHT JUMP
            _oPlatform.jumpCharacter(iClickedIndex,_iCurMult,true);
        }
    };
    
    this.scrollLeft = function(){
        var bLastPlatform = false;
      
        if(_aBonusSeq.length-1 === 0){
            if(_bFinalPrize){
                //REACH GOLD POT
                bLastPlatform = true;
            }
        }else if(_aBonusSeq.length === 0){
            var iRand = Math.random();
            
            bLastPlatform = iRand>0.5?true:false;
        }
       
        _oPlatform.scrollLeft(bLastPlatform);
        _oParallax.scrollLeft();
        
        createjs.Tween.get(_oTextInstructions).to({alpha:1}, 800);
     };

    
    this._onButtonRelease = function(iIndex){
        createjs.Tween.get(_oTextInstructions).to({alpha:0}, 500);
        s_oBonusPanel.prepareForJump(iIndex);
    };

    
    s_oBonusPanel = this;

}

var s_oBonusPanel = null;