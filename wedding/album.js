var STOPPED = 0;
var PLAYING = 1;
var animation = null;
var state = PLAYING;
var current = 0;
var loaded = 0;
var currentImages = new Array();
var loadingImages = new Array();
var currentTimeout = null;
var targetWidth = 1255;
var targetHeight = 889;
var control_play = null;
var control_page = null;
var ratio = 1.41412;
var newDivText = "";
var textDiv = null;
var slides = [
[{'file':'images/00-1.jpg', 'w':424, 'h':600, 'pos':'c'}],
[{'file':'images/01-1.jpg', 'w':500, 'h':375, 'pos':'c'}],
[{'file':'images/02-1.jpg', 'w':500, 'h':375, 'pos':'c'}],
[{'file':'images/03-1.jpg', 'w':500, 'h':667, 'pos':'c', 'url':'http://flickr.com/photos/drchan/289949660/in/pool-nick-and-jo/'}],
[{'file':'images/04-1.jpg', 'w':418, 'h':375, 'pos':'l'}, {'file':'images/04-2.jpg', 'w':418, 'h':375, 'pos':'r'}], 
[{'file':'images/05-1.jpg', 'w':500, 'h':375, 'pos':'l'}, {'file':'images/05-2.jpg', 'w':500, 'h':375, 'pos':'r'}], 
[{'file':'images/06-1.jpg', 'w':500, 'h':375, 'pos':'l'}, {'file':'images/06-2.jpg', 'w':500, 'h':375, 'pos':'r'}], 
[{'file':'images/07-1.jpg', 'w':500, 'h':375, 'pos':'l'}, {'file':'images/07-2.jpg', 'w':375, 'h':500, 'pos':'r'}], 
[{'file':'images/08-1.jpg', 'w':500, 'h':375, 'pos':'c'}],
[{'file':'images/09-1.jpg', 'w':500, 'h':667, 'pos':'c'}],
[{'file':'images/10-1.jpg', 'w':500, 'h':375, 'pos':'l'}, {'file':'images/10-2.jpg', 'w':500, 'h':375, 'pos':'r'}], 
[{'file':'images/11-1.jpg', 'w':500, 'h':375, 'pos':'l'}, {'file':'images/11-2.jpg', 'w':375, 'h':500, 'pos':'r'}], 
[{'file':'images/12-1.jpg', 'w':375, 'h':500, 'pos':'l'}, {'file':'images/12-2.jpg', 'w':500, 'h':375, 'pos':'r'}], 
[{'file':'images/13-1.jpg', 'w':500, 'h':375, 'pos':'bl'}, {'file':'images/13-2.jpg', 'w':500, 'h':375, 'pos':'tr'}], 
[{'file':'images/14-1.jpg', 'w':500, 'h':375, 'pos':'tl'}, {'file':'images/14-2.jpg', 'w':500, 'h':375, 'pos':'br'}], 
[{'file':'images/15-1.jpg', 'w':500, 'h':375, 'pos':'bl'}, {'file':'images/15-2.jpg', 'w':500, 'h':375, 'pos':'tr'}], 
[{'file':'images/16-1.jpg', 'w':375, 'h':375, 'pos':'l3', 'url':'http://flickr.com/photos/ray_chel/295726208/in/pool-nick-and-jo/'}, {'file':'images/16-2.jpg', 'w':375, 'h':375, 'pos':'m3', 'url':'http://flickr.com/photos/ray_chel/295754902/in/pool-nick-and-jo/'}, {'file':'images/16-3.jpg', 'w':375, 'h':375, 'pos':'r3','url':'http://flickr.com/photos/ray_chel/295733519/in/pool-nick-and-jo/'}], 
[{'file':'images/17-1.jpg', 'w':500, 'h':375, 'pos':'tl'}, {'file':'images/17-2.jpg', 'w':500, 'h':375, 'pos':'br'}], 
[{'file':'images/18-1.jpg', 'w':375, 'h':415, 'pos':'l3'}, {'file':'images/18-2.jpg', 'w':375, 'h':415, 'pos':'m3'}, {'file':'images/18-3.jpg', 'w':375, 'h':415, 'pos':'r3','url':'http://flickr.com/photos/ray_chel/295758384/in/pool-nick-and-jo/'}], 
[{'file':'images/19-1.jpg', 'w':500, 'h':375, 'pos':'c', 'url':'http://flickr.com/photos/cocoabeans/289856324/in/pool-nick-and-jo/'}],
[{'file':'images/20-1.jpg', 'w':375, 'h':281, 'pos':'s1','url':'http://flickr.com/photos/ray_chel/295741273/in/pool-nick-and-jo/'}, {'file':'images/20-2.jpg', 'w':375, 'h':281, 'pos':'s2', 'url':'http://flickr.com/photos/ray_chel/295743728/in/pool-nick-and-jo/'}, {'file':'images/20-3.jpg', 'w':375, 'h':281, 'pos':'s3', 'url':'http://flickr.com/photos/ray_chel/295746031/in/pool-nick-and-jo/'}, {'file':'images/20-4.jpg', 'w':375, 'h':281, 'pos':'s4','url':'http://flickr.com/photos/ray_chel/295746783/in/pool-nick-and-jo/'}], 
[{'file':'images/21-1.jpg', 'w':500, 'h':375, 'pos':'tl'}, {'file':'images/21-2.jpg', 'w':500, 'h':375, 'pos':'br'}], 
[{'file':'images/22-1.jpg', 'w':500, 'h':375, 'pos':'bl'}, {'file':'images/22-2.jpg', 'w':500, 'h':375, 'pos':'tr'}], 
[{'file':'images/23-1.jpg', 'w':500, 'h':375, 'pos':'tl'}, {'file':'images/23-2.jpg', 'w':500, 'h':375, 'pos':'br'}], 
[{'file':'images/24-1.jpg', 'w':500, 'h':375, 'pos':'c'}],
[{'file':'images/25-1.jpg', 'w':500, 'h':667, 'pos':'c', 'url':'http://flickr.com/photos/ray_chel/295736608/in/pool-nick-and-jo/'}],
[{'file':'images/26-1.jpg', 'w':500, 'h':303, 'pos':'l','url':'http://flickr.com/photos/rooreynolds/291674525/in/pool-nick-and-jo/'}, {'file':'images/26-2.jpg', 'w':375, 'h':494, 'pos':'r','url':'http://flickr.com/photos/rooreynolds/291674729/in/pool-nick-and-jo/'}], 
[{'file':'images/27-1.jpg', 'w':500, 'h':667, 'pos':'c'}],
[{'file':'images/28-1.jpg', 'w':375, 'h':500, 'pos':'l'}, {'file':'images/28-2.jpg', 'w':375, 'h':500, 'pos':'r'}],
[{'file':'images/29-1.jpg', 'w':500, 'h':375, 'pos':'c'}]
];
var div = null;
var tissue = null;

