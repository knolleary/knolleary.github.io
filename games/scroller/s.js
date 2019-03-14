var debug = null;
var heights = new Array();
var b = null;
var w = 32;
var h = 32;
var s = 60; // frame delay
var lx = 0; // The index of the first visible slice
var score = 0;
var scoreboard = null;
var hero = null;
var baddies = new Array();

var playing = true;
var running = true;

var Constants = {
   UP: 1,
   LEFT: 2,
   DOWN: 4,
   RIGHT: 8
}
var BlockTypes = {
   FLAT: 0,
   RAMP_UP: 1,
   RAMP_DOWN: 2,
   HOLE: 3
}

var Colours = {
   ground1: "#060",
   ground2: "#a60",
   sky:     "#aaf",
}

var clouds = new Array(3);

function init() { //{{{
   scoreboard = document.getElementById("score"); 
   debug = document.getElementById("debug");
   b = document.getElementById("board");
   b.style.background = Colours.sky;
   height = 12;
   last = -1;
   for (var i = 0;i<1000;i++) {
      var d = Math.floor(Math.random()*4);
      if (d == 0) {
         if (height > 10 && last != 1) {
            height--;
         }
      } else if (d == 1 && last != 0) {
         if (height < 14) {
            height++;
         }
      }
      last = d;
      heights[i] = height;
   }
   for (var i = 0;i<20;i++) {
      drawSlice(i*w,i);
   }
   for (var i = 0; i<3;i++) {
      clouds[i] = createCloud((i*200)+Math.floor(Math.random()*200),Math.floor(Math.random()*200));
      b.appendChild(clouds[i]);
   }
   
   hero = document.createElement('div');
   hero.dh = 0;
   hero.style.position = "absolute";
   hero.style.width = "24";
   hero.style.height = "40";
   hero.style.background = "#ff0";
   hero.style.left = "8";
   hero.style.top = (heights[0]-1)*h - hero.dh;
   hero.style.zIndex = 100;
   hero.state = 0;
   hero.jumpState = 0;
   b.appendChild(hero);
   adjustHeroHeight();
   
   //var coin = createCoin(50,50);
   //b.appendChild(coin);
   //animateCoin();
   
   loop();
}
// }}}

function createBlock(x,y) { //{{{
   var c = document.createElement("div");
   c.style.position = "absolute";
   c.style.width = 26;
   c.style.height = 26;
   c.style.top = y;
   c.style.left = x;
   c.style.borderTop = "2px solid #a90";
   c.style.borderLeft = "2px solid #a90";
   c.style.borderBottom = "2px solid #fea";
   c.style.borderRight = "2px solid #fea";
   c.style.background = "#fa3";
   c.style.color = "#ffe";
   c.style.fontSize = '21px';
   c.style.fontWeigth = 'boldest';
   c.style.textAlign = "center";
   c.style.zIndex = 100;
   c.innerHTML = "?";
   c.state = 1;
   return c;
}
//}}}

function createCloud(x,y) { // {{{
   var c = document.createElement("div");
   c.style.position = "absolute";
   c.style.width = 70;
   c.style.height = 40;
   c.style.top = y;
   c.style.left = x;
   c.style.border = "1px solid "+Colours.sky;
   c.style.background = "#fff";
   var c1 = document.createElement("div");
   c1.style.position = "absolute";
   c1.style.width = 30;
   c1.style.height = 30;
   c1.style.top = -15;
   c1.style.left = 20;
   c1.style.border = "1px solid "+Colours.sky;
   c1.style.background = "#fff";
   var c2 = c1.cloneNode(false);
   c2.style.top = -5;
   c2.style.left = -5;
   var c3 = c1.cloneNode(false);
   c3.style.top = -5;
   c3.style.left = 45;
   
   c.appendChild(c2);
   c.appendChild(c3);
   c.appendChild(c1);
   
   c.speed = 1+Math.floor(Math.random()*5);
   return c;
}
//}}}

