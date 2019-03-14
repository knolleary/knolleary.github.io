//{{{ EventHandler
var EventHandler = {
   // obj   : the object to register the event to
   // event : the event to register on - 'onmousemove'
   // name  : identifier for this event (so it can be removed)
   // f     : function to call
   addEvent: function(obj,event,name,f) {
      if (!obj[event+'_stack']) {
         obj[event+'_stack'] = [];
         obj[event] = function(e) {
            for(var evt in this[event+'_stack']) {
               var rc = this[event+'_stack'][evt].call(this,e);
               if (rc != null && !rc) return false;
            }
         }
      }
      obj[event+'_stack'][name] = f;
   },
   // obj   : the object to deregister the event from
   // event : the event to deregister - 'onmousemove'
   // name  : the identifier of the function to remove
   removeEvent: function(obj,event,name) {
      delete obj[event+'_stack'][name];
   }
}
//}}}

//{{{ Coordinates
   //{{{ findPos
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return [curleft,curtop];
} 
   //}}}
   //{{{ findCenter
function findCenter(obj) {
   var origin = findPos(obj);
   return [origin[0]+(obj.offsetWidth/2),origin[1]+(obj.offsetHeight/2)];
}
   //}}}
   //{{{ findPosRelativeTo
function findPosRelativeTo(obj, reference) {
   var opos = findPos(obj);
   var rpos = findPos(reference);
   return [opos[0]-rpos[0],opos[1]-rpos[1]];
}
   //}}}
   //{{{ findMouse
