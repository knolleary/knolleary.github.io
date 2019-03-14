var w = 25;
var h = 25;
var b = null;
var s = null;
var l = null;
var menu = null;
var score = 0;
var lines = 0;
var running = false;
var ingame = false;
var Constants = {
   UP: 0,
   LEFT: 1,
   DOWN: 2,
   RIGHT: 3
}
var board = new Array(24);

var pieces = [
   [[-1,0],[1,0],[0,1]], // T
   [[-1,0],[1,0],[2,0]], // |
   [[-1,0],[-1,1],[1,0]],// L
   [[-1,0],[-1,-1],[1,0]],// L-reversed
   [[1,0],[0,1],[-1,1]], // s
   [[-1,0],[0,1],[1,1]], // z
   [[1,0],[1,1],[0,1]]   // o
];

var points = [ 10, 5, 15, 15, 20, 20, 5 ];
var colours = [
   "#a00","#0a0","#00a","#aa0","#a0a","#0aa"
];

var thePiece = null;

function init() {
   for (var i = 0;i<24;i++) {
      board[i] = new Array(14);
      for (var j = 0;j<14;j++) {
         board[i][j] = 0;
      }
   }
   b = document.getElementById("board");
   s = document.getElementById("score");
   l = document.getElementById("lines");
   menu = document.getElementById("menu");
   menu.innerHTML = "<br><b>Tetris</b><br><small>by knolleary</small><p><code>A</code> : left<br><code>D</code>: right<br><code>S</code>: down<br><br><code>Q</code>: rotate left<br><code>E</code>: rotate right<p>Press <code>space</code> to start";
}

function newGame() {
   score = 0;
   lines = 0;
   updateScores();
   running = false;
   for (var i = 0;i<24;i++) {
      for (var j = 0;j<14;j++) {
         if (board[i][j] && board[i][j].parentNode) {
            board[i][j].parentNode.removeChild(board[i][j]);
         }
         board[i][j] = 0;
      }
   }
   if (thePiece) {
      thePiece.parentNode.removeChild(thePiece);
   }
   thePiece = null;
}

function endGame() {
   menu.innerHTML = "Game Over<br>Press <code>space</code> to start";
   menu.style.display = "inline";
   ingame = false;
   running = false;
}
   

function pause(state) {
   if (ingame) {
      if (state) {
         running = false;
         menu.innerHTML = "Paused<br>Press <code>space</code> to resume";
         menu.style.display = "inline";
      } else {
         running = true;
         menu.style.display = "none";
         step();
      }
   }
}
      
function nextPiece() {
   thePiece = createPiece(Math.floor(Math.random()*pieces.length),6,0,colours[Math.floor(Math.random()*colours.length)]);
   b.appendChild(thePiece);
}   
function createPiece(id,x,y,col) {
   var anchor = createCell(x*w,y*h,col);
   anchor.type = id;
   anchor.x = x;
   anchor.y = y;
   anchor.style.top = (-5+y*h)+"px";
   anchor.style.left = (5+x*w)+"px";

   for (var c in pieces[id]) {
      var p = createCell(pieces[id][c][0]*w,pieces[id][c][1]*h,col);
      p.dx = pieces[id][c][0];
      p.dy = pieces[id][c][1];
      anchor.appendChild(p);
   }
   return anchor;
}

function canMovePiece(piece,dx,dy,dr) {
   var r = piece.rot+dr;
   if (r == -1) {
      r = 3;
   } else if (r == 4) {
      r = 0;
   }
   var nx = piece.x+dx;
   var ny = piece.y+dy;
   
   if (nx<0 || nx>13 || ny<0 || ny>23) {
      return false;
   }
   if (board[ny][nx] != 0) {
      return false;
   }
   var c = piece.childNodes;
   for (var n = 0;n<c.length;n++) {
      var p = piece.childNodes[n];
      var tx;
      var ty;
      switch(r) {
      case Constants.UP:
         tx = p.dx;
         ty = p.dy;
         break;
      case Constants.LEFT:
         tx = -p.dy;
         ty =  p.dx;
         break;
      case Constants.DOWN:
         tx = -p.dx;
         ty = -p.dy;
         break;
      case Constants.RIGHT:
         tx =  p.dy;
         ty = -p.dx;
         break;
      }
      if (nx+tx<0 || nx+tx>13 || ny+ty<0 || ny+ty>23) {
         return false;
      }
      if (board[ny+ty][nx+tx] != 0) {
         return false;
      }
   }
   return true;
}