window.onresize = resizeScreen;
document.onkeydown = function(e) {
   var code;
	if (!e) var e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;
   if (code == 32) {
      next();
   }
   
}

function scaleWidth(w) {
   return Math.floor( w * div.offsetWidth/targetWidth);
}
function scaleHeight(h) {
   return Math.floor( h * div.offsetHeight/targetHeight);
}

function init() {
   div = document.createElement("div");
   div.style.position = 'absolute';
   //div.style.border = "1px solid #000";
   document.body.appendChild(div);
   tissue = document.createElement("div");
   tissue.style.background = "#fff";
   tissue.style.opacity = 0.5;
   tissue.style.position = 'absolute';
   //tissue.style.border = "1px solid #f00";
   document.body.appendChild(tissue);
   textDiv = document.createElement("div");
   textDiv.style.textAlign = 'right';
   textDiv.style.verticalAlign = 'bottom';
   textDiv.style.color = "#ccc";
   textDiv.style.fontFamily = "Arial, sans-serif";
   textDiv.style.fontSize = "10pt";
   textDiv.style.position = 'absolute';
   textDiv.style.right = 20;
   textDiv.style.top = 5;
   document.body.appendChild(textDiv);

   var control_back = createControl('back',10,10);
   control_back.innerHTML = '<img src="images/back.gif">';
   control_back.onmousedown = function(e) {
      if (state == PLAYING) {
         play();
      }
      previous();
   }
   document.body.appendChild(control_back);

   control_play = createControl('play',45,10);
   control_play.innerHTML = '<img src="images/pause.gif">';
   control_play.onmousedown = function(e) {
      play();
   }
   document.body.appendChild(control_play);

   var control_forward = createControl('forward',80,10);
   control_forward.innerHTML = '<img src="images/forward.gif">';
   control_forward.onmousedown = function(e) {
      if (state == PLAYING) {
         play();
      }
      next();
   }
   document.body.appendChild(control_forward);
   
   control_page = document.createElement("div");
   control_page.id = 'page';
   control_page.style.position = 'absolute';
   control_page.style.background = '#fff';
   control_page.style.border = "1px solid #ddd";
   control_page.style.top = 42;
   control_page.style.left = 10;
   control_page.style.width = 95;
   control_page.style.height = 25;
   control_page.style.textAlign = "center";
   control_page.style.verticalAlign = "middle";
   control_page.style.color = "#ddd";
   control_page.style.fontFamily = "Arial, sans-serif";
   control_page.style.fontSize = "15pt";
   control_page.innerHTML = "";
   document.body.appendChild(control_page);
   
   resizeScreen();
   loadSlide(current);
}

