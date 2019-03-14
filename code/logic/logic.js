function hideAbout() {
   var aa = new Animator('about',{steps: 5, targetLeft: -850});
   var ha = new Animator('help',{steps: 5, targetLeft: 20});
   var ta = new Animator('trash',{steps: 5, targetLeft: 20});
   var pa = new Animator('palette',{steps: 5, targetLeft: 20});
   aa.start();
   ha.start();
   ta.start();
   pa.start();
}
function showAbout() {
   var aa = new Animator('about',{steps: 5, targetLeft: 150});
   var ha = new Animator('help',{steps: 5, targetLeft: -150});
   var ta = new Animator('trash',{steps: 5, targetLeft: -150});
   var pa = new Animator('palette',{steps: 5, targetLeft: -150});
   aa.start();
   ha.start();
   ta.start();
   pa.start();
}
function createPaletteItem(type) {
   var d = document.createElement('div');
   d.id = 'item_'+type;
   d.type = type;
   d.className = 'paletteItem '+type;
   d.innerHTML = type;
   return d;
}

var types = ['input','output','and','not','or','nand','nor'];

var gates = new Array();

var about;
var palette;
var trash;
var help;

function init() {
   about = document.getElementById('about');
   palette = document.getElementById('palette');
   trash = document.getElementById('trash');
   help = document.getElementById('help');
   trash.onDragOn = function(item) {
      if (!item.id.match("item_") && !item.id.match("line_")) {
         this.style.background = "#f99";
      }
   }
   trash.onDragOut = function(item) {
      this.style.background = "#fee";
   }
   trash.onDragEnd = function(item) {
      if (!item.id.match("item_") && !item.id.match("line_")) {
         item.parent.remove();
      }
   }
   DragTarget.makeTarget(trash,'i');
   
   var y = 10;
   for (var t in types) {
      var d = createPaletteItem(types[t]);
      d.style.top = y;
      y = y + 80;
      palette.appendChild(d);
      d.clone = true;
      d.onDragEnd = function(elt,event) {
         var pos = findPos(elt);
         if (pos[0] > 80) {
            var g = null;
            if (elt.type == "input") {
               g = new SourceGate('g'+gates.length);
            } else if (elt.type == "output") {
               g = new OutputGate('g'+gates.length);
            } else if (elt.type == "and") {
               g = new AndGate('g'+gates.length);
            } else if (elt.type == "not") {
               g = new NotGate('g'+gates.length);
            } else if (elt.type == "or") {
               g = new OrGate('g'+gates.length);
            } else if (elt.type == "nand") {
               g = new NandGate('g'+gates.length);
            } else if (elt.type == "nor") {
               g = new NorGate('s'+gates.length);
            } 
            if (g != null) {
               g.setPosition(pos[0],pos[1]+20);
               gates.push(g);
            }
         }
         return false;
      };
      DragTarget.makeDraggable(d);
      //d.mustEndOnTarget = false;
   }
}

function updateGates() {
   
}

function Gate() {
}

Gate.prototype.setPosition = function(x,y) {
   this.div.style.top = y;
   this.div.style.left = x;
}
Gate.prototype._createNode = function(id) {
   var d = document.createElement('div');
   d.id = id;
   d.parent = this;
   d.className = 'node';
   Anchor.makeAnchor(d);
   d.ondragstart = function(a) {
      //Debug.log(0,this.id);
      if (this.direction == 1) {
         return true;
      } else {
         if (this.lines && this.lines.length == 1) {
            var l = this.lines[0];
            Anchor.removeLine(l.A,l);
            Anchor.removeLine(l.B,l);
            l.remove();
            var src = l.A;
            if (l.A == this) {
               src = l.B;
            }
            this.state = false;
            this.parent.update();
            this.parent._propagate((new Date()).getTime());
            LineDrawer.elt = src;
            LineDrawer.mouse.direction = this.direction;
            LineDrawer.line = new Line2(src.id,'mouse');
            LineDrawer.active = true;
            return false;
         } else {
            return true;
         }
      }
   };
   
   d.onconnect = function(anchor,line) {
      if (anchor.direction == 1) {
         line.setColor('#666');
         anchor.parent._propagate((new Date()).getTime());
      }
   };
   
   d.canconnect = function(b) {
//      var thisroot = this.id.split("_")[0];
//      var thatroot = b.id.split("_")[0];
//      if (thisroot == thatroot) {
//         return false;
//      }
     // var thistype = this.id.split("_")[1].charAt(0);
     // var thattype = b.id.split("_")[1].charAt(0);
      //if (thistype == 'i' && this.lines && this.length.length > 0) {
      if (this.direction == 3 && this.lines && this.lines.length > 0) {
         return false;
      }
      return this.direction!=b.direction;
   };
   //d.onlineover = function() { d.style.background = '#faa'; };
   //d.onlineout = function() { d.style.background = '#efe'; };
   return d;
}

