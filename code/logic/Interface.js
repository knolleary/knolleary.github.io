// %Z%%M% %I% %W% %G% %U%

//{{{ Anchor
var Anchor = {
  anchors: new Array(),
  makeAnchor: function (elt)
  {
     Anchor.anchors.push(elt);
     DragTarget.makeTarget(elt,"anchor");
     // TODO: use EventHandler
     elt.onmousedown = LineDrawer.onmousedown;
     elt.onDragOver = LineDrawer.onmouseovertarget;
     elt.onDragOut = LineDrawer.onmouseouttarget;
     elt.onDragEnd = LineDrawer.onmouseup;
  },
  removeAnchor: function(elt)
  {
     // TODO: replace with splice
     var newArray = []
     for (var i=0;i<Anchor.anchors.length;i++) {
        if (Anchor.anchors[i].id != elt.id)
        {
           newArray.push(Anchor.anchors[i]);
        }
     }
     Anchor.anchors = newArray;
     // TODO: use EventHandler
     elt.onmousedown = null;
     elt.onDraagOver = null;
     elt.onDragOut = null;
     elt.onDragEnd = null;
     DragTarget.removeTarget(elt);
  },
  addLine: function(elt,line) {
     if (!elt.lines) {
        elt.lines = new Array();
     }
     elt.lines.push(line);
  },
  removeLine: function(elt, line) {
     var newlines = new Array();
     for (var i=0;i<elt.lines.length;i++) {
        if (elt.lines[i]!=line) {
           newlines.push(elt.lines[i]);
        }
     }
     elt.lines = newlines;
  },
  updateLines: function(elt) {
     if (elt.lines) {
        for (var i=0;i<elt.lines.length;i++) {
           elt.lines[i].update();
        }
     }
  },
  canConnect: function(A,B) {
     var result = true;
     if (A.canconnect) {
        result = A.canconnect(B);
     }
     if (result && B.canconnect) {
        result = B.canconnect(A);
     }
     return result;
  }
}
//}}}

