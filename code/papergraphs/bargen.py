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

maxValue = max(rawdata)
data = map(lambda x: x*300./maxValue, rawdata)

minValue = min(data)
if minValue < 60:
   data = map(lambda x: x*60./minValue, data)

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

def convertToLines(points):
   lines = []
   for p in range(0,len(points)-1):
      lines.append((toMM(points[p][0]),toMM(points[p][1]),toMM(points[p+1][0]),toMM(points[p+1][1])))
   lines.append((toMM(points[len(points)-1][0]),toMM(points[len(points)-1][1]),toMM(points[0][0]),toMM(points[0][1])))
   return lines

def draw(c, lines, dx, dy):
   c.lines(translate(lines,dx,dy))

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
   
width = 500
height = 400

border = 15
cx = width/2
cy = height/2


#md5 = hashlib.md5()
#md5.update(repr(rawdata))

#filename="bar.%s.pdf"%time.time()

filename="bar.%s.pdf"%("0",)

c = canvas.Canvas(filename)
c.setTitle("paper graph - bar.chart.v.1")
c.setFont("Helvetica",20)
pagecw = c._pagesize[0]/2
pagech = c._pagesize[1]/2

c.setFontSize(20)
c.drawRightString(c._pagesize[0]-20*mm,c._pagesize[1]-20*mm,"paper graph")
c.setFontSize(15)
c.drawRightString(c._pagesize[0]-20*mm,c._pagesize[1]-30*mm,"bar.chart.v.1")
c.setFontSize(12)
c.drawRightString(c._pagesize[0]-20*mm,c._pagesize[1]-40*mm,"http://knolleary.net")
c.line(c._pagesize[0]/5,c._pagesize[1]-35*mm,c._pagesize[0]-20*mm,c._pagesize[1]-35*mm)

c.drawImage("by-nc-sa.jpg",pagecw,20*mm,300,None,None,True,"c")
c.setFontSize(25)
c.drawCentredString(pagecw,pagech - toMM(cy)-20*mm,repr(rawdata))


pox = pagecw-toMM(cx)
poy = pagech-toMM(cy)
poy2 = poy + toMM(100)

slotWidth = 4
halfSlotWidth = slotWidth/2
overlap = 5
base = 0

#c.line(pox,poy,pox+toMM(width),poy+toMM(1))

barWidth = width/(len(data)+1)
hbw = barWidth/2

c.setDash([10,7])
c.setStrokeColorRGB(0.8,0.8,0.8)
c.line(pox,poy,pox+toMM(width),poy)
c.setStrokeColorRGB(0,0,0)
c.setDash([])

for i in range(0,len(data)):
   c.setStrokeColorRGB(0,0,0)
   barCenter = barWidth*(i+1)
   c.line(pox,poy2,pox+toMM(width),poy2)
   c.line(pox+toMM(barCenter-hbw)+1,poy2,pox+toMM(barCenter-hbw)+1,poy2+toMM(data[i]+base))
   c.line(pox+toMM(barCenter-hbw)+1,poy2+toMM(data[i]+base),pox+toMM(barCenter+hbw)-1,poy2+toMM(data[i]+base))
   c.line(pox+toMM(barCenter+hbw)-1,poy2,pox+toMM(barCenter+hbw)-1,poy2+toMM(data[i]+base))
   #
   c.setStrokeColorRGB(0.8,0,0)
   if i == 0:
      c.line(pox+toMM(barCenter-hbw-overlap),poy-toMM(overlap),pox+toMM(barCenter+overlap),poy+toMM(barWidth/2+overlap))
      c.line(pox+toMM(barCenter-hbw-overlap),poy+toMM(overlap),pox+toMM(barCenter+overlap),poy-toMM(barWidth/2+overlap))
   else:
      c.line(pox+toMM((barWidth*i)-overlap),poy+toMM(barWidth/2+overlap),pox+toMM(barCenter+overlap),poy-toMM(barWidth/2+overlap))
      c.line(pox+toMM((barWidth*i)-overlap),poy-toMM(barWidth/2+overlap),pox+toMM(barCenter+overlap),poy+toMM(barWidth/2+overlap))
   if i == len(data)-1:
      c.line(pox+toMM(barCenter-overlap),poy-toMM(barWidth/2+overlap),pox+toMM(barCenter+hbw+overlap),poy+toMM(overlap))
      c.line(pox+toMM(barCenter-overlap),poy+toMM(barWidth/2+overlap),pox+toMM(barCenter+hbw+overlap),poy-toMM(overlap))
   