function createCoin(x,y) { // {{{
   var c = document.createElement("div");
   c.style.position = "absolute";
   c.style.width = 16;
   c.style.height = 16;
   c.style.top = y;
   c.style.left = x;
   c.style.background = "#fe3";
   c.style.textAlign = "center";
   c.style.fontSize = "12";
   c.style.borderLeft = "1px solid #da3";
   c.style.borderTop = "1px solid #da3";
   c.style.borderRight = "1px solid #ffc";
   c.style.borderBottom = "1px solid #ffc";
   c.style.color = "#da3";
   c.innerHTML = "$";
   c.d = -1;
   c.w = 20;
   return c;
}
//}}}

function createBaddie(x,y) { // {{{
   var c = document.createElement("div");
   c.style.zIndex = 150;
   c.style.position = "absolute";
   c.style.width = 24;
   c.style.height = 20;
   c.style.top = y;
   c.style.left = x;
   c.style.background = "#09f";
   
   c.ll = document.createElement("div");
   c.ll.style.position = "absolute";
   c.ll.style.width = 5;
   c.ll.style.height = 3;
   c.ll.style.top = 20;
   c.ll.style.left = 5;
   c.ll.style.background = "#ccc";
   
   c.lr = c.ll.cloneNode(false);
   c.lr.style.left = 14;
   
   c.appendChild(c.ll);
   c.appendChild(c.lr);
   
   c.d = Math.round(Math.random());
   c.moved = 0;
   c.range = 50 + 20*Math.floor(Math.random()*5);
   if (c.d==0) c.d=-1;
   return c;
}
//}}}

function drawSlice(x,i) { // {{{
   var ph = 12;
   if (i > 0) {
      ph = heights[i-1];
   }
   
   var bp = document.createElement("div");
   bp.style.position = "absolute";
   bp.style.width = w+"px";
   bp.style.background = Colours.ground2;
   bp.style.top = h+"px";
   //bp.style.borderLeft="solid 1px #fa0";
   var p;
   if (heights[i] == ph || ph == 100) {
      p = createCell(BlockTypes.FLAT, x,heights[i]*h,Colours.ground1);
      bp.style.height = (500-((heights[i]+1)*h))+"px";
      if (Math.random()<0.5) {
         p.block = createBlock(3,-100);
         p.appendChild(p.block);
      } else if (i>5 && Math.random()<0.4) {
         baddies[i] = createBaddie(x+3,p.offsetTop+14);
         baddies[i].id = "baddy_"+i;
         b.appendChild(baddies[i]);
      }
   } else if (heights[i] < ph) {
      p = createCell(BlockTypes.RAMP_UP, x,heights[i]*h,Colours.ground1);
      var p2 = createCell(BlockTypes.RAMP_UP,0, 0 ,Colours.ground1);
      p2.style.borderTop = h+"px solid "+Colours.ground1;
      p2.style.borderRight = w+"px solid "+Colours.ground2;
      p.appendChild(p2);
      bp.style.height = (500-((heights[i]+2)*h))+"px";
   } else if (heights[i] > ph) {
      p = createCell(BlockTypes.RAMP_DOWN, x,ph*h,Colours.ground1);
      var p2 = createCell(BlockTypes.RAMP_DOWN,-w, 0 ,Colours.ground1);
      p2.style.borderTop = h+"px solid "+Colours.ground1;
      p2.style.borderLeft = w+"px solid "+Colours.ground2;
      p.appendChild(p2);
      bp.style.height = (500-((ph+2)*h))+"px";
      bp.style.left = -w;
   }
   //if (!p.block && Math.random()<0.5) {
   //   p.coin = createCoin(5,-30);
   //   p.appendChild(p.coin);
   //}
   p.id = "slice_"+i;
   p.appendChild(bp);
   b.appendChild(p);
   
}
// }}}

function createCell(type,x,y,col) { //{{{
   var piece = document.createElement("div");
   piece.style.position = "absolute";
   piece.type = type;
   if (type == BlockTypes.FLAT) {
      piece.style.width = w+"px";
      piece.style.height = h+"px";
   } else if (type == BlockTypes.RAMP_UP) {
      piece.style.borderTop = h+"px solid "+Colours.sky;
      piece.style.borderRight = w+"px solid "+col;
   } else if (type == BlockTypes.RAMP_DOWN) {
      piece.style.borderTop = h+"px solid "+Colours.sky;
      piece.style.borderLeft = w+"px solid "+col;
   }
   piece.style.left = x+"px";
   piece.style.top = y+"px";
   //piece.style.border = "1px solid #aaa";
   piece.style.background = col;
   return piece;
}
//}}}