function findMouse(evt) {
	var posx = 0;
	var posy = 0;
	if (!evt) var evt = window.event;
	if (evt.pageX || evt.pageY) 	{
		posx = evt.pageX;
		posy = evt.pageY;
	}
	else if (evt.clientX || evt.clientY) 	{
		posx = evt.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = evt.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
   return [posx,posy];
}
   //}}}
//}}}

//{{{ Dragger
/*
Available callbacks for elements
 - element.onDragStart(elt,event) - drag started - return false to cancel
 - element.onDragEnd(elt,event) - drag ended - return false to cancel
 - element.onDrag(elt,event) - element dragged
API calls
 - Dragger.setClone(element,boolean) - should the element be cloned when dragged
*/
var Dragger = {
	dragElt: null,
   dragEltClone: null,
   //{{{ makeDraggable
	makeDraggable: function (elt) {
      EventHandler.addEvent(elt,'onmousedown','Dragger',Dragger.onMouseDown);
      elt.originalLeft = elt.offsetLeft;
      elt.originalTop = elt.offsetTop;
      elt.originalWidth = elt.offsetWidth;
      elt.originalHeight = elt.offsetHeight;
      elt.oldPosition = elt.style.position;
      if (elt.style.position!='absolute') {
         elt.style.position = "absolute";
         elt.style.left = elt.originalLeft;
         elt.style.top = elt.originalTop;
         elt.style.width = elt.originalWidth;
         elt.style.height = elt.originalHeight;
      }
      elt.constraint = Dragger.NONE;
      if (!elt.triggerX) { elt.triggerX = 5; }
      if (!elt.triggerY) { elt.triggerY = 5; }
      elt.raise = true;
	},
   //}}}
   //{{{ makeUndraggable
   makeUndraggable: function (elt) {
      EventHandler.removeEvent(elt,'onmousedown','Dragger');
   },
   //}}}
   //{{{ setLimits
   setLimits: function (elt,limits) {
      elt.limits = limits;
   },
   //}}}
   //{{{ setHandle
   setHandle: function (elt,handle) {
      if (!handle.x) {
         elt.draggerHandle = handle;
      } else {
         elt.draggerHandleBounds = handle;
      }
   },
   //}}}
   //{{{ setClone
   setClone: function (elt,clone) {
      elt.clone = clone;
   },
   //}}}
   //{{{ setRaise
   setRaise: function (elt,raise) {
      elt.raise = raise;
   },
   //}}}
   //{{{ onMouseDown
	onMouseDown: function (event) {
      if (!event) event = window.event;
		var elt = this;
      var tpos = findPos(elt);
      var mpos = findMouse(event);
      var cx = mpos[0] - tpos[0];
      var cy = mpos[1] - tpos[1];
      if (elt.draggerHandleBounds && (elt.draggerHandleBounds.x > cx || elt.draggerHandleBounds.x+elt.draggerHandleBounds.w < cx || elt.draggerHandleBounds.y > cy || elt.draggerHandleBounds.y+elt.draggerHandleBounds.h < cy)) {
         return true;
      }
      if (elt.draggerHandle && (elt.draggerHandle.offsetLeft > cx || elt.draggerHandle.offsetLeft+elt.draggerHandle.offsetWidth < cx || elt.draggerHandle.offsetTop > cy || elt.draggerHandle.offsetTop+elt.draggerHandle.offsetHeight < cy)) {
         return true;
      }
      Dragger.dragElt = elt;
      Dragger.dragElt.originalLeft = Dragger.dragElt.offsetLeft;
      Dragger.dragElt.originalTop = Dragger.dragElt.offsetTop;
      Dragger.dragElt.originalAbsolutePos = findPos(elt);
      if (elt.clone) {
         Dragger.dragElt.mouseNWOffsetX = mpos[0] - Dragger.dragElt.originalAbsolutePos[0];
         Dragger.dragElt.mouseNWOffsetY = mpos[1] - Dragger.dragElt.originalAbsolutePos[1];
      } else {
         Dragger.dragElt.mouseNWOffsetX = mpos[0] - Dragger.dragElt.originalLeft;
         Dragger.dragElt.mouseNWOffsetY = mpos[1] - Dragger.dragElt.originalTop;
      }         
      Dragger.dragStarted = false;
      EventHandler.addEvent(document,'onmousemove','Dragger',Dragger.onMouseMove);
      EventHandler.addEvent(document,'onmouseup','Dragger',Dragger.onMouseUp);
      return false;
   },
   //}}}
   //{{{ startDrag
   startDrag: function (event) {
      var elt = Dragger.dragElt;
      if (elt.onDragStart) {
			if (! elt.onDragStart (elt, event))
				return false;
		}
      elt.dragStarted = true;
      if (elt.clone) {
         Dragger.dragEltClone = elt.cloneNode(true);
         elt.parentNode.insertBefore(Dragger.dragEltClone,elt);
         elt.originalParent = elt.parentNode;
         var realPos = findPos(elt);
         elt.parentNode.removeChild(elt);
         elt.style.top = realPos[1];
         elt.style.left = realPos[0];
         document.body.appendChild(elt);
         elt.style.top = realPos[1];
         elt.style.left = realPos[0];
      }
      if (Dragger.dragElt.raise) {
         Dragger.dragElt.originalZIndex = elt.style ["zIndex"];
         Dragger.dragElt.style ["zIndex"] = 1000;
         Dragger.dragElt.originalOpacity = elt.style ["opacity"];
         Dragger.dragElt.style ["opacity"] = 0.75;
      }
      return true;
   },
   //}}}
   //{{{ onMouseMove
	onMouseMove: function (event) {
      if (!event) event = window.event;
		var elt = null;
      elt = Dragger.dragElt;
      var mpos = findMouse(event);
      var newLeft = (mpos[0] - elt.mouseNWOffsetX);         
      var newTop  = (mpos[1] - elt.mouseNWOffsetY); // TODO: possible bug:  Should sums be here given constraints logic below
      if (elt.constraint == Dragger.HORIZONTAL || elt.constraint == Dragger.NONE) {
         newLeft = (mpos[0] - elt.mouseNWOffsetX);
      }
      if (elt.constraint == Dragger.VERTICAL || elt.constraint == Dragger.NONE) {
         newTop = (mpos[1] - elt.mouseNWOffsetY);
      }
      if (elt.limits) {
         
         if (newTop<elt.limits.y1) {
            newTop = elt.limits.y1;
         }
         if (newTop>elt.limits.y2) {
            newTop = elt.limits.y2;
         }
         if (newLeft<elt.limits.x1) {
            newLeft = elt.limits.x1;
         }
         if (newLeft>elt.limits.x2) {
            newLeft = elt.limits.x2;
         }
      }
      var deltaX;
      var deltaY;
      if (elt.clone) {
         deltaX = elt.originalAbsolutePos[0] - newLeft;
         deltaY = elt.originalAbsolutePos[1] - newTop;
      } else {
         deltaX = elt.originalLeft - newLeft;
         deltaY = elt.originalTop - newTop;
      }
      if (!elt.dragStarted) {
         if (Math.abs(elt.deltaX) < elt.triggerX && Math.abs(elt.deltaY) < elt.triggerY) {
            return;
         }
         if (!Dragger.startDrag(event)) {
            return;
         }
      }

      if (elt.constraint == Dragger.HORIZONTAL || elt.constraint == Dragger.NONE) {
         elt.style.left = newLeft;
         elt.draggerDX = newLeft - elt.draggerOX;
         elt.draggerOX = newLeft;
      }
      if (elt.constraint == Dragger.VERTICAL || elt.constraint == Dragger.NONE) {
         elt.style.top = newTop;
         elt.draggerDY = newTop - elt.draggerOY;
         elt.draggerOY = newTop;
      }
      if (elt.onInternalDrag)
         elt.onInternalDrag(elt,event);
      if (elt.onDrag)
         elt.onDrag (elt, event);
		return true;
	},
   //}}}
   //{{{ onMouseUp
	onMouseUp: function (event) {
      if (!event) event = window.event;
      if (!Dragger.dragElt)
      {
         return;
      }
		var elt = Dragger.dragElt;
		var eltClone = Dragger.dragEltClone;
      EventHandler.removeEvent(document,'onmousemove','Dragger');
      EventHandler.removeEvent(document,'onmouseup','Dragger');

      if (!elt.dragStarted) {
         return;
      }
      elt.dragStarted = false;
      if (elt.raise) {
         elt.style ["opacity"] = elt.originalOpacity;
         elt.style ["zIndex"] = elt.originalZIndex;
      }
//      elt.style.position = elt.oldPosition;
   var npos;
   var opos;
      if (elt.clone) {
         var apos = [Dragger.dragElt.offsetLeft,Dragger.dragElt.offsetTop];
         opos = findPos(Dragger.dragElt);
         npos = findPos(Dragger.dragElt.originalParent);
         var cpos = findPos(Dragger.dragEltClone);
         if (Dragger.dragElt.parentNode != Dragger.dragElt.originalParent) {
            apos[0] = opos[0]-npos[0];
            apos[1] = opos[1]-npos[1];
         }
         Dragger.dragElt.parentNode.removeChild(Dragger.dragElt);
         Dragger.dragElt.originalParent.insertBefore(Dragger.dragElt,Dragger.dragEltClone);
         Dragger.dragEltClone.parentNode.removeChild(Dragger.dragEltClone);
         Dragger.dragElt.style.left = apos[0];
         Dragger.dragElt.style.top = apos[1];
      }

      
      var returncode;
      if (elt.onInternalDragEnd) returncode = elt.onInternalDragEnd(elt, event);
      if (returncode == null) {
         if (elt.onDragEnd) returncode = elt.onDragEnd(elt, event);
      } else {
         if (elt.onDragEnd) elt.onDragEnd(elt, event);
      }
      if (returncode!=null && !returncode) {
         // {{{ CANCEL THE DRAG
         var animator;
         if (elt.clone) {
            eltClone.id = Dragger.dragElt.id+"_clone";
            eltClone.style.left = opos[0];
            eltClone.style.top = opos[1];
            document.body.appendChild(eltClone);
            eltClone.style.zIndex = 2000;
            Dragger.dragElt.style.top = elt.originalTop;
            Dragger.dragElt.style.left = elt.originalLeft;
            animator = new Animator(eltClone.id,{delay: 25, steps: 5, targetTop: elt.originalTop+npos[1]+1, targetLeft: elt.originalLeft+npos[0]+1,completeCallback:"Dragger.completeCloneCallback"});
            //}
         } else {
            animator = new Animator(elt.id,{delay: 25, steps: 5, targetTop: elt.originalTop, targetLeft: elt.originalLeft});
         }
         Dragger.dragElt = null;
         Dragger.dragEltClone = null;
         animator.start();
         return false;
         //}}}
      }
      Dragger.dragElt = null;
      Dragger.dragEltClone = null;
      return true;
	},
   completeCloneCallback: function(elt_id) {
      var elt = document.getElementById(elt_id);
      elt.parentNode.removeChild(elt);
   },
   //}}}
   //{{{ setCancelDragOnExitWindow
   setCancelDragOnExitWindow: function (state) {
      if (state) {
         window.onmouseout = function(e) {
            var relTarg;
            if (!e) var e = window.event;
            // Checks the 'target' of the event; this is defined as the element
            // that the mouse has move to. IE/Moz have their own ways of doing
            // this.
            if (Dragger.dragElt && !e.relatedTarget && !e.toElement) {
               Dragger.onMouseUp(e);
            }
         }
      } else {
         window.onmouseout = null;
      }
   },
   //}}}
   //{{{ setConstraint
   setConstraint: function (elt,constraint) {
      elt.constraint = constraint;
   },
   //}}}
   //{{{ CONSTANTS
   NONE: 0,
   HORIZONTAL: 1,
   VERTICAL: 2
   //}}}
} //}}}

//{{{ DragTarget
/*
Available callbacks for targets:
 - target.onDragOver(item) - entered
 - target.onDragOut(item) - exited
 - target.onDragOn(item) - over (weird naming I know)
 - target.onDragEnd(item) - return 1 if the drag should complete, 0 otherwise

Magic properties;
 - mustEndOnTarget true/false - whether the drag must end on a target
*/
var DragTarget = {
   // An array of the registered targets on the page
   targets: new Array(),
   //{{{ makeDraggable
   // Called to make an element draggable
   makeDraggable: function (elt,type)
   {
      Dragger.makeDraggable(elt);
      elt.onInternalDrag = function (item,event) { return DragTarget.onDrag(item,event); }
      elt.onInternalDragEnd = function (item,event) { return DragTarget.onDragEnd(item,event); }
      elt.dragTargetType = type;
      elt.mustEndOnTarget = true;
   },
   //}}}
   //{{{ makeTarget
   // Registers an element as a target
   makeTarget: function (elt,type)
   {
      DragTarget.targets.push(elt);
      elt.dragTargetType = new RegExp(type);
   },
   //}}}
   //{{{ removeTarget
   // Deregisters an element as a target
   removeTarget: function (elt)
   {
      var length = DragTarget.targets.length;
      var newArray = [];
      for (var i=0;i<length;i++)
      {
         if (DragTarget.targets[i].id != elt.id)
         {
            newArray.push(DragTarget.targets[i]);
         }
      }
      DragTarget.targets = newArray;
   },
   //}}}
   //{{{ onDragEnd
   // Call-back for when a drag ends
   onDragEnd: function (item,e)
   {
      var returncode = !item.mustEndOnTarget;
      // Check which targets are active, and call their call-backs
      var hits = 0;
      for (var i=0;i<DragTarget.targets.length;i++)
      {
         if (DragTarget.targets[i].isMouseOver)
         {
            hits++;
            if (DragTarget.targets[i].onDragEnd) {
               // This will cause interesting behaviour if multiple targets are
               // hit
               returncode = DragTarget.targets[i].onDragEnd(item);
            }
            DragTarget.onDragOut(DragTarget.targets[i],item,e);
         }
      }
      if (hits == 0 && item.mustEndOnTarget) {
         return false;
      }
      return returncode;
   },
   //}}}
   //{{{ onDragOver
   // Call-back for when an element is dragged over a target
   onDragOver: function (target,item,e)
   {
      if (!target.isMouseOver && target.onDragOver) {
         target.onDragOver(item);
      } else if (target.onDragOn) {
         target.onDragOn(item);
      }
      target.isMouseOver = true;
   },
   //}}}
   //{{{ onDragOut
   // Call-back for when an element is dragged out of a target
   onDragOut: function (target,item,e)
   {
      if (target.isMouseOver && target.onDragOut) {
         target.onDragOut(item);
      }
      target.isMouseOver = false;
   },
   //}}}
   //{{{ onDrag
   // Call-back for when an element is dragged
   onDrag: function (item,e)
   {
      var mpos = findMouse(e);
      for (var i=0;i<DragTarget.targets.length;i++)
      {
         // TODO: this isn't working...
         //if (!item.dragTargetType.match(DragTarget.targets[i].dragTargetType)) {
         //   continue;
         //}
         var origin = findPos(DragTarget.targets[i]);
         if (origin[1] < mpos[1] &&
             origin[0] < mpos[0] &&
             origin[1] + DragTarget.targets[i].offsetHeight > mpos[1] &&
             origin[0] + DragTarget.targets[i].offsetWidth > mpos[0])
         {
            DragTarget.onDragOver(DragTarget.targets[i],item,e);
         } else {
            DragTarget.onDragOut(DragTarget.targets[i],item,e);
         }
      }
      
   }
   //}}}
} //}}}

//{{{ Resizer
var Resizer = {
   elt: null,
   makeResizable: function(elt) {
      elt.originalLeft = elt.offsetLeft;
      elt.originalTop = elt.offsetTop;
      elt.originalWidth = elt.offsetWidth;
      elt.originalHeight = elt.offsetHeight;
      elt.oldPosition = elt.style.position;
      elt.originalParent = elt.parentNode;
      
      elt.style.left = '0px';
      elt.style.top = '0px';
      //elt.style.zIndex = 1;
      
      elt.div = document.createElement("div");
      elt.div.id = elt.id+"_div";
      elt.div.style.position = 'absolute';
      elt.div.style.top = elt.originalTop;
      elt.div.style.left = elt.originalLeft;
      elt.div.style.width = elt.originalWidth;
      elt.div.style.height = elt.originalHeight;
      elt.div.style.background = '#f00';
      elt.div.object = elt;
      elt.parentNode.removeChild(elt);
      elt.style.width = elt.originalWidth;
      elt.style.height = elt.originalHeight;
      elt.div.appendChild(elt);
      elt.originalParent.appendChild(elt.div);
      
      //elt.div.onDragStart = function(elt,event) {
      //   if (!event) var event = window.event;
      //   var tg = (window.event) ? event.srcElement : event.target;
      //   Debug.log(0,tg.pos);
      //   if (tg.pos==null) { return true; }
      //   Debug.log(0,tg.pos+"-- cancel");
      //   return false;
      //}
      //elt.div.triggerX = 1;
      //elt.div.triggerY = 1;
      //Dragger.makeDraggable(elt.div);
      //elt.style.display = 'none';
      
      var control = document.createElement("div");
      control.style.position = 'absolute';
      control.style.border = "2px dashed #000";
      control.style.width = elt.originalWidth-4;
      control.style.height = elt.originalHeight-4;
      //control.style.zIndex = 10;
      control.parent = elt.div
      
      control.ne = Resizer._makeControlPoint(control,Resizer.NE,elt);
      control.nw = Resizer._makeControlPoint(control,Resizer.NW,elt);
      control.se = Resizer._makeControlPoint(control,Resizer.SE,elt);
      control.sw = Resizer._makeControlPoint(control,Resizer.SW,elt);
      
      elt.div.control = control;
      
      EventHandler.addEvent(elt.div,'onmousedown','Resizer',Resizer.onMouseDown);
      EventHandler.addEvent(window,'onmouseup','Resizer',Resizer.onMouseUp);
      EventHandler.addEvent(elt.div,'onmouseover','Resizer',Resizer.onMouseOver);
      EventHandler.addEvent(elt.div,'onmouseout','Resizer',Resizer.onMouseOut);
      
      elt.constrain_resize = true;
      if (elt.constrain_resize) {
         elt.width_to_height = elt.offsetHeight/elt.offsetWidth;
      }
   },
   onMouseDown: function(event) {
      if (!event) var event = window.event;
      var tg = (window.event) ? event.srcElement : event.target;
      if (tg.pos!=null) { return; }
      this.mpos = findMouse(event);
      Resizer.dragElt = this;
      this.style.opacity = 0.75;
      EventHandler.addEvent(document,"onmousemove","Resizer",function(e) {
            var elt = Resizer.dragElt;
            var nmpos = findMouse(e);
            elt.style.left = elt.offsetLeft+nmpos[0]-elt.mpos[0]+1;
            elt.style.top = elt.offsetTop+nmpos[1]-elt.mpos[1]+1;
            elt.mpos = nmpos;
      });
      EventHandler.addEvent(document,"onmouseup","Resizer",function(e) {
            EventHandler.removeEvent(document,"onmouseup","Resizer");
            EventHandler.removeEvent(document,"onmousemove","Resizer");
            Resizer.dragElt.style.opacity = 1;
            Resizer.dragElt = null;
      });
   },
   onMouseUp:   function(event) {
   },
   onMouseOver: function(event) {
      if (Resizer.dragElt!=null || Resizer.elt!=null){return}
      this.appendChild(this.control);
      //this.control.style.zIndex = 100;
   },
   onMouseOut:  function(e) {
      if (Resizer.dragElt!=null || Resizer.elt!=null){return}
      // ------------ taken from QuirksMode.
      if (!e) var e = window.event;
      var tg = (window.event) ? e.srcElement : e.target;
      if (tg.nodeName != 'DIV') return;
      var reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement;
      while (reltg != tg && reltg.nodeName != 'BODY')
         reltg= reltg.parentNode
      if (reltg== tg) return;
      // ------------ taken from QuirksMode.
      this.removeChild(this.control);
   },
   _alignControlPoints: function(elt) {
      Resizer._alignControlPoint(elt.object,elt.control.ne,Resizer.NE);
      Resizer._alignControlPoint(elt.object,elt.control.nw,Resizer.NW);
      Resizer._alignControlPoint(elt.object,elt.control.se,Resizer.SE);
      Resizer._alignControlPoint(elt.object,elt.control.sw,Resizer.SW);
   },
   _alignControlPoint: function(elt,p,pos) {
      if ((pos&Resizer.N) == Resizer.N) {
         p.style.top = -4;
      }
      if ((pos&Resizer.S) == Resizer.S) {
         p.style.top = elt.div.offsetHeight - 11;
      }
      if ((pos&Resizer.W) == Resizer.W) {
         p.style.left = -4;
      } 
      if ((pos&Resizer.E) == Resizer.E) {
         p.style.left = elt.div.offsetWidth - 11;
      }

   },
   _makeControlPoint: function(parent, pos, object) {
      var p = document.createElement("div");
      p.id = object.id+"_control_"+pos;
      p.style.border = "1px solid #000";
      p.style.background = '#fff';
      p.style.position = 'absolute';
      p.style.width = 10; p.style.height = 10; //p.style.zIndex = 10;
      Resizer._alignControlPoint(object,p,pos);
      p.pos = pos;
      p.parent = parent; // control control.parent=div
      p.object = object; // Image
      parent.appendChild(p);
      p.triggerX = 1; p.triggerY = 1;
      
      EventHandler.addEvent(p,"onmousedown","Resizer",function(e) {
         Resizer.elt = this;
         this.mpos = findMouse(e);
         EventHandler.removeEvent(Resizer.elt.parent.parent,'onmouseout','Resizer');

         EventHandler.addEvent(document,"onmousemove","Resizer",function(e) {
            var elt = Resizer.elt;
            var parent = Resizer.elt.parent.parent;
            var nmpos = findMouse(e);
            var dm = [nmpos[0]-elt.mpos[0],nmpos[1]-elt.mpos[1]];
            elt.mpos = nmpos;
            if ((elt.pos&Resizer.N) == Resizer.N) {
               if (parent.offsetHeight-dm[1] > 20) {
                  parent.style.top = parent.offsetTop+1+dm[1];
                  parent.style.height = parent.offsetHeight-dm[1];
                  parent.object.style.height = parent.object.offsetHeight-dm[1];
                  parent.control.style.height = parent.offsetHeight-4;
               }
            }
            if ((elt.pos&Resizer.S) == Resizer.S) {
               if (parent.offsetHeight+dm[1] > 20) {
                  parent.style.height = parent.offsetHeight+dm[1];
                  parent.object.style.height = parent.object.offsetHeight+dm[1];
                  parent.control.style.height = parent.offsetHeight-4;
               }
            }
            if ((elt.pos&Resizer.W) == Resizer.W) {
               if (parent.offsetWidth-dm[0] > 20) {
                  parent.style.left = parent.offsetLeft+1+dm[0];
                  parent.style.width = parent.offsetWidth-dm[0];
                  parent.object.style.width = parent.object.offsetWidth-dm[0];
                  parent.control.style.width = parent.offsetWidth-4;
               }
            }
            if ((elt.pos&Resizer.E) == Resizer.E) {
               if (parent.object.offsetWidth+dm[0] > 20) {
                  parent.style.width = parent.offsetWidth+dm[0];
                  parent.object.style.width = parent.object.offsetWidth+dm[0];
                  parent.control.style.width = parent.offsetWidth-4;
               }
            }
            Resizer._alignControlPoints(parent);

         });
         EventHandler.addEvent(document,"onmouseup","Resizer",function(e) {
            EventHandler.removeEvent(document,"onmouseup","Resizer");
            EventHandler.removeEvent(document,"onmousemove","Resizer");
            EventHandler.addEvent(Resizer.elt.parent.parent,'onmouseout','Resizer',Resizer.onMouseOut);
            Resizer.elt = null;
         });
         
      });
      return p;
   },
   
   N:  1,
   NE: 3,
   E:  2,
   SE: 6,
   S:  4,
   SW: 12,
   W:  8,
   NW: 9
}
//}}}

//{{{ DraggableView
var DraggableView = {
// Some constants to alter the size of things
   box_width: 75,
   box_height: 75,
   grid_width: 2,
   grid_height: 2,
   previous_offset_x: null,
   previous_offset_y: null,
   innercontainer: null,
   
   init: function (outercontainer_id) 
   {
      Dragger.setCancelDragOnExitWindow(true);
      var container = document.getElementById(outercontainer_id);
      //container.style.width = DraggableView.box_width*DraggableView.grid_width;
      //container.style.height = DraggableView.box_height*DraggableView.grid_height;
      // Create the innercontainer
      innercontainer = document.createElement('div');
      innercontainer.id = 'DraggableView.innercontainer';
      // Make it draggable
      Dragger.makeDraggable(innercontainer);
      // Register the customer ondrag event
      innercontainer.onDrag = function (innercontainer,event) { DraggableView.dragbox(innercontainer,event); }
      // Build the initial grid of boxes
      for (var i=0;i<=DraggableView.grid_height;i++)
      {
         for (var j=0;j<=DraggableView.grid_width;j++)
         {
            DraggableView.addbox(innercontainer,
               DraggableView.box_width*j,
               DraggableView.box_height*i);
         }
      }
      // Add the innertcontainer to the outercontainer
      container.appendChild(innercontainer);
      // Center the innercontainer onto the grid.
      innercontainer.style.left = -DraggableView.box_width*0.5;
      innercontainer.style.top = -DraggableView.box_height*0.5;
   },

   // Adds a box to the specified container at the location (absolute) specified
   addbox: function(container,x,y)
   {
      var test = document.getElementById("DraggableView.box_"+x+"_"+y);
      if (!test) {
         var box = document.createElement('div');
         box.setAttribute("style",
            "border: 1px solid #999; "+
            "background: #efe; "+
            "width: "+DraggableView.box_width+"px; height: "+DraggableView.box_height+"px; "+
            "position: absolute; "+
            "top: "+y+"px; left: "+x+"px;"+
            "text-align: center;"+
            "vertical-align: middle;"
            );
         box.id = "DraggableView.box_"+x+"_"+y;
         box.innerHTML = (x/DraggableView.box_width)+","+(y/DraggableView.box_height);
         container.appendChild(box);
      }
   },

   // Removes a box at the given location
   removebox: function (container,x,y)
   {
      var box = document.getElementById("DraggableView.box_"+x+"_"+y);
      if (box) {
         container.removeChild(box);
      }
   },

   // Called when the innercontainer is dragged
   dragbox: function (item,event)
   {
      // The boxes in the innercontainer
      var boxen = innercontainer.getElementsByTagName("div");
      // The offset at this position
      var new_offset_x = Math.floor(innercontainer.offsetLeft/DraggableView.box_width);
      var new_offset_y = Math.floor(innercontainer.offsetTop/DraggableView.box_height);
      
      // Check if we have crossed a boundary
      if (new_offset_x != DraggableView.previous_offset_x || 
          new_offset_y != DraggableView.previous_offset_y)
      {
         // Identify the offsets that can now be removed
         var chop_x = DraggableView.previous_offset_x * DraggableView.box_width * -1;
         var chop_y = DraggableView.previous_offset_y * DraggableView.box_height * -1;
         var removes = [];
         // Look at all the boxes for ones that can be removed
         for (var i=0;i<boxen.length;i++)
         {
            // Moving RIGHT
            if ((new_offset_x < DraggableView.previous_offset_x) &&
               (boxen[i].offsetLeft == chop_x-DraggableView.box_width))
            {
               removes.push(i);
               DraggableView.addbox(innercontainer,
                  boxen[i].offsetLeft+
                     ((1+DraggableView.grid_width)*DraggableView.box_width),
                  boxen[i].offsetTop);
               continue;
            }
            // Moving UP
            if ((new_offset_y < DraggableView.previous_offset_y) &&
               (boxen[i].offsetTop == chop_y-DraggableView.box_height))
            {
               removes.push(i);
               DraggableView.addbox(innercontainer,
                  boxen[i].offsetLeft,
                  boxen[i].offsetTop+
                     ((1+DraggableView.grid_height)*DraggableView.box_height));
               continue;
            }
            // Moving LEFT
            if ((new_offset_x > DraggableView.previous_offset_x) &&
               (boxen[i].offsetLeft == chop_x+(DraggableView.grid_width-1)*DraggableView.box_width))
            {
               removes.push(i);
               DraggableView.addbox(innercontainer,
                  boxen[i].offsetLeft-
                     ((1+DraggableView.grid_width)*DraggableView.box_width),
                  boxen[i].offsetTop);
               continue;
            }
            // Moving DOWN
            if ((new_offset_y > DraggableView.previous_offset_y) &&
               (boxen[i].offsetTop == chop_y+(DraggableView.grid_height-1)*DraggableView.box_height))
            {
               removes.push(i);
               DraggableView.addbox(innercontainer,
                  boxen[i].offsetLeft,
                  boxen[i].offsetTop-
                     ((1+DraggableView.grid_height)*DraggableView.box_height));
               continue;
            }
         }
         // Remove all the boxes marked for removal
         while (removes.length>0) {
            innercontainer.removeChild(boxen[removes.pop()]);
         }
         // Update the offset for next time
         DraggableView.previous_offset_x = new_offset_x;
         DraggableView.previous_offset_y = new_offset_y;
      }
   }
} //}}}

//{{{ Lasso
var Lasso = {
   lasso: null,
   
   init: function () {
      document.onmousedown = Lasso.mouseDown;
   },
   
   mouseDown: function (e) {
      Lasso.lasso = document.createElement('div');
      Lasso.lasso.setAttribute('style',
         'background: #fff; '+
         'border: 2px dashed #333; '+
         'position: absolute; '+
         'top: '+e.clientY+'px; '+
         'left: '+e.clientX+'px; '+
         'width: 0px; '+
         'height: 10px; '+
         'opacity: 0.75; '+
         'zIndex: 1000; '+
         'padding: 0px; '+
         'margin: 0px;');
      document.body.appendChild(Lasso.lasso);
      document.onmouseup = Lasso.mouseUp;
      document.onmousemove = Lasso.mouseMove;
      var mpos = findMouse(e);
      Lasso.lasso.originX = mpos[0];
      Lasso.lasso.originY = mpos[1];
   },
   
   mouseUp: function (e) {
      document.body.removeChild(Lasso.lasso);
      Lasso.lasso = null;
      document.onmouseup = null;
      document.onmousemove = null;
   },
   mouseMove: function (e) {
      if (Lasso.lasso) {
         if (!e) e = window.event;
         var mpos = findMouse(e);
         if (mpos[0] < Lasso.lasso.originX) {
            Lasso.lasso.style.left = mpos[0];
            Lasso.lasso.style.width =  Lasso.lasso.originX - mpos[0];
         } else if (mpos[0] > Lasso.lasso.originX) {
            Lasso.lasso.style.left = Lasso.lasso.originX;
            Lasso.lasso.style.width = mpos[0] - Lasso.lasso.originX;
         }
         if (mpos[1] < Lasso.lasso.originY) {
            Lasso.lasso.style.top = mpos[1];
            Lasso.lasso.style.height = Lasso.lasso.originY - mpos[1];
         } else if (e.clientY > Lasso.lasso.originY) {
            Lasso.lasso.style.top = Lasso.lasso.originY;
            Lasso.lasso.style.height = mpos[1] - Lasso.lasso.originY;
         }
         
      }
   }
} //}}}