function createControl(id,left,top) {
   var control = document.createElement("div");
   control.id = id;
   control.style.position = 'absolute';
   control.style.background = '#fff';
   control.style.border = "1px solid #ddd";
   control.style.top = top;
   control.style.left = left;
   control.style.width = 25;
   control.style.height = 25;
   control.onmouseover = function(e) { this.style.border = "1px solid #aaa;"; }
   control.onmouseout = function(e) { this.style.border = "1px solid #ddd;"; }
   return control;
}

function previous() {
   if (current > 0) {
      current--;
      loadSlide(current);
   }
}

function next() {
   if (slides[current+1]) {
      current++;
      loadSlide(current);
   } else {
      play();
   }
}

function play() {
   if (state == STOPPED) {
      state = PLAYING;
      animation = window.setTimeout("next()",4000);
      control_play.innerHTML = '<img src="images/pause.gif">';
   } else {
      state = STOPPED;
      window.clearTimeout(animation);
      control_play.innerHTML = '<img src="images/play.gif">';
   }
}

function resizeScreen() {
   var screen_ratio = document.body.clientWidth/document.body.clientHeight;
   if (div!=null) {
      if (screen_ratio<ratio) {
         div.style.left = 5;
         div.style.width = (document.body.clientWidth-20)+"px";
         div.style.height = Math.floor((document.body.clientWidth-20)/ratio)+"px";
         div.style.top = Math.floor((document.body.clientHeight-div.offsetHeight)/2)+"px";
            tissue.style.left = 5;
            tissue.style.width = (document.body.clientWidth-20)+"px";
            tissue.style.height = Math.floor((document.body.clientWidth-20)/ratio)+"px";
            tissue.style.top = Math.floor((document.body.clientHeight-tissue.offsetHeight)/2)+"px";
      } else {
         div.style.top = 5;
         div.style.height = document.body.clientHeight-20;
         div.style.width = Math.floor((document.body.clientHeight-20)*ratio)+"px";
         div.style.left = Math.floor((document.body.clientWidth-div.offsetWidth)/2)+"px";
            tissue.style.top = 5;
            tissue.style.height = document.body.clientHeight-20;
            tissue.style.width = Math.floor((document.body.clientHeight-20)*ratio)+"px";
            tissue.style.left = Math.floor((document.body.clientWidth-tissue.offsetWidth)/2)+"px";
      }
   }
   layoutSlide();
}

function scale() {
   this.image.sw =  scaleWidth(this.image.w);
   this.image.sh = scaleHeight(this.image.h);
   this.style.width =this.image.sw;
   this.style.height = this.image.sh;
}