function handleKeyUp(e) { //{{{
   var keynum;
   var keychar;
   if(window.event) {
      keynum = e.keyCode;
   } else if(e.which) {
      keynum = e.which;
   }
   keychar = String.fromCharCode(keynum).toLowerCase();
   switch (keychar) {
   case 'a':
      if ((hero.state&Constants.LEFT)==Constants.LEFT) {
         hero.state -= Constants.LEFT;
      }
      break;
   case 'd':
      if ((hero.state&Constants.RIGHT)==Constants.RIGHT) {
         hero.state -= Constants.RIGHT;
      }
      break;
   case 'w':
      hero.state -= Constants.UP;
      break;

   }      
   return true;
}
//}}}

function handleKeyDown(e) { //{{{
   var keynum;
   var keychar;
   if(window.event) {
      keynum = e.keyCode;
   } else if(e.which) {
      keynum = e.which;
   }
   keychar = String.fromCharCode(keynum).toLowerCase();
   switch (keychar) {
   case 'a':
      if ((hero.state&Constants.RIGHT)!=Constants.RIGHT) {
         hero.state |= Constants.LEFT;
      }      
      break;
   case 's':
      break;
   case 'd':
      if ((hero.state&Constants.LEFT)!=Constants.LEFT) {
         hero.state |= Constants.RIGHT;
      }
      break;
   case 'e':
      break;
   case 'w':
      if ((hero.state&Constants.UP)!=Constants.UP) {
         hero.state |= Constants.UP;
         jump();
      }
      break;
   case 'q':
      break;
   }      
   return true;
}

//}}}

function loop() { //{{{
   if (running) {
      if ((hero.state&Constants.LEFT)==Constants.LEFT) {
         stepLeft();
      } else if ((hero.state&Constants.RIGHT)==Constants.RIGHT) {
         stepRight();
      }
      adjustHeroHeight();
      moveBaddies();
      //hero.innerHTML = getLandHeight(hero.offsetLeft+12);
      window.setTimeout("loop()",s);
   }
}
//}}}

function moveBaddies() { //{{{
   _dc();
   for (var id in baddies) {
      _d(id);
      var bad = baddies[id];
      if (bad.offsetLeft < -w) {
         bad.parentNode.removeChild(bad);
         delete baddies[id];
      } else {
         bad.style.left = bad.offsetLeft + bad.d;
         bad.moved += bad.d;
         if (Math.abs(bad.moved) == bad.range || bad.moved == 0) {
            bad.d = -bad.d;
         }
         bad.style.top = getLandHeight(bad.offsetLeft+(bad.offsetWidth/2))+18;
         
         if (hero.offsetLeft < bad.offsetLeft+bad.offsetWidth && hero.offsetLeft+hero.offsetWidth >bad.offsetLeft) {
            if (hero.offsetTop+hero.offsetHeight > bad.offsetTop+5) {
               running = false;
               animateDeath(0);
            } else if (hero.offsetTop+hero.offsetHeight+hero.dh > bad.offsetTop) {
               score += 10;
               baddies[id].moved = 0;
               delete baddies[id];
               hero.dh = -10;
               updateScores();
               animateBaddy("baddy_"+id);
            }
         }
      }
   }
}
//}}}

function getSlice(x) { //{{{
   var dhx = x-document.getElementById('slice_'+lx).offsetLeft;
   var dx = Math.floor(dhx/w);
   return document.getElementById('slice_'+(lx+dx));
}
//}}}

function getLandHeight(x) { //{{{
   var dhx = x-document.getElementById('slice_'+lx).offsetLeft;
   var dx = Math.floor(dhx/w);
   var ph = 12;
   if (lx+dx > 0) {
      ph = heights[lx+dx-1];
   }
   var base = (heights[lx+dx]-1)*h;
   if (heights[lx+dx] < ph) {
      base -= (dhx%w)-w;
   } else if (heights[lx+dx] > ph) {
      base += (dhx%w)-w;
   }
   return base;
}
//}}}

