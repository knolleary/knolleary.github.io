#!/usr/bin/env python

import sys
import time
import math
#import hashlib
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.graphics.barcode import code128

rawdata = []
for arg in sys.argv[1:]:
   try:
      if int(arg) > 0:
         rawdata.append(int(arg))
   except:
      pass

if len(rawdata) == 0:
   sys.exit(1)

if sum(rawdata) != 100:
   data = map(lambda x: x*100./sum(rawdata), rawdata)
else:
   data = rawdata

def filterPoints(points):
   if odd(len(points)):
      return points
   result = []
   for i in range(0,len(points),2):
      if points[i+1]-points[i] > 5:
         result.append(points[i])
         result.append(points[i+1])
      else:
         pass # print "Filtering out ",points[i+1]-points[i],toMM(points[i+1]-points[i])
   return result

def toMM(v):
   return v*mm/4.;
def toDeg(a):
   return a*180/math.pi

def odd(a):
   return a/2!=a/2.
   
def translate(lines,dx,dy):
   r = []
   for l in lines:
      r.append( (l[0]+dx,l[1]+dy,l[2]+dx,l[3]+dy ) )
   return r

def rotate(lines):
   r = []
   for l in lines:
      r.append( (l[1],l[0],l[3],l[2]) )
   return r

def getSize(lines):
   w = 0
   h = 0
   for l in lines:
      w = max(w,l[0],l[2])
      h = max(h,l[1],l[3])
   return (w,h)
   
width = 400
height = 400
radius = 150
radiusSq = radius*radius
border = 15
cx = width/2
cy = height/2


#md5 = hashlib.md5()
#md5.update(repr(rawdata))
filename="pie.%s.pdf"%time.time()


c = canvas.Canvas(filename)
c.setTitle("paper graph - pie.chart.v.1")
c.setFont("Helvetica",20)
pagecw = c._pagesize[0]/2
pagech = c._pagesize[1]/2

c.setFontSize(20)
c.drawRightString(c._pagesize[0]-20*mm,c._pagesize[1]-20*mm,"paper graph")
c.setFontSize(15)
c.drawRightString(c._pagesize[0]-20*mm,c._pagesize[1]-30*mm,"pie.chart.v.1")
c.setFontSize(12)
c.drawRightString(c._pagesize[0]-20*mm,c._pagesize[1]-40*mm,"http://knolleary.net")
c.line(c._pagesize[0]/5,c._pagesize[1]-35*mm,c._pagesize[0]-20*mm,c._pagesize[1]-35*mm)

c.drawImage("by-nc-sa.jpg",pagecw,20*mm,300,None,None,True,"c")
c.setFontSize(25)
c.drawCentredString(pagecw,pagech - toMM(cy)-20*mm,repr(rawdata))

#bc = code128.Code128(repr(rawdata),barHeight = 10*mm)
#x = pagecw - bc.width/2
#y = 60*mm
#bc.drawOn(c,x,y)

#c.rotate(90)
#c.drawImage("by-nc-sa.jpg",30,-c._pagesize[0]+30,400,None,None,True,"sw")
#c.rotate(-90)
pox = pagecw-toMM(cx)
poy = pagech-toMM(cy)

slices = 6
sliceWidth = (width/2)/(slices*1.)
slotWidth = 4
halfSlotWidth = slotWidth/2


pLines = []
pArcs = []
dataAngles = []

a = data[0]/2
for i in range(0,len(data)):
   dataAngles.append(2.*math.pi*data[i]/100.)
   pcx = cx+border*math.cos(a+dataAngles[-1]/2)
   pcy = cy+border*math.sin(a+dataAngles[-1]/2)
   p1x = pcx+radius*math.cos(a)
   p1y = pcy+radius*math.sin(a)
   oa = a
   a = a + dataAngles[-1]
   if a >= 2.*math.pi: a = a - 2.*math.pi
   p2x = pcx+radius*math.cos(a)
   p2y = pcy+radius*math.sin(a)
   if len(data) > 1:
      pLines.append(((pcx,pcy),(p1x,p1y)))
      pLines.append(((pcx,pcy),(p2x,p2y)))
      c.line(pox+toMM(pcx),poy+toMM(pcy),pox+toMM(p1x),poy+toMM(p1y))
      c.line(pox+toMM(pcx),poy+toMM(pcy),pox+toMM(p2x),poy+toMM(p2y))
   a1 = oa
   a2 = a
   if a2 < a1:
      a2 = a2 + 2.*math.pi
   while(a1 > 2.*math.pi):
      a1 -= 2.*math.pi
      a2 -= 2.*math.pi
   if a1 == a2:
      a2 += 2.*math.pi
   pArcs.append( ((pcx,pcy),a1,a2) )
   if len(data) > 1:
      c.arc(pox+toMM(pcx-radius),poy+toMM(pcy-radius),pox+toMM(pcx+radius),poy+toMM(pcy+radius),toDeg(a1),toDeg(a2-a1))
   else:
      c.circle(pox+toMM(pcx),poy+toMM(pcy),toMM(radius))
