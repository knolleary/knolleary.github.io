// %Z%%M% %I% %W% %G% %U%

//{{{ AnimationPool
var AnimationPool = {
   pool: new Array(),
   addAnimator: function (animator) {
      AnimationPool.pool[animator.obj.id] = animator;
   },
   getAnimator: function (object_ID) {
      return AnimationPool.pool[object_ID];
   },
   removeAnimator: function (animator) {
      delete AnimationPool.pool[animator.obj.id];
   }
}
//}}}

//{{{ Animator
   //{{{ constructor
function Animator(_object_ID,_properties) {
   this.obj = document.getElementById(_object_ID);
   this.running = true;
   this.properties = _properties;
   if (!this.properties.steps || this.properties.steps < 0) {
      this.properties.steps = 0;
   }
   this.properties.originLeft   = this.obj.offsetLeft;
   this.properties.originTop    = this.obj.offsetTop;
   this.properties.originWidth  = this.obj.offsetWidth;
   this.properties.originHeight = this.obj.offsetHeight;
   if (this.properties.targetBackgroundColor) {
      this.properties.originBackgroundColor = new Color(this.obj.style.backgroundColor);
   }
   this.properties.stepCount = 0;
   this.properties.stepPos = 0;
   this.count = this.properties.steps;
   if (!this.properties.delay) {
      this.properties.delay = 100;
   }
   AnimationPool.addAnimator(this);
}
   //}}}
   //{{{ start
Animator.prototype.start = function() {
   window.setTimeout("Animator.stepAnimation('"+this.obj.id+"')",this.properties.delay);
}
   //}}}   
   //{{{ start
Animator.prototype.stop = function() {
   AnimationPool.removeAnimator(this);
   this.running = false;
}
   //}}}
   //{{{ stepAnimation
Animator.stepAnimation = function(object_ID) {
   var animation = AnimationPool.getAnimator(object_ID);
   if (!animation || !animation.properties) {
      return;
   }
   animation.properties.stepCount++;
   if (animation.properties.stepCount < animation.properties.steps) {
      var step = animation.properties.stepCount / animation.properties.steps;
      if (animation.properties.motionstyle = 'acceleration') {
         animation.properties.stepPos += Math.sin(Math.PI*step);
         step = animation.properties.stepPos/(2*Math.PI);
         if (step>1) { step = 1}
      }
      if (animation.properties.targetLeft!=null) {
         animation.obj.style.left   = animation.properties.originLeft   - (step * (animation.properties.originLeft   - animation.properties.targetLeft));
      }
      if (animation.properties.targetTop!=null) {
         animation.obj.style.top    = animation.properties.originTop    - (step * (animation.properties.originTop    - animation.properties.targetTop));
      }
      if (animation.properties.targetWidth!=null) {
         animation.obj.style.width  = animation.properties.originWidth  - (step * (animation.properties.originWidth  - animation.properties.targetWidth));
      }
      if (animation.properties.targetHeight!=null) {
         animation.obj.style.height = animation.properties.originHeight - (step * (animation.properties.originHeight - animation.properties.targetHeight));
      }
      if (animation.properties.targetBackgroundColor!=null) {
         var newR = Math.round(animation.properties.originBackgroundColor.r - (animation.properties.stepCount * (animation.properties.originBackgroundColor.r - animation.properties.targetBackgroundColor.r) / animation.properties.steps));
         var newG = Math.round(animation.properties.originBackgroundColor.g - (animation.properties.stepCount * (animation.properties.originBackgroundColor.g - animation.properties.targetBackgroundColor.g) / animation.properties.steps));
         var newB = Math.round(animation.properties.originBackgroundColor.b - (animation.properties.stepCount * (animation.properties.originBackgroundColor.b - animation.properties.targetBackgroundColor.b) / animation.properties.steps));
         animation.obj.style.backgroundColor = "rgb("+newR+","+newG+","+newB+")";
      }
      window.setTimeout("Animator.stepAnimation('"+animation.obj.id+"')",animation.properties.delay);
   } else {
      if (animation.properties.targetLeft!=null) {
         animation.obj.style.left   = animation.properties.targetLeft;
      }
      if (animation.properties.targetTop!=null) {
         animation.obj.style.top    = animation.properties.targetTop;
      }
      if (animation.properties.targetWidth!=null) {
         animation.obj.style.width  = animation.properties.targetWidth;
      }
      if (animation.properties.targetHeight!=null) {
         animation.obj.style.height = animation.properties.targetHeight;
      }
      if (animation.properties.targetBackgroundColor!=null) {
         animation.obj.style.backgroundColor = animation.properties.targetBackgroundColor.toString();
      }
      //animation.obj.style.zIndex = animation.properties.targetZIndex;
      animation.stop();
      if (animation.properties.completeCallback!=null) {
         eval(animation.properties.completeCallback+"('"+animation.obj.id+"');");
      }
   }
   //}}}
}
//}}}

function test_animator() {
   var animator = new Animator('mover',{steps: 10, targetTop: 300, targetWidth: 200, targetHeight: 200,completeCallback: "animCallback", targetBackgroundColor: new Color("rgb(0,255,255)")});
   animator.start();
   var mover = document.getElementById("mover");
   var debug = document.getElementById("debug");
   debug.innerHTML = mover.style.backgroundColor;
}

function animCallback(id) {
   var mover = document.getElementById(id);
}

function Color(value) {
   var tmp = value.substring(4,value.length-1);
   var values = tmp.split(",");
   this.r = values[0];
   this.g = values[1];
   this.b = values[2];
}

Color.prototype.toString = function() {
   return "rgb("+this.r+","+this.g+","+this.b+")";
}