function adjustHeroHeight() { //{{{
   var sliceL = getSlice(hero.offsetLeft);
   var sliceR = getSlice(hero.offsetLeft+hero.offsetWidth);
   var base = getLandHeight(hero.offsetLeft+12);
   var blockLBottom = 0;
   var blockLTop = 0;
   var blockLLeft = 0;
   var blockLRight = 0;
   var blockRBottom = 0;
   var blockRTop = 0;
   var blockRLeft = 0;
   var blockRRight = 0;
   if (sliceL.block) {
      blockLTop = sliceL.offsetTop+sliceL.block.offsetTop;
      blockLBottom = blockLTop + sliceL.block.offsetHeight;
      blockLLeft = sliceL.offsetLeft + sliceL.block.offsetLeft;
      blockLRight = blockLLeft + sliceL.block.offsetWidth;
   }
   if (sliceR.block) {
      blockRTop = sliceR.offsetTop+sliceR.block.offsetTop;
      blockRBottom = blockRTop + sliceR.block.offsetHeight;
      blockRLeft = sliceR.offsetLeft + sliceR.block.offsetLeft;
      blockRRight = blockRLeft + sliceR.block.offsetWidth;
   }

   if (hero.offsetTop < base) {
      if (!sliceL.block || hero.offsetLeft > blockLRight || hero.offsetTop+hero.offsetHeight != blockLTop) {
         if (!sliceR.block || hero.offsetLeft+hero.offsetWidth < blockRLeft || hero.offsetTop+hero.offsetHeight != blockRTop) {
            if (hero.dh < 0 && (hero.state&Constants.UP)==Constants.UP) {
               hero.dh += 0.9;
            } else {
               hero.dh += 1.8;
            }
         }
      }
   }
   if (hero.dh > 14) {
      hero.dh = 14;
   }
   if (hero.dh == 0 && hero.offsetTop > base) {
      hero.style.top = base;
   } else if (base < hero.offsetTop + hero.dh) {
      hero.style.top = base;
      hero.dh = 0;
   } else {
      if (sliceL.block) {
         if (hero.offsetTop+hero.offsetHeight <= blockLTop && hero.offsetTop+hero.offsetHeight+hero.dh >= blockLTop) {
            hero.style.top = blockLTop - hero.offsetHeight;
            hero.dh = 0;
         } else if (hero.offsetTop>=blockLBottom && hero.offsetTop+hero.dh<=blockLBottom) {
            if (hero.offsetTop+hero.offsetHeight > sliceL.offsetTop+sliceL.block.offsetTop) {
               if (hero.offsetLeft <= blockLRight) {
                  hitBlock(sliceL.block);
                  hero.dh = sliceL.offsetTop+sliceL.block.offsetTop+sliceL.block.offsetHeight - hero.offsetTop;
               }
            }
         }
      }
      if (sliceR.block) {
         if (hero.offsetTop+hero.offsetHeight <= blockRTop && hero.offsetTop+hero.offsetHeight+hero.dh >= blockRTop) {
            if (hero.offsetLeft+hero.offsetWidth >= blockRLeft) {
               hero.style.top = blockRTop - hero.offsetHeight;
               hero.dh = 0;
            }
         } else if (hero.offsetTop>=blockRBottom && hero.offsetTop+hero.dh<=blockRBottom) {
            if (hero.offsetTop+hero.offsetHeight > blockRTop) {
               if (hero.offsetLeft+hero.offsetWidth >= blockRLeft) {
                  hitBlock(sliceR.block);
                  hero.dh = sliceR.offsetTop+sliceR.block.offsetTop+sliceR.block.offsetHeight - hero.offsetTop;
               }
            }
         }
      }
      hero.style.top = hero.offsetTop + hero.dh;
   }
}
//}}}