hSlicePoints = []
for i in range(-slices+1,slices):
   points = []
   y = int(cy+i*sliceWidth)
   for l in pLines:
      if y < min(l[0][1],l[1][1]) or y > max(l[0][1],l[1][1]): continue
      ((x0,y0),(x1,y1)) = l
      x = x0+(x1-x0)*(y-y0)/(y1-y0)
      points.append(x)
   for arc in pArcs:
      ((x0,y0),a0,a1) = arc
      yd = y-y0
      if abs(yd) < radius:
         xd = math.sqrt(abs(radiusSq-(yd*yd)))
         for m in range(0,2):
            ang = math.acos((radiusSq+(xd*xd)-(yd*yd))/(2*radius*xd))
            if y < y0 and m == 0:
               ang = math.pi + ang
            elif y < y0 and m == 1:
               ang = 2.*math.pi - ang
            elif y > y0 and m == 0:
               ang = math.pi - ang
            if (ang > a0 and ang < a1) or (ang+2.*math.pi > a0 and ang+2.*math.pi < a1):
               points.append(x0+((m*2-1)*xd))
   points.sort()
   hSlicePoints.append(filterPoints(points))

vSlicePoints = []
for i in range(-slices+1,slices):
   points = []
   x = int(cy+i*sliceWidth)
   for l in pLines:
      if x < min(l[0][0],l[1][0]) or x > max(l[0][0],l[1][0]): continue
      ((x0,y0),(x1,y1)) = l
      y = y0+(y1-y0)*(x-x0)/(x1-x0)
      points.append(y)
   for arc in pArcs:
      ((x0,y0),a0,a1) = arc
      xd = x-x0
      if abs(xd) < radius: 
         yd = math.sqrt(abs(radiusSq-(xd*xd)))
         for m in range(0,2):
            ang = math.acos((radiusSq+(yd*yd)-(xd*xd))/(2*radius*yd))
            if x < x0 and m == 0:
               ang = 1.5*math.pi - ang
            elif x < x0 and m == 1:
               ang = 0.5*math.pi + ang
            elif x > x0 and m == 0:
               ang = 1.5*math.pi + ang
            else:
               ang = 0.5*math.pi - ang
            if (ang > a0 and ang < a1) or (ang+2.*math.pi > a0 and ang+2.*math.pi < a1):
               points.append(y0+((m*2-1)*yd))
   points.sort()
   vSlicePoints.append(filterPoints(points))

c.setFillColorRGB(0.8,0.8,0.8)
c.setFontSize(10)
for i in range(-slices+1,slices):
   y = int(cy+i*sliceWidth)
   c.setStrokeColorRGB(0.8,0.8,0.8)
   if i == -slices+1 or i==slices-1:
      c.drawRightString(pox+toMM(0),poy+toMM(y)-4,repr(i+slices)+" ")
      c.drawCentredString(pox+toMM(y),poy+toMM(0)-10,repr(i+(2*slices)+5))
   c.line(pox+toMM(0),poy+toMM(y),pox+toMM(width),poy+toMM(y))
   c.line(pox+toMM(y),poy+toMM(0),pox+toMM(y),poy+toMM(height))
   c.setStrokeColorRGB(1,0,0)
   if odd(len(hSlicePoints[i+slices-1])):
      for j in range(0,len(hSlicePoints[i+slices-1])):
         c.circle(pox+toMM(hSlicePoints[i+slices-1][j]),poy+toMM(y),mm,1,1)
   else:
      for j in range(0,len(hSlicePoints[i+slices-1]),2):
         c.line(pox+toMM(hSlicePoints[i+slices-1][j]),poy+toMM(y),
            pox+toMM(hSlicePoints[i+slices-1][j+1]),poy+toMM(y))
   if odd(len(vSlicePoints[i+slices-1])):
      for j in range(0,len(vSlicePoints[i+slices-1])):
         c.circle(pox+toMM(y),poy+toMM(vSlicePoints[i+slices-1][j]),mm,1,1)
   else:
      for j in range(0,len(vSlicePoints[i+slices-1]),2):
         c.line(pox+toMM(y),poy+toMM(vSlicePoints[i+slices-1][j]),
            pox+toMM(y),poy+toMM(vSlicePoints[i+slices-1][j+1]))