//{{{ LineDrawer
var LineDrawer = {
   elt: null,
   active: false,
   line: null,
   mouse: null,
   onmousedown: function(event) {
      if (!LineDrawer.active) {
         var elt = this;
         LineDrawer.elt = elt;
         if (!event) event = window.event;
         var mpos = findMouse(event);
         if (!LineDrawer.mouse) {
            LineDrawer.mouse = document.createElement('div');
            LineDrawer.mouse.id = 'mouse';
            LineDrawer.mouse.style.position = 'absolute';
            LineDrawer.mouse.style.width = 1;
            LineDrawer.mouse.style.height = 1;
            LineDrawer.mouse.direction = 2;
            LineDrawer.mouse.lineMargin = 10;
            document.body.appendChild(LineDrawer.mouse);
            LineDrawer.mouse.onDragStart = function(elt,event){LineDrawer.ondragstart(); return true;};
            LineDrawer.mouse.onDrag = function(elt,event){LineDrawer.onmousemove(event);};
            LineDrawer.mouse.onDragEnd = function(elt,event){LineDrawer.onmouseup(event); return true;};
            DragTarget.makeDraggable(LineDrawer.mouse,"a");
         }
         LineDrawer.mouse.style.left = mpos[0];
         LineDrawer.mouse.style.top = mpos[1];
         LineDrawer.mouse.onmousedown(event);
         document.body.style.cursor = 'crosshair';
      }
   },
   ondragstart: function() {
      var result = true;
      if (LineDrawer.elt.ondragstart) {
         result = LineDrawer.elt.ondragstart();
      }
      if (result) {
         LineDrawer.line = new Line2(LineDrawer.elt.id,'mouse');
         LineDrawer.active = true;
      }
   },
   onmousemove: function(event) {
      if (LineDrawer.active) {
         if (LineDrawer.line.B == LineDrawer.mouse) {
            var mpos = findMouse(event);
            var cpos = findCenter(LineDrawer.elt);
            LineDrawer.mouse.style.left = mpos[0];
            LineDrawer.mouse.style.top = mpos[1];
            if (Math.abs(mpos[0]-cpos[0]) > Math.abs(mpos[1]-cpos[1])) {
               if (mpos[0]>cpos[0]) {
                  LineDrawer.mouse.direction = 3;
               } else {
                  LineDrawer.mouse.direction = 1;
               }
            } else {
               if (mpos[1]>cpos[1]) {
                  LineDrawer.mouse.direction = 0;
               } else {
                  LineDrawer.mouse.direction = 2;
               }
            }
            LineDrawer.line.update();
         }
      }
   },

   onmouseup: function(elt) {
      if (LineDrawer.active) {
         LineDrawer.active = false;
         if (LineDrawer.line.B == LineDrawer.mouse) {
            LineDrawer.line.remove();
         } else {
            Anchor.addLine(LineDrawer.line.A,LineDrawer.line);
            Anchor.addLine(LineDrawer.line.B,LineDrawer.line);
            if (LineDrawer.line.A.onconnect) {
               LineDrawer.line.A.onconnect(LineDrawer.line.B, LineDrawer.line);
            }
            if (LineDrawer.line.B.onconnect) {
               LineDrawer.line.B.onconnect(LineDrawer.line.A, LineDrawer.line);
            }
         }
         LineDrawer.mouse.parentNode.removeChild(LineDrawer.mouse);
         LineDrawer.mouse = null;
         LineDrawer.line = null;
      }
      document.body.style.cursor = 'auto';
   },
   onmouseovertarget: function(elt) {
      if (LineDrawer.active && this!=LineDrawer.elt && Anchor.canConnect(LineDrawer.line.A, this)) {
         LineDrawer.line.B = this;
         LineDrawer.mouse.direction = this.direction;
         LineDrawer.line.update();
         if (this.onlineover) {
            this.onlineover();
         }
      }
   },
   onmouseouttarget: function(elt) {
      if (LineDrawer.active) {
         LineDrawer.line.B = LineDrawer.mouse;
         LineDrawer.line.update();
         if (this.onlineout) {
            this.onlineout();
         }
      }
   }
}
//}}}