function position() {
   var wspace = scaleWidth(10);
   var hspace = scaleHeight(10);
   switch(this.image.pos) {
   case 'c':
      this.style.left = Math.floor((div.offsetWidth/2)-(this.image.sw/2))+"px";
      this.style.top = Math.floor((div.offsetHeight/2)-(this.image.sh/2))+"px";
      break;
   case 'l':
      this.style.left = Math.floor((div.offsetWidth/2)-(this.image.sw)-wspace)+"px";
      this.style.top = Math.floor((div.offsetHeight/2)-(this.image.sh/2))+"px";
      break;
   case 'r':
      this.style.left = Math.floor((div.offsetWidth/2)+wspace)+"px";
      this.style.top = Math.floor((div.offsetHeight/2)-(this.image.sh/2))+"px";
      break;
      
   case 'tl':
      this.style.left = Math.floor((div.offsetWidth/2)-(this.image.sw)-wspace)+"px";
      this.style.top = Math.floor((div.offsetHeight/2)-(2*this.image.sh/3))+"px";
      break;
   case 'br':
      this.style.left = Math.floor((div.offsetWidth/2)+wspace)+"px";
      this.style.top = Math.floor((div.offsetHeight/2)-(this.image.sh/3))+"px";
      break;
   case 'bl':
      this.style.left = Math.floor((div.offsetWidth/2)-(this.image.sw)-wspace)+"px";
      this.style.top = Math.floor((div.offsetHeight/2)-(this.image.sh/3))+"px";
      break;
   case 'tr':
      this.style.left = Math.floor((div.offsetWidth/2)+wspace)+"px";
      this.style.top = Math.floor((div.offsetHeight/2)-(2*this.image.sh/3))+"px";
      break;
      
   case 'l3':
      this.style.left = Math.floor((div.offsetWidth/2)-(1.5*this.image.sw)-2*wspace)+"px";
      this.style.top = Math.floor((div.offsetHeight/2)-(this.image.sh/2))+"px";
      break;
   case 'm3':
      this.style.left = Math.floor((div.offsetWidth/2)-(this.image.sw/2))+"px";
      this.style.top = Math.floor((div.offsetHeight/2)-(this.image.sh/2))+"px";
      break;
   case 'r3':
      this.style.left = Math.floor((div.offsetWidth/2)+(0.5*this.image.sw)+2*wspace)+"px";
      this.style.top = Math.floor((div.offsetHeight/2)-(this.image.sh/2))+"px";
      break;
      
   case 's1':
      this.style.left = Math.floor((div.offsetWidth/2)-(this.image.sw)-wspace)+"px";
      this.style.top = Math.floor((div.offsetHeight/2)-(this.image.sh)-hspace)+"px";
      break;
   case 's2':
      this.style.left = Math.floor((div.offsetWidth/2)+wspace)+"px";
      this.style.top = Math.floor((div.offsetHeight/2)-(this.image.sh)-hspace)+"px";
      break;
   case 's3':
      this.style.left = Math.floor((div.offsetWidth/2)-(this.image.sw)-wspace)+"px";
      this.style.top = Math.floor((div.offsetHeight/2)+hspace)+"px";
      break;
   case 's4':
      this.style.left = Math.floor((div.offsetWidth/2)+wspace)+"px";
      this.style.top = Math.floor((div.offsetHeight/2)+hspace)+"px";
      break;
   }
   
}
function layout() {
   this.scale();
   this.position();
}

function layoutSlide() {
   for (i in currentImages) {
      currentImages[i].layout();
   }
}

function loadSlide(s) {
   if (currentTimeout != null) {
      window.clearTimeout(currentTimeout);
      currentTimeout = null;
   }
   loaded = 0;
   loadingImages = new Array();
   newDivText = "";
   tissue.style.opacity = 1;
   var slide = slides[s];
   for ( i in slide) {
      var image = slide[i]
      if (image.url) {
         newDivText += '<a target="_blank" href="'+image.url+'">'+image.url+"</a><br>";
      }
      var img = document.createElement("img");
      img.src = image.file;
      img.style.display = 'none';
      img.style.position = 'absolute';
      img.style.width = image.w+"px";
      img.style.height = image.h+"px";
      img.position = position;
      img.image = image;
      img.scale = scale;
      img.layout = layout;
      img.layout();
      //img.style.top = image.top+"px";
      //img.style.left = image.left+"px";
      //      img.onload = function(e) { this.style.display='inline'; }
      img.onload = function(e) { this.style.display='inline'; loadedImage();}
      img.onerror = function(e) { Debug.log(0,"error: "+this.src);}
      loadingImages.push(img);
      div.appendChild(img);
   }
}
function loadedImage() {
   loaded++;
   if (loaded == loadingImages.length) {
      for (i in currentImages) {
         div.removeChild(currentImages[i]);
      }
      currentImages = loadingImages;
      loadingImages = null;
      control_page.innerHTML = (current+1)+"/"+slides.length;
      //tissue.style.display = 'none';
      currentTimeout = window.setTimeout("fade(0.7)",100);
      textDiv.innerHTML = newDivText;
   }
}

function fade(o) {
   if (o<=0) {
      tissue.style.opacity = 0;
      if (state == PLAYING) {
         animation = window.setTimeout("next()",4000);
      }
   } else {
      tissue.style.opacity = o;
      currentTimeout = window.setTimeout("fade("+(o-0.2)+")",100);
   }
}