Gate.prototype.remove = function() {
   for (var i=0;i<this.div.out.length;i++) {
      if (this.div.out[i].lines) {
         for (var j=0;j<this.div.out[i].lines.length;j++) {
            var l = this.div.out[i].lines[j];
            var e = null;
            if (l.A == this.div.out[i]) {
               e = l.B;
            } else {
               e = l.A;
            }
            Anchor.removeLine(e,l);
            e.state = false;
            e.parent.update();
            e.parent._propagate();
            l.remove();
         }
      }
   }
   for (var i=0;i<this.div.inn.length;i++) {
      if (this.div.inn[i].lines) {
         for (var j=0;j<this.div.inn[i].lines.length;j++) {
            var l = this.div.inn[i].lines[j];
            var e = null;
            if (l.A == this.div.inn[i]) {
               e = l.B;
            } else {
               e = l.A;
            }
            Anchor.removeLine(e,l);
            l.remove();
         }
      }
   }
   this.div.parentNode.removeChild(this.div);
}

Gate.prototype.init = function(id,inputs,outputs) {
   this.div = document.createElement('div');
   this.div.className = 'gate';
   this.div.id = id;
   this.div.inn = new Array();
   this.div.out = new Array();
   this.div.parent = this;
   this.handle = document.createElement('div');
   this.handle.id = id+"_handle";
   this.handle.className = 'gateHandle';
   
   this.div.appendChild(this.handle);
   var space;
   var y;
   if (inputs > 0) {
      space = 50 / inputs;
      y = space/2;
      for (var i=0;i<inputs;i++) {
         this.div.inn.push(this._createNode(id+'_i'+i));
         this.div.inn[i].direction = 3;
         this.div.inn[i].style.left = -5;
         this.div.inn[i].style.top = y+i*space-6;
         this.div.appendChild(this.div.inn[i]);
         this.div.inn[i].state = false;
      }
   }
   if (outputs > 0) {
      space = 50 / outputs;
      y = space/2;
      for (var i=0;i<outputs;i++) {
         this.div.out.push(this._createNode(id+'_o'+i));
         this.div.out[i].direction = 1;
         this.div.out[i].style.left = 45;
         this.div.out[i].style.top = y+i*space-6;
         this.div.out[i].state = false;
         this.div.appendChild(this.div.out[i]);
      }
   }
   document.body.appendChild(this.div);
   DragTarget.makeDraggable(this.div,'i');
   this.div.mustEndOnTarget = false;
   //Dragger.setHandle(this.div,{x:5,y:5,w:40,h:40});
   Dragger.setHandle(this.div,this.handle);
   this.div.onDrag = function(elt, event) {
      for (var i=0;i<elt.inn.length;i++) {
         Anchor.updateLines(elt.inn[i]);
      }
      for (var i=0;i<elt.out.length;i++) {
         Anchor.updateLines(elt.out[i]);
      }
   };
   this.update();
   this._updateNodes();
}

Gate.prototype.update = function() {
}