//{{{ Line2
//{{{ constructor
function Line2(Aid,Bid) {
   this.id = "line_"+Aid+"_"+Bid;
   this.A = document.getElementById(Aid);
   this.B = document.getElementById(Bid);
   this.A.style.zIndex = 10;
   this.B.style.zIndex = 10;
   this.segments = new Array();
   
   this.segA = this._createSegment();
   this.segA.direction = this.A.direction;
   this.segB = this._createSegment();
   this.segB.direction = this.B.direction;
   
   this.segments.push(this._createSegment());
   this.segments[0].style.display = 'none';
   this.segments.push(this._createSegment());
   this.segments[1].style.display = 'none';
   this.segments.push(this._createSegment());
   this.segments[2].style.display = 'none';
   this.update();
   document.body.appendChild(this.segA);
   document.body.appendChild(this.segB);
   document.body.appendChild(this.segments[0]);
   document.body.appendChild(this.segments[1]);
   document.body.appendChild(this.segments[2]);
}
//}}}
//{{{ getOtherEnd
Line2.prototype.getOtherEnd = function(elt) {
   if (this.A == elt) {
      return this.B;
   } else if (this.B == elt) {
      return this.A;
   }
   return null;
}
//}}}
//{{{ remove
Line2.prototype.remove = function() {
   document.body.removeChild(this.segA);
   document.body.removeChild(this.segB);
   document.body.removeChild(this.segments[0]);
   document.body.removeChild(this.segments[1]);
   document.body.removeChild(this.segments[2]);
   this.segA = null;
   this.segB = null;
   this.segments = null;
}
//}}}
//{{{ update
Line2.prototype.update = function() {
   if (!this.A.lineMargin) {
      this.A.lineMargin = 10;
   }
   if (!this.B.lineMargin) {
      this.B.lineMargin = 10;
   }
   this.segA.direction = this.A.direction;
   this.segB.direction = this.B.direction;
   
//   Debug.clear();
//   Debug.log(0,this.segA.direction+":"+this.segB.direction);
   
   var Apos = findCenter(this.A);
   var Bpos = findCenter(this.B);
   var Aend = this._updateSegment(this.segA,Apos,this.A.lineMargin);
   var Bend = this._updateSegment(this.segB,Bpos,this.B.lineMargin);
   
   if (this.A.direction == this.B.direction) {
      this.segments[0].style.display = 'inline';
      this.segments[1].style.display = 'none';
      this.segments[2].style.display = 'none';
      var d = 0;
      if (this.A.direction == 0 || this.A.direction == 2) {
         d = 1;
         this.segments[0].direction = 1;
      } else {
         this.segments[0].direction = 2;
      }
      var ep1 = [];
      var ep2 = [];
      if (this.A.direction == 0 || this.A.direction == 3) {
         if (Aend[d] < Bend[d]) {
            ep1 = this._updateSegment(this.segB,Bpos,this.B.lineMargin+(Bend[d]-Aend[d]));
            ep2 = Aend;
         } else {
            ep1 = this._updateSegment(this.segA,Apos,this.A.lineMargin+(Aend[d]-Bend[d]));
            ep2 = Bend;
         }
      } else {
         if (Aend[d] < Bend[d]) {
            ep1 = this._updateSegment(this.segA,Apos,this.A.lineMargin+(Bend[d]-Aend[d]));
            ep2 = Bend;
         } else {
            ep1 = this._updateSegment(this.segB,Bpos,this.B.lineMargin+(Aend[d]-Bend[d]));
            ep2 = Aend;
         }
      }
      if (ep1[(d+1)%2] < ep2[(d+1)%2]) {
         this._updateSegment(this.segments[0],ep1,ep2[(d+1)%2]-ep1[(d+1)%2]+2);
      } else {
         this._updateSegment(this.segments[0],ep2,ep1[(d+1)%2]-ep2[(d+1)%2]+2);
      }
   } else if ((this.A.direction+2)%4 == this.B.direction) {
      var d = 0;
      if (this.A.direction == 0 || this.A.direction == 2) {
         d = 1;
      }
      if (this.A.direction == 1 || this.A.direction == 2) {
         if (Aend[d] <= Bend[d]) {
            Aend = this._updateSegment(this.segA,Apos,Math.round((Bpos[d]-Apos[d])/2));
            Bend = this._updateSegment(this.segB,Bpos,Math.round((Bpos[d]-Apos[d])/2));
            if (Aend[(d+1)%2] != Bend[(d+1)%2]) {
               this.segments[0].style.display = 'inline';
               this.segments[1].style.display = 'none';
               this.segments[2].style.display = 'none';
               this.segments[0].direction = (this.A.direction*2)%3;
               if (Aend[(d+1)%2] < Bend[(d+1)%2]) {
                  this._updateSegment(this.segments[0],Aend,Bend[(d+1)%2]-Aend[(d+1)%2]+2);
               } else {
                  this._updateSegment(this.segments[0],Bend,Aend[(d+1)%2]-Bend[(d+1)%2]+2);
               }
            } else {
               this.segments[0].style.display = 'none';
               this.segments[1].style.display = 'none';
               this.segments[2].style.display = 'none';
            }
         } else {
            this.segments[0].style.display = 'inline';
            this.segments[1].style.display = 'inline';
            this.segments[2].style.display = 'inline';
            this.segments[0].direction = (this.A.direction*2)%3;
            this.segments[1].direction = (this.segments[0].direction+2)%4;
            var mp1 = [];
            var mp2 = [];
            if (Aend[(d+1)%2] < Bend[(d+1)%2]) {
               mp1 = this._updateSegment(this.segments[0],Aend,(Bend[(d+1)%2]-Aend[(d+1)%2])/2);
               mp2 = this._updateSegment(this.segments[1],Bend,(Bend[(d+1)%2]-Aend[(d+1)%2])/2);
            } else {
               mp1 = this._updateSegment(this.segments[0],Bend,(Aend[(d+1)%2]-Bend[(d+1)%2])/2);
               mp2 = this._updateSegment(this.segments[1],Aend,(Aend[(d+1)%2]-Bend[(d+1)%2])/2);
            }
            this.segments[2].direction = this.A.direction;
            if (mp1[d] < mp2[d]) {
               this._updateSegment(this.segments[2],mp1,mp2[d]-mp1[d]);
            } else {
               this._updateSegment(this.segments[2],mp2,mp1[d]-mp2[d]);
            }
         }
      } else {
         if (Aend[d] >= Bend[d]) {
            Aend = this._updateSegment(this.segA,Apos,Math.round((Apos[d]-Bpos[d])/2));
            Bend = this._updateSegment(this.segB,Bpos,Math.round((Apos[d]-Bpos[d])/2));
            if (Aend[(d+1)%2] != Bend[(d+1)%2]) {
               this.segments[0].style.display = 'inline';
               this.segments[1].style.display = 'none';
               this.segments[2].style.display = 'none';
               this.segments[0].direction = ((this.A.direction*2)+1)%5
               if (Aend[(d+1)%2] < Bend[(d+1)%2]) {
                  this._updateSegment(this.segments[0],Aend,Bend[(d+1)%2]-Aend[(d+1)%2]+2);
               } else {
                  this._updateSegment(this.segments[0],Bend,Aend[(d+1)%2]-Bend[(d+1)%2]+2);
               }
            } else {
               this.segments[0].style.display = 'none';
               this.segments[1].style.display = 'none';
               this.segments[2].style.display = 'none';
            }
         } else {
            this.segments[0].style.display = 'inline';
            this.segments[1].style.display = 'inline';
            this.segments[2].style.display = 'inline';
            this.segments[0].direction = ((this.A.direction*2)+1)%5
            this.segments[1].direction = (this.segments[0].direction+2)%4;
            var mp1 = [];
            var mp2 = [];
            if (Aend[(d+1)%2] < Bend[(d+1)%2]) {
               mp1 = this._updateSegment(this.segments[0],Aend,(Bend[(d+1)%2]-Aend[(d+1)%2])/2);
               mp2 = this._updateSegment(this.segments[1],Bend,(Bend[(d+1)%2]-Aend[(d+1)%2])/2);
            } else {
               mp1 = this._updateSegment(this.segments[0],Bend,(Aend[(d+1)%2]-Bend[(d+1)%2])/2);
               mp2 = this._updateSegment(this.segments[1],Aend,(Aend[(d+1)%2]-Bend[(d+1)%2])/2);
            }
            this.segments[2].direction = this.B.direction;
            if (mp1[d] < mp2[d]) {
               this._updateSegment(this.segments[2],mp1,mp2[d]-mp1[d]);
            } else {
               this._updateSegment(this.segments[2],mp2,mp1[d]-mp2[d]);
            }
            
         }
      }
   } else if (Math.abs(this.A.direction-this.B.direction)%2 == 1) {
      var dA = 0;
      var dB = 1;
      if (this.A.direction == 0 || this.A.direction == 2) {
         dA = 1;
         dB = 0;
      }
      if ((((this.A.direction == 0||this.A.direction == 3) && Aend[dA]>Bend[dA]) || ((this.A.direction == 2 || this.A.direction == 1) && Aend[dA]<Bend[dA]))&& (((this.B.direction == 1 || this.B.direction == 2) && Aend[dB] > Bend[dB]) || ((this.B.direction == 3 || this.B.direction == 0) && Aend[dB] < Bend[dB]))) {
         this.segments[0].style.display = 'none';
         this.segments[1].style.display = 'none';
         this.segments[2].style.display = 'none';
         this._updateSegment(this.segA,Apos,Math.abs(Apos[dA]-Bpos[dA]));
         this._updateSegment(this.segB,Bpos,Math.abs(Apos[dB]-Bpos[dB]));
      } else if ((((this.A.direction == 0||this.A.direction == 3) && Aend[dA]<Bend[dA]) || ((this.A.direction == 2 || this.A.direction == 1) && Aend[dA]>Bend[dA]))&& (((this.B.direction == 1 || this.B.direction == 2) && Aend[dB] < Bend[dB]) || ((this.B.direction == 3 || this.B.direction == 0) && Aend[dB] > Bend[dB]))) {
         this.segments[0].style.display = 'inline';
         this.segments[1].style.display = 'inline';
         this.segments[2].style.display = 'none';
         if (this.A.direction == 0 || this.A.direction == 2) {
            if (Aend[dB] < Bend[dB]) {
               this.segments[0].direction = 1;
            } else {
               this.segments[0].direction = 3;
            }
         } else {
            if (Aend[dB] < Bend[dB]) {
               this.segments[0].direction = 2;
            } else {
               this.segments[0].direction = 0;
            }
         }
         this.segments[1].direction = this.A.direction;
         this._updateSegment(this.segments[0],Aend,Math.abs(Bend[dB]-Aend[dB]));
         this._updateSegment(this.segments[1],Bend,Math.abs(Aend[dA]-Bend[dA]));
      } else {
         this.segments[0].style.display = 'inline';
         this.segments[1].style.display = 'inline';
         this.segments[2].style.display = 'none';
         if (Aend[dB] > Bend[dB]) {
            if (this.A.direction == 0 || this.A.direction == 2) {
               this.segments[0].direction = 3;
            } else {
               this.segments[0].direction = 0;
            }
         } else {
            if (this.A.direction == 0 || this.A.direction == 2) {
               this.segments[0].direction = 1;
            } else {
               this.segments[0].direction = 2;
            }
         }
         if (this.A.direction == 0 || this.A.direction == 2) {
            if (Aend[dA]>Bend[dA]) {
               this.segments[1].direction = 0;
            } else {
               this.segments[1].direction = 2;
            }
         } else {
            if (Aend[dA]>Bend[dA]) {
               this.segments[1].direction = 3;
            } else {
            this.segments[1].direction = 1;
            }
         }
         var ep1 = this._updateSegment(this.segments[0],Aend,Math.abs(Bend[dB]-Aend[dB]));
         this._updateSegment(this.segments[1],ep1,Math.abs(ep1[dA]-Bend[dA]));
      }
   }
}
//}}}
//{{{ setColor
Line2.prototype.setColor = function(col) {
   this.segA.style.background = col;
   this.segB.style.background = col;
   this.segments[0].style.background = col;
   this.segments[1].style.background = col;
   this.segments[2].style.background = col;
}
//}}}
//{{{ _createSegment
Line2.prototype._createSegment = function() {
   var seg = document.createElement('div');
   seg.style.position = 'absolute';
   seg.style.background = '#333';
   seg.style.width = 2;
   seg.style.height = 2;
   seg.style.zIndex = -10;
   return seg;
}
//}}}
//{{{ _updateSegment
Line2.prototype._updateSegment = function(seg,pos,len) {
   var result = [];
   if (seg.direction == 0) { // UP
      seg.style.left = pos[0];
      seg.style.top = pos[1] - len;
      seg.style.width = 2;
      seg.style.height = len;
      /* seg.style.background = '#f00'; */
      //seg.style.borderLeft = "1px solid #fff";
      //seg.style.borderRight = "1px solid #fff";
      //seg.style.borderTop = "1px solid #000";
      //seg.style.borderBottom = "1px solid #000";
      result = [pos[0],pos[1]-len];
   } else if (seg.direction == 1) { // RIGHT
      seg.style.left = pos[0];
      seg.style.top = pos[1];
      seg.style.width = len;
      seg.style.height = 2;
      /* seg.style.background = '#f00'; */
      //seg.style.borderLeft = "1px solid #000";
      //seg.style.borderRight = "1px solid #000";
      //seg.style.borderTop = "1px solid #fff";
      //seg.style.borderBottom = "1px solid #fff";
      result = [pos[0]+len,pos[1]];
   } else if (seg.direction == 2) { // DOWN
      seg.style.left = pos[0];
      seg.style.top = pos[1];
      seg.style.width = 2;
      seg.style.height = len;
      /* seg.style.background = '#0f0'; */
      //seg.style.borderLeft = "1px solid #fff";
      //seg.style.borderRight = "1px solid #fff";
      //seg.style.borderTop = "1px solid #000";
      //seg.style.borderBottom = "1px solid #000";
      result = [pos[0],pos[1]+len];
   } else if (seg.direction == 3) { // LEFT
      seg.style.left = pos[0] - len;
      seg.style.top = pos[1];
      seg.style.width = len;
      seg.style.height = 2;
      /* seg.style.background = '#0f0'; */
      //seg.style.borderLeft = "1px solid #000";
      //seg.style.borderRight = "1px solid #000";
      //seg.style.borderTop = "1px solid #fff";
      //seg.style.borderBottom = "1px solid #fff";
      result = [pos[0]-len,pos[1]];
   }
   return result; // end point
}
//}}}
//}}} Line2