c.setStrokeColorRGB(0,0,0)

c.showPage()
pieces = []

edge = math.sqrt(2*hbw*hbw)
slot = 20
halfSlot = 2*slot/3
ypos = 60
for i in range(0,len(data)):
   if i == 0 or i == len(data)-1:
      points = []
      points.append((0,0+halfSlot))
      points.append((0+2*slotWidth,0+halfSlot))
      points.append((0+2*slotWidth,0+slot))
      points.append((0+2*slotWidth+slotWidth,0+slot))
      points.append((0+2*slotWidth+slotWidth,0))
      points.append((0+2*slotWidth+edge,0))
      points.append((0+2*slotWidth+edge,0+slot))
      points.append((0+2*slotWidth+edge+slotWidth,0+slot))
      points.append((0+2*slotWidth+edge+slotWidth,0+halfSlot))
      points.append((0+2*slotWidth+edge+slotWidth+2*slotWidth,0+halfSlot))
      points.append((0+2*slotWidth+edge+slotWidth+2*slotWidth,0+base+data[i]-halfSlot))
      points.append((0+2*slotWidth+edge+slotWidth,0+base+data[i]-halfSlot))
      points.append((0+2*slotWidth+edge+slotWidth,0+base+data[i]-slot))
      points.append((0+2*slotWidth+edge,0+base+data[i]-slot))
      points.append((0+2*slotWidth+edge,0+base+data[i]))
      points.append((0+2*slotWidth+slotWidth,0+base+data[i]))
      points.append((0+2*slotWidth+slotWidth,0+base+data[i]-slot))
      points.append((0+2*slotWidth,0+base+data[i]-slot))
      points.append((0+2*slotWidth,0+base+data[i]-halfSlot))
      points.append((0,0+base+data[i]-halfSlot))
      pieces.append(convertToLines(points))
      if len(data) == 1:
         pieces.append(convertToLines(points))

      lines = []
      points = []
      points.append((0,0))
      points.append((0+2*slotWidth+edge+slotWidth+2*slotWidth,0))
      points.append((0+2*slotWidth+edge+slotWidth+2*slotWidth,0+base+data[i]))
      points.append((0,0+base+data[i]))
      lines.extend(convertToLines(points))
      points = []
      points.append((0+2*slotWidth,0+slot))
      points.append((0+2*slotWidth+slotWidth,0+slot))
      points.append((0+2*slotWidth+slotWidth,0+base+data[i]-slot))
      points.append((0+2*slotWidth,0+base+data[i]-slot))
      lines.extend(convertToLines(points))
      points = []
      points.append((0+2*slotWidth+edge,0+slot))
      points.append((0+2*slotWidth+edge+slotWidth,0+slot))
      points.append((0+2*slotWidth+edge+slotWidth,0+base+data[i]-slot))
      points.append((0+2*slotWidth+edge,0+base+data[i]-slot))
      lines.extend(convertToLines(points))
      pieces.append(lines)
      if len(data) == 1:
         pieces.append(lines)



   if i < len(data)-1:
      midSlotHeight = (base+min(data[i],data[i+1]))/2

      points = []
      points.append((0,0+halfSlot))
      points.append((0+2*slotWidth,0+halfSlot))
      points.append((0+2*slotWidth,0+slot))
      points.append((0+2*slotWidth+slotWidth,0+slot))
      points.append((0+2*slotWidth+slotWidth,0))
      #mid-bottom
      if False:
         points.append((0+2*slotWidth+edge,0))
         points.append((0+2*slotWidth+edge,0+midSlotHeight))
         points.append((0+2*slotWidth+edge+slotWidth,0+midSlotHeight))
         points.append((0+2*slotWidth+edge+slotWidth,0))
      #
      points.append((0+2*slotWidth+edge+edge,0))
      points.append((0+2*slotWidth+edge+edge,0+slot))
      points.append((0+2*slotWidth+edge+edge+slotWidth,0+slot))
      points.append((0+2*slotWidth+edge+edge+slotWidth,0+halfSlot))
      points.append((0+2*slotWidth+edge+edge+slotWidth+2*slotWidth,0+halfSlot))
      points.append((0+2*slotWidth+edge+edge+slotWidth+2*slotWidth,0+base+data[i+1]-halfSlot))
      points.append((0+2*slotWidth+edge+edge+slotWidth,0+base+data[i+1]-halfSlot))
      points.append((0+2*slotWidth+edge+edge+slotWidth,0+base+data[i+1]-slot))
      points.append((0+2*slotWidth+edge+edge,0+base+data[i+1]-slot))
      points.append((0+2*slotWidth+edge+edge,0+base+data[i+1]))
      #mid-top
      if True:
         points.append((0+2*slotWidth+edge+slotWidth,0+base+data[i+1]))
         points.append((0+2*slotWidth+edge+slotWidth,0+midSlotHeight))
         points.append((0+2*slotWidth+edge,0+midSlotHeight))
         points.append((0+2*slotWidth+edge,0+base+data[i]))
      else:
         points.append((0+2*slotWidth+edge+halfSlotWidth,0+base+data[i+1]))
         points.append((0+2*slotWidth+edge+halfSlotWidth,0+base+data[i]))
      points.append((0+2*slotWidth+slotWidth,0+base+data[i]))
      points.append((0+2*slotWidth+slotWidth,0+base+data[i]-slot))
      points.append((0+2*slotWidth,0+base+data[i]-slot))
      points.append((0+2*slotWidth,0+base+data[i]-halfSlot))
      points.append((0,0+base+data[i]-halfSlot))
      pieces.append(convertToLines(points))

      lines = []
      points = []
      points.append((0,0))
      if True:
         points.append((0+2*slotWidth+edge,0))
         points.append((0+2*slotWidth+edge,0+midSlotHeight))
         points.append((0+2*slotWidth+edge+slotWidth,0+midSlotHeight))
         points.append((0+2*slotWidth+edge+slotWidth,0))
      points.append((0+2*slotWidth+edge+edge+slotWidth+2*slotWidth,0))
      points.append((0+2*slotWidth+edge+edge+slotWidth+2*slotWidth,0+base+data[i+1]))
      points.append((0+2*slotWidth+edge+slotWidth,0+base+data[i+1]))
      if False:
         points.append((0+2*slotWidth+edge+slotWidth,0+base+data[i+1]))
         points.append((0+2*slotWidth+edge+slotWidth,0+midSlotHeight))
         points.append((0+2*slotWidth+edge,0+midSlotHeight))
         points.append((0+2*slotWidth+edge,0+base+data[i]))
      else:
         points.append((0+2*slotWidth+edge+halfSlotWidth,0+base+data[i+1]))
         points.append((0+2*slotWidth+edge+halfSlotWidth,0+base+data[i]))
      points.append((0+2*slotWidth,0+base+data[i]))
      points.append((0,0+base+data[i]))
      lines.extend(convertToLines(points))
      points = []
      points.append((0+2*slotWidth,0+slot))
      points.append((0+2*slotWidth+slotWidth,0+slot))
      points.append((0+2*slotWidth+slotWidth,0+base+data[i]-slot))
      points.append((0+2*slotWidth,0+base+data[i]-slot))
      lines.extend(convertToLines(points))
      points = []
      points.append((0+2*slotWidth+edge+edge,0+slot))
      points.append((0+2*slotWidth+edge+edge+slotWidth,0+slot))
      points.append((0+2*slotWidth+edge+edge+slotWidth,0+base+data[i+1]-slot))
      points.append((0+2*slotWidth+edge+edge,0+base+data[i+1]-slot))
      lines.extend(convertToLines(points))
      pieces.append(lines)


xpos = toMM(70)
ypos = toMM(80)
maxh = 0

c.setLineWidth(0.3)

for p in pieces:
   (w,h) = getSize(p)
   if xpos+w > 550:
      xpos = toMM(70)
      ypos += maxh+20
      maxh = 0
   if ypos+h > 800:
      xpos = toMM(70)
      ypos = toMM(80)
      maxh = 0
      c.showPage()
      c.setLineWidth(0.3)
   draw(c,p,xpos,ypos)
   maxh = max(h,maxh)
   xpos += w+20
c.showPage()

#c.save()
#print filename
print c.getpdfdata()