function stepLeft() { //{{{
   if ((hero.state&Constants.LEFT)==Constants.LEFT) {
      if (hero.offsetLeft > 8) {
         var sliceL = getSlice(hero.offsetLeft-5);
         var blockLTop = 0;
         var blockLBottom = 0;
         var blockLLeft = 0;
         var blockLRight = 0;
         
         if (sliceL.block) {
            blockLTop = sliceL.offsetTop+sliceL.block.offsetTop;
            blockLBottom = blockLTop + sliceL.block.offsetHeight;
            blockLLeft = sliceL.offsetLeft + sliceL.block.offsetLeft;
            blockLRight = blockLLeft + sliceL.block.offsetWidth;
         }
         if (!sliceL.block || hero.offsetTop >= blockLBottom || hero.offsetTop+hero.offsetHeight <= blockLTop) {
            hero.style.left = hero.offsetLeft - 5;
         } else if (sliceL.block) {
            if (hero.offsetTop < blockLBottom && hero.offsetTop+hero.offsetHeight > blockLTop) {
               if (hero.offsetLeft - 5 < blockLRight) {
                  hero.style.left = blockLRight;
               }
            }
         }
      }
   }
}
//}}}
   
function stepRight() { //{{{
   if ((hero.state&Constants.RIGHT)==Constants.RIGHT) {
      var sliceR = getSlice(hero.offsetLeft+hero.offsetWidth+5);
      var blockRTop = 0;
      var blockRBottom = 0;
      var blockRLeft = 0;
      var blockRRight = 0;

      if (sliceR.block) {
         blockRTop = sliceR.offsetTop+sliceR.block.offsetTop;
         blockRBottom = blockRTop + sliceR.block.offsetHeight;
         blockRLeft = sliceR.offsetLeft + sliceR.block.offsetLeft;
         blockRRight = blockRLeft + sliceR.block.offsetWidth;
      }
      var step = 0;
      hero.innerHTML = "";
      if (!sliceR.block || hero.offsetTop >= blockRBottom || hero.offsetTop+hero.offsetHeight <= blockRTop) {
         step = 5;
      } else if (sliceR.block) {
         if (hero.offsetTop < blockRBottom && hero.offsetTop+hero.offsetHeight > blockRTop) {
            if (hero.offsetLeft+hero.offsetWidth + 5 > blockRLeft) {
               step = blockRLeft-(hero.offsetLeft+hero.offsetWidth+1);
            } else {
               step = 5;
            }
         }
      }
      if (step != 0) {
         if (hero.offsetLeft < 350) {
            hero.style.left = hero.offsetLeft + step;
         } else {
            if (lx<980) {
               for (var i = lx;i<lx+20;i++) {
                  var slice = document.getElementById("slice_"+i);
                  if (slice.offsetLeft < -w) {
                     slice.parentNode.removeChild(slice);
                     drawSlice(document.getElementById("slice_"+(lx+19)).offsetLeft+w,lx+20);
                     lx++;
                  } else {
                     slice.style.left = slice.offsetLeft-step;
                  }
               }
               
               for (var i = 0; i<3;i++) {
                  clouds[i].style.left = clouds[i].offsetLeft - (clouds[i].speed);
                  if (clouds[i].offsetLeft < -70) {
                     clouds[i].parentNode.removeChild(clouds[i]);
                     clouds[i] = createCloud(600+Math.floor(Math.random()*200),Math.floor(Math.random()*200));
                     b.appendChild(clouds[i]);
                  }
               }
               for (var id in baddies) {
                  var bad = baddies[id];
                  bad.style.left = bad.offsetLeft-step;
               }
            }
         }
      }
   }
}
//}}}

function jump() { //{{{
   if ((hero.state&Constants.UP)==Constants.UP) {
      debug.innerHTML = "";
      if (hero.dh == 0){
         hero.dh = -16;
      }
   }
}
//}}}

function hitBlock(block) { //{{{
   if (block.state == 1) {
      var c = createCoin(block.offsetLeft+6,block.offsetTop-5);
      c.style.zIndex = 1;
      block.style.zIndex = 2;
      block.state = 0;
      block.innerHTML = "";
      c.id = block.parentNode+"_coin";
      c.d = 5;
      c.block = block;
      block.parentNode.appendChild(c);
      animateCoin(c.id);
      score += 1;
      updateScores();
   }
}
//}}}

function animateBaddy(id) { //{{{
   _d(id);
   var baddy = document.getElementById(id);
   baddy.style.top = baddy.offsetTop + 5;
   baddy.style.height = baddy.offsetHeight - 5;
   baddy.ll.style.top = baddy.ll.offsetTop - 5;
   baddy.lr.style.top = baddy.lr.offsetTop - 5;
   
   baddy.moved++;
   if (baddy.moved < 3) {
      window.setTimeout("animateBaddy('"+id+"');",60);
   } else {
      baddy.parentNode.removeChild(baddy);
   }
}
//}}}