//{{{ Line
//{{{ constructor
function Line(Aid,Bid) {
   this.id = "line_"+Aid+"_"+Bid;
   this.A = document.getElementById(Aid);
   this.B = document.getElementById(Bid);
   this.A.style.zIndex = 10;
   this.B.style.zIndex = 10;
   this.dropRatio = 0.5;
   //this.c = document.createElement('div');
   
   this.p1 = document.createElement('div');
   this.p2 = document.createElement('div');
   this.p3 = document.createElement('div');
   //this.p1.innerHTML = '&nbsp;';
   //this.p2.innerHTML = '&nbsp;';
   //this.p3.innerHTML = '&nbsp;';
   
   this.p1.parent = this;
   this.p2.parent = this;
   this.p3.parent = this;
   this.p3.p1 = this.p1;
   this.p3.p2 = this.p2;
   
   this.p1.style.position = 'absolute';
   this.p1.style.background = '#333';
   this.p1.style.border = '1px solid #333';
   this.p1.style.overflow = 'hidden';
   
   this.p2.style.position = 'absolute';
   this.p2.style.background = '#333';
   this.p2.style.border = '1px solid #333';
   this.p2.style.overflow = 'hidden';

   this.p3.style.position = 'absolute';
   this.p3.style.background = '#333';
   this.p3.style.border = '1px solid #333';
   this.p3.style.cursor = 'move';
   this.p3.style.overflow = 'hidden';
   
   this.p3.onmouseover = function(evt){ 
      this.parent.p3.style.background = '#999';
      this.parent.p1.style.background = '#666';
      this.parent.p2.style.background = '#666';
   }
   this.p3.onmouseout = function(evt){ 
      this.parent.p3.style.background = '#333'; 
      this.parent.p1.style.background = '#333';
      this.parent.p2.style.background = '#333';
   }

   this.p1.style.height = 2;
   this.p2.style.height = 2;
   this.p3.style.width = 2;


   document.body.appendChild(this.p1);
   document.body.appendChild(this.p2);
   document.body.appendChild(this.p3);
//   this.c.appendChild(this.p1);
//   this.c.appendChild(this.p2);
//   this.c.appendChild(this.p3);
   
//   document.body.appendChild(this.c);
//  this.c.style.display = 'inline';
//  this.c.style.position = 'absolute';
//  this.c.style.zIndex = 1;
//   this.c.style.border = '1px dashed #00f';
   Dragger.makeDraggable(this.p3);
   this.p3.onDragStart = function(elt,event) {
      var Apos = findCenter(this.parent.A);
      var Bpos = findCenter(this.parent.B);
      var minX = Math.min(Apos[0],Bpos[0]);
      var minY = Math.min(Apos[1],Bpos[1]);
      elt.limits = {x1:minX+10,y1:minY,x2:minX+Math.abs(Apos[0]-Bpos[0])-10,y2:minY};
      return true;
   }
   this.p3.onDrag = function(elt) {
      var Apos = findCenter(this.parent.A);
      var Bpos = findCenter(this.parent.B);
      if (Apos[0] < Bpos[0]) {
         elt.parent.dropRatio = (elt.offsetLeft-Apos[0])/(Bpos[0]-Apos[0]);
      } else {
         elt.parent.dropRatio = 1-((elt.offsetLeft-Bpos[0])/(Apos[0]-Bpos[0]));
      }
      elt.parent.update_position();
   }
   this.update_position();
}
   //}}}
   //{{{ update_position
