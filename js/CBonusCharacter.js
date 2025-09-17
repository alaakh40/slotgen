function CBonusCharacter(iX,iY,oParentContainer){
    var _pStartPos;
    var _aCbCompleted;
    var _aCbOwner;
    var _oFinalPosInfos;
    
    var _oAnimIdle;
    var _oAnimJump;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    var _oThis = this;
    
    this._init = function(iX,iY){
        _pStartPos = {x:iX,y:iY};
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
       
        var aSprites = new Array();
        for(var k=0;k<119;k++){
            aSprites.push(s_oSpriteLibrary.getSprite("character_idle_"+k));
        }
        
        var oData = {   
                        images: aSprites,
                        // width, height & registration point of each sprite
                        frames: {width: 276, height: 257, regX: 138, regY: 257}, 
                        animations: {start:0,anim:[0,118]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oAnimIdle = createSprite(oSpriteSheet, "start",138,257,276,257);
        _oContainer.addChild(_oAnimIdle);
        
        
        aSprites = new Array();
        for(var k=0;k<97;k++){
            aSprites.push(s_oSpriteLibrary.getSprite("character_jump_"+k));
        }
        
        var oData = {   
                        images: aSprites,
                        // width, height & registration point of each sprite
                        frames: {width: 276, height: 257, regX: 138, regY: 257}, 
                        //animations: {start:0,start_jump:[0,8,"before_jump"],before_jump:[9,12,"jumping"],jumping:[13,28],landing:[29,47,"start"]}
                        animations: {start:0,start_jump:[0,10,"before_jump"],"before_jump":[11,28,"jumping"],jumping:[29,57],landing:[58,96,"start"]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oAnimJump = createSprite(oSpriteSheet, "start",138,257,276,257);
        _oContainer.addChild(_oAnimJump);
        _oAnimJump.on("animationend",this._onEndAnimJump,this);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.hide = function(){
        _oAnimIdle.visible = false;
        _oAnimJump.visible = false;
        _oAnimJump.gotoAndStop("start");
        _oAnimIdle.gotoAndStop("start");
    };

    this.reset = function(){
        _oContainer.x = _pStartPos.x;
        _oContainer.y = _pStartPos.y;
    };
     
    this.idle = function(){
        _oAnimIdle.visible = true;
        _oAnimJump.visible = false;
        _oAnimJump.gotoAndStop("start");
        _oAnimIdle.gotoAndPlay("anim");
    };
    
    this.jump = function(pPos,iTime){
        _oFinalPosInfos = {pos:pPos,time:iTime};
        
        _oAnimIdle.visible = false;
        _oAnimJump.visible = true;
        _oAnimIdle.gotoAndStop("start");
        _oAnimJump.gotoAndPlay("start_jump");
        
        playSound("character_jump",1,false);
    };
    
    this._onEndAnimJump = function(evt){
        if(evt.name === "start_jump"){
            var iTime = _oFinalPosInfos.time;
            var pPos = _oFinalPosInfos.pos;
            
            var iHeight = 200 + Math.random()*50;
            createjs.Tween.get(_oContainer).to({y:_oContainer.y - iHeight}, iTime/2, createjs.Ease.cubicOut).to({y: pPos.y}, iTime/2, createjs.Ease.cubicIn);

            createjs.Tween.get(_oContainer).to({x:pPos.x}, iTime, createjs.Ease.linear).call(function(){
                    _oThis.endJump();
            });
        }
    };
    
    this.endJump = function(){
        _oAnimJump.gotoAndPlay("landing");
        
        if(_aCbCompleted[ON_CHARACTER_END_JUMP]){
            _aCbCompleted[ON_CHARACTER_END_JUMP].call(_aCbOwner[ON_CHARACTER_END_JUMP]);
        }
    };
    
    this.moveDown = function(){
        createjs.Tween.get(_oAnimJump).to({y:_oAnimJump.y + 20}, 500, createjs.Ease.cubicOut).to({y:_oAnimJump.y }, 500, createjs.Ease.cubicOut).call(function(){
                                                                                                                                                        _oThis.idle();
                                                                                                                                                    });
    };
    
    this.getX = function(){
        return _oContainer.x;
    };
    
    this.getContainer = function(){
        return _oContainer;
    };
    
    this._init(iX,iY);
}