function animateCoin(id) { //{{{
   var coin = document.getElementById(id);
   coin.style.top = coin.offsetTop - 20;
   coin.d--;
   if (coin.d>0) {
      window.setTimeout("animateCoin('"+id+"');",60);
   } else {
      coin.parentNode.removeChild(coin);
      coin.block.style.background = "#e90";
   }
}
//}}}

function animateDeath(step) { //{{{
   if (step == 0) {
      hero.style.zIndex = 1001;
      b.curtain1 = document.createElement("div");
      b.curtain1.style.position = "absolute";
      b.curtain1.style.left = 0;
      b.curtain1.style.top = 0;
      b.curtain1.style.width = 1;
      b.curtain1.style.height = b.offsetHeight;
      b.curtain1.style.background = "#000";
      b.curtain1.style.zIndex = 1000;
      
      b.curtain2 = b.curtain1.cloneNode(true);
      b.curtain2.style.height = 1;
      b.curtain2.style.width = b.offsetWidth;
      
      b.curtain3 = b.curtain1.cloneNode(true);
      b.curtain3.style.left = b.offsetWidth;
      
      b.curtain4 = b.curtain1.cloneNode(true);
      b.curtain4.style.top = b.offsetHeight;
      b.curtain4.style.width = b.offsetWidth;
      b.curtain4.style.height = 1;
      
      var hcx = hero.offsetLeft + (hero.offsetWidth/2);
      var hcy = hero.offsetTop + (hero.offsetHeight/2);
      
      b.curtain1.d = hcx / 10;
      b.curtain2.d = hcy / 10;
      b.curtain3.d = (b.offsetWidth-hcx) / 10;
      b.curtain4.d = (b.offsetHeight-hcy) / 10;
      
      b.appendChild(b.curtain1);
      b.appendChild(b.curtain2);
      b.appendChild(b.curtain3);
      b.appendChild(b.curtain4);
      
      window.setTimeout("animateDeath("+(step+1)+")",60);
   } else if (step < 11){
      b.curtain1.style.width = b.curtain1.offsetWidth + b.curtain1.d;
      b.curtain2.style.height = b.curtain2.offsetHeight + b.curtain2.d;
      b.curtain3.style.left = b.curtain3.offsetLeft - b.curtain3.d;
      b.curtain3.style.width = b.curtain3.offsetWidth + b.curtain3.d;
      b.curtain4.style.top = b.curtain4.offsetTop - b.curtain4.d;
      b.curtain4.style.height = b.curtain4.offsetHeight + b.curtain4.d;
      
      hero.style.top = hero.offsetTop + 2;
      hero.style.height = hero.offsetHeight - 2;
      hero.style.left = hero.offsetLeft + 2;
      hero.style.width = hero.offsetWidth - 2;

      window.setTimeout("animateDeath("+(step+1)+")",60);
   } else {
      hero.parentNode.removeChild(hero);
      b.menu = document.createElement("div");
      b.menu.style.position = "absolute";
      b.menu.style.left = 100;
      b.menu.style.top = 200;
      b.menu.style.width = 400;
      b.menu.style.height = 80;
      b.menu.style.background = "#333";
      b.menu.style.fontSize = "30px";
      b.menu.style.color = "#ff0";
      b.menu.style.zIndex = 1001;
      b.menu.style.textAlign = "center";
      b.menu.innerHTML = "Game Over<br/>Score: "+score;
      b.appendChild(b.menu);

   }
   
}
//}}}

function _d(msg) {
   debug.innerHTML = msg+"<br>"+debug.innerHTML;
}
function _dc(msg) {
   debug.innerHTML = "";
}

function updateScores() {
   scoreboard.innerHTML = padNumber(score);
}

function padNumber(n) {
   var text = "";
   if (n<10) {
      text = "00000";
   } else if (n < 100) {
      text = "0000";
   } else if (n < 1000) {
      text = "000";
   } else if (n < 10000) {
      text = "00";
   } else if (n < 100000) {
      text = "0";
   }
   return text+n;
}