Line.prototype.update_position = function() {
   var Apos = findCenter(this.A);
   var Bpos = findCenter(this.B);
   var ltX = Math.min(Apos[0],Bpos[0]);
   var ltY = Math.min(Apos[1],Bpos[1]);
   var w = Math.abs(Bpos[0] - Apos[0]);
   var h = Math.abs(Bpos[1] - Apos[1]);
   //this.c.style.left = Math.min(Apos[0],Bpos[0]);
   //this.c.style.top = Math.min(Apos[1],Bpos[1]);
   //this.c.style.width = Math.abs(Bpos[0] - Apos[0]);
   //this.c.style.height = Math.abs(Bpos[1] - Apos[1]);
   var dropL;
   var dropR;
   if (Apos[0] < Bpos[0]) {
      dropL = w*this.dropRatio;
      dropR = w - dropL;
   } else {
      dropR = w*this.dropRatio;
      dropL = w - dropR;
   }
   if ( (Apos[0] < Bpos[0] && Apos[1] < Bpos[1])) {
      this.p1.style.left = ltX;
      this.p1.style.top = ltY;
      this.p1.style.width = dropL;
      this.p2.style.left = ltX+dropL;
      this.p2.style.top = ltY+h-2;
      this.p2.style.width = dropR;
   } else if ( (Apos[0] < Bpos[0] && Apos[1] > Bpos[1])) {
      this.p1.style.left = ltX;
      this.p1.style.top = ltY+h-2;
      this.p1.style.width = dropL;
      this.p2.style.left = ltX+dropL;
      this.p2.style.top = ltY;
      this.p2.style.width = dropR;
   } else if ( (Apos[0] > Bpos[0] && Apos[1] < Bpos[1])) {
      this.p1.style.left = ltX+dropL;
      this.p1.style.top = ltY;
      this.p1.style.width = dropR;
      this.p2.style.left = ltX;
      this.p2.style.top = ltY+h-2;
      this.p2.style.width = dropL;
   } else if ( (Apos[0] > Bpos[0] && Apos[1] > Bpos[1])) {
      this.p1.style.left = ltX+dropL;
      this.p1.style.top = ltY+h-2;
      this.p1.style.width = dropR;
      this.p2.style.left = ltX;
      this.p2.style.top = ltY;
      this.p2.style.width = dropL;
   }
   this.p3.style.left = ltX+dropL;
   this.p3.style.top = ltY;
   this.p3.style.height = h;
}
   //}}}
   //{{{ remove
Line.prototype.remove = function() {
   this.p1.parentNode.removeChild(this.p1);
   this.p2.parentNode.removeChild(this.p2);
   this.p3.parentNode.removeChild(this.p3);
}
   //}}}
   //{{{ split
Line.prototype.split = function(obj_id) {
   var newLine = new Line(obj_id,this.B.id);
   this.B = document.getElementById(obj_id);
   this.dropRatio = 0.5;
   this.update_position();
   return newLine;
}
   //}}}
   //{{{ toString
Line.prototype.toString = function() {
   return "Line: "+this.A.id+" - "+this.B.id;
}
   //}}}
//}}}