Gate.prototype._updateNodes = function() {
   for (var i=0;i<this.div.inn.length;i++) {
      if (this.div.inn[i].state) {
         this.div.inn[i].className = "node on";
      } else {
         this.div.inn[i].className = "node off";
      }
   }
   for (var i=0;i<this.div.out.length;i++) {
      if (this.div.out[i].state) {
         this.div.out[i].className = "node on";
      } else {
         this.div.out[i].className = "node off";
      }
   }
}

Gate.prototype._propagate = function(time) {
   //Debug.log(0,this.div.id);
   this._updateNodes();
   for (var i=0;i<this.div.out.length;i++) {
      if (this.div.out[i].lines) {
         for (var j=0;j<this.div.out[i].lines.length;j++) {
            var l = this.div.out[i].lines[j];
            var otherend = l.getOtherEnd(this.div.out[i]);
            if (otherend.lastUpdate == time) {
               //this.div.out[i].className='node error';
               //otherend.className='node error';
               //l.setColor('#f00');
               return false;
            }
            otherend.lastUpdate = time;
            otherend.state = this.div.out[i].state;
         }
      }
   }
   for (var i=0;i<this.div.out.length;i++) {
      if (this.div.out[i].lines) {
         for (var j=0;j<this.div.out[i].lines.length;j++) {
            var l = this.div.out[i].lines[j];
            if (this.div.out[i].state) {
               l.setColor('#990');
            } else {
               l.setColor('#999');
            }
            var otherend = l.getOtherEnd(this.div.out[i]);
            otherend.parent.update();
            otherend.parent._propagate(time);
         }
      }
   }
   return true;
}
function AndGate(id) {
   this.init(id,2,1);
   this.div.className = 'gate and';
}
AndGate.prototype = new Gate();
AndGate.prototype.update = function() {
   this.div.out[0].state = this.div.inn[0].state && this.div.inn[1].state;
}

function NandGate(id) {
   this.init(id,2,1);
   this.div.className = 'gate nand';
}
NandGate.prototype = new Gate();
NandGate.prototype.update = function() {
   this.div.out[0].state = !(this.div.inn[0].state && this.div.inn[1].state);
}


function NorGate(id) {
   this.init(id,2,1);
   this.div.className = 'gate nor';
}
NorGate.prototype = new Gate();
NorGate.prototype.update = function() {
   this.div.out[0].state = !(this.div.inn[0].state || this.div.inn[1].state);
}

function OrGate(id) {
   this.init(id,2,1);
   this.div.className = 'gate or';
}
OrGate.prototype = new Gate();
OrGate.prototype.update = function() {
   this.div.out[0].state = this.div.inn[0].state || this.div.inn[1].state;
}

function NotGate(id) {
   this.init(id,1,1);
   this.div.className = 'gate not';
}
NotGate.prototype = new Gate();
NotGate.prototype.update = function() {
   this.div.out[0].state = !(this.div.inn[0].state);
}

function SourceGate(id) {
   this.init(id,0,1);
   this.div.className = 'gate inoff';
   this.control = document.createElement('div');
   this.control.id = id="_control";
   this.control.className = 'gateControl';
   this.control.style.left = 13;
   this.control.onclick = this.onclick;
   this.control.parent = this;
   this.div.appendChild(this.control);
}
SourceGate.prototype = new Gate();
SourceGate.prototype.onclick = function(event) {
   this.parent.div.out[0].state = !this.parent.div.out[0].state;
   if (this.parent.div.out[0].state) {
      this.parent.div.className = 'gate inon';
   } else {
      this.parent.div.className = 'gate inoff';
   }
   this.parent._propagate((new Date()).getTime());
   return false;
}

function OutputGate(id) {
   this.init(id,1,0);
   this.div.className = 'gate outoff';
}   
OutputGate.prototype = new Gate();
OutputGate.prototype.update = function() {
   this._updateNodes();
   if (this.div.inn[0].state) {
      this.div.className = 'gate outon';
   } else {
      this.div.className = 'gate outoff';
   }
}