function movePiece(piece,dx,dy) {
   if (canMovePiece(piece,dx,dy,0)) {
      piece.x+=dx;
      piece.y+=dy;
      piece.style.left = 5+piece.x*w;
      piece.style.top  = -5+piece.y*h;
      return true;
   } else {
      return false;
   }
}
function rotatePiece(piece,dr) {
   if (canMovePiece(piece,0,0,dr)) {
      piece.rot += dr;
      if (piece.rot == -1) {
         piece.rot = 3;
      } else if (piece.rot == 4) {
         piece.rot = 0;
      }
      var c = piece.childNodes;
      for (var n = 0;n<c.length;n++) {
         var p = piece.childNodes[n];
         switch(piece.rot) {
         case Constants.UP:
            p.style.left = p.dx*w;
            p.style.top  = p.dy*h;
            break;
         case Constants.LEFT:
            p.style.left = -p.dy*h;
            p.style.top  =  p.dx*w;
            break;
         case Constants.DOWN:
            p.style.left = -p.dx*w;
            p.style.top  = -p.dy*h;
            break;
         case Constants.RIGHT:
            p.style.left =  p.dy*h;
            p.style.top  = -p.dx*w;
            break;
         }
      }
      return true;
   } else {
      return false;
   }
}


function createCell(x,y,col) {
   var piece = document.createElement("div");
   piece.rot = Constants.UP;
   piece.style.position = "absolute";
   piece.style.width = w+"px";
   piece.style.height = h+"px";
   piece.style.top = y+"px";
   piece.style.left = x+"px";
   //piece.style.border = "1px solid #aaa";
   piece.style.background = col;
   return piece;
}

function lockPiece(piece) {
   board[piece.y][piece.x] = piece;
   piece.style.background = "#999";
   var p = piece.firstChild;
   score += points[piece.type];
   
   while(p!=null) {
      var tx;
      var ty;
      switch(piece.rot) {
      case Constants.UP:
         tx = p.dx;
         ty = p.dy;
         break;
      case Constants.LEFT:
         tx = -p.dy;
         ty =  p.dx;
         break;
      case Constants.DOWN:
         tx = -p.dx;
         ty = -p.dy;
         break;
      case Constants.RIGHT:
         tx =  p.dy;
         ty = -p.dx;
         break;
      }
      var sib = p.nextSibling;
      p.parentNode.removeChild(p);
      b.appendChild(p);
      p.style.top = (-5+(piece.y+ty)*h)+"px";
      p.style.left = (5+(piece.x+tx)*w)+"px";
      p.style.background = "#999";
      board[piece.y+ty][piece.x+tx] = p;
      p = sib;
   }
}

function checkLines() {
   var removeLines = new Array();
   for (var i = 23;i>=0;i--) {
      var hit = true;
      for (var j = 0;j<14;j++) {
         if (board[i][j] == 0) {
            hit = false;
            break;
         }
      }
      if (hit) {
         removeLines.push(i);
      }
   }
   for (var line in removeLines) {
      var i = removeLines[line];
      for (var j = 0;j<14;j++) {
         board[i][j].parentNode.removeChild(board[i][j]);
         board[i][j] = 0;
      }
   }
   for (var line in removeLines.reverse()) {
      var i = removeLines[line] - 1;
      for ( ; i>=0;i--) {
         for (var j = 0;j<14;j++) {
            if (board[i][j] != 0) {
               var p = board[i][j];
               board[i][j] = 0;
               board[i+1][j] = p;
               p.style.top = (-5+(i+1)*h)+"px";
            }
         }
      }
   }
   lines += removeLines.length;
   score += removeLines.length * 100;
   
}

function handleKeyPress(e) {
   var keynum;
   var keychar;
   if(window.event) {
      keynum = e.keyCode;
   } else if(e.which) {
      keynum = e.which;
   }
   if (keynum == 32) {
      if (!ingame) {
         menu.style.display = "none";
         menu.style.height = "100px";
         menu.style.top = "275px";
         
         newGame();
         running = true;
         ingame = true;
         nextPiece();
         step();
      } else {
         pause(running);
      }
   } else if (running) {
      keychar = String.fromCharCode(keynum).toLowerCase();
      switch (keychar) {
      case 'a':
         movePiece(thePiece,-1,0);
         break;
      case 's':
         movePiece(thePiece,0,1);
         break;
      case 'd':
         movePiece(thePiece,1,0);
         break;
      case 'e':
         rotatePiece(thePiece,1);
         break;
      case 'q':
         rotatePiece(thePiece,-1);
         break;
      }
   }      
   return true;
}

function updateScores() {
   s.innerHTML = padNumber(score);
   l.innerHTML = padNumber(lines);
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
function step() {
   if (running) {
      if (!movePiece(thePiece,0,1)) {
         if (thePiece.y == 0) {
            endGame();
         } else {
            lockPiece(thePiece);
            checkLines();
            updateScores();
            nextPiece();
         }
      }
      window.setTimeout("step()",300);
   }
}