c.setStrokeColorRGB(0,0,0)

baseHeight = 60
stepHeight = 50

def isPeak(points,x):
   cx = 0
   peak = False
   for p in points:
      if x < p:
         return peak
      else:
         peak = not peak
   return peak

flip = False
slotType = 0 # 0==down 1==up
pieceNumberOffset = 1
for sourcePoints in [hSlicePoints,vSlicePoints]:
   c.showPage()
   c.setFillColorRGB(0.8,0.8,0.8)
   c.setFontSize(10)
   c.translate(20*mm,20*mm)
   xpos = 0
   ypos = 0
   mode = 0
   for k in range(0,len(sourcePoints)):
      hsp = sourcePoints[k]
      isEndPiece = (k==0) or (k==len(sourcePoints)-1)
      ox = 0
      y = 0
      lines = []
      lines.append((toMM(ox),toMM(y),toMM(ox),toMM(y+baseHeight)))
      lines.append((toMM(ox),toMM(y),toMM(ox+width),toMM(y)))
      y = y + baseHeight
      try:
         for i in range(0,len(hsp),2):
            x1 = hsp[i]
            x2 = hsp[i+1]
            lines.append((toMM(ox),toMM(y),toMM(x1),toMM(y)))
            lines.append((toMM(x1),toMM(y),toMM(x1),toMM(y+stepHeight)))
            lines.append((toMM(x1),toMM(y+stepHeight),toMM(x2),toMM(y+stepHeight)))
            lines.append((toMM(x2),toMM(y+stepHeight),toMM(x2),toMM(y)))
            ox = x2
      except:
         ox = x1
      lines.append((toMM(ox),toMM(y),toMM(width),toMM(y)))
      lines.append((toMM(width),toMM(y),toMM(width),toMM(y-baseHeight)))
      
      for i in range(1, 2*slices):
         x0 = sliceWidth*i-2
         x1 = sliceWidth*i
         x2 = sliceWidth*i+2
         flip = (i==1) or (i==2*slices-1) or (k == len(sourcePoints)/2 and i == slices)
         if isEndPiece:
            flip = not flip
         peak = False
         for j in range(-5,5):
            peak = isPeak(hsp,x1+j)
            if not peak:
               break
         #peak = isPeak(hsp,x1-4) and isPeak(hsp,x1) and isPeak(hsp,x1+4)
         if peak:
            m = (baseHeight+stepHeight)/2
         else:
            m = (baseHeight)/2
            
         if (slotType == 0 and not flip) or (slotType == 1 and flip):
            b = y-baseHeight
            m += 2
         else:
            b = y
            if peak: b += stepHeight
            m -=2
         lines.append( ( toMM(sliceWidth*i+2), toMM(b), toMM(sliceWidth*i+2), toMM(m) ) )
         lines.append( ( toMM(sliceWidth*i-2), toMM(b), toMM(sliceWidth*i-2), toMM(m) ) )
         lines.append( ( toMM(sliceWidth*i-2), toMM(m), toMM(sliceWidth*i+2), toMM(m) ) )
      (w,h) = getSize(lines)
      if mode == 0:
         c.lines(translate(lines,xpos,ypos))
         c.drawRightString(xpos,ypos,repr(k+pieceNumberOffset)+" ")
         ypos += h+20
         if ypos > 640:
            mode = 1
            xpos = w+20
            ypos = 0
      else:
         c.lines(translate(rotate(lines),xpos,ypos))
         c.drawRightString(xpos,ypos,repr(k+pieceNumberOffset)+" ")
         xpos += h+20
         if xpos > 480:
            xpos = w + 20
            ypos += w+20
   slotType = 1
   pieceNumberOffset = 12

c.showPage()
#c.save()
#print filename
print c.getpdfdata()

