var nolPower = ({
      vis_years: null,
      vis_year: null,
      vis_month: null,
      vis_day: null,
      
      pencePerKWH: 11.4,
      
      currentDayUsage: 0,
      currentMonthUsage: 0,
      currentYearUsage: 0,
      currentMonthAverageUsage: 0,
      
      todayMonth: 0,
      todayYear: 0,
      todayDay: 0,
      
      currentMonth: 0, // 0-11
      currentYear: 0,  // 2010
      currentDay: 0,   // 1-{28,29,30,31}
      currentMonthLength: 31,
      
      currentMonthData: [],
      currentDayData: [],
      
      yearsData: [],
      yearData: [],
      monthData: [],
      fullData: {},
      
      dayDate: "",
      dayDataCount: 0,
      firstDayOfWeek: -1,
      
      MONTH_LENGTHS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      MONTH_DAYS: [0,31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
      MONTH_NAMES: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      
      setMonth: function(m) {
         this.currentMonth = m;
         this.currentMonthLength = 31;
         while (new Date(this.currentYear,this.currentMonth,this.currentMonthLength,0,0,0,0).getMonth() != this.currentMonth) {
            this.currentMonthLength -= 1;
         }
         this.firstDayOfWeek = new Date(this.currentYear,this.currentMonth,1,0,0,0,0).getDay();
         if (this.currentMonthData.length != 0) {
            this.changeMonth();
         }
         
      },

      updateData: function(md) {
         var dateFormat = pv.Format.date("%d/%m/%Y");
         this.fullData = {};
         this.yearsData = [];
         var lastYear = "";
         for (i in md) {
            var d = md[i];
            var date = dateFormat.parse(d.date);
            d.date = date;
            var y = date.getFullYear().toString();
            var m = date.getMonth().toString();
            if (y != lastYear && y != "1970") {
               lastYear = y;
               this.yearsData.push(lastYear);
            }
            this.fullData[y] || (this.fullData[y] = {});
            this.fullData[y][m] || (this.fullData[y][m] = {});
            this.fullData[y][m][date.getDate().toString()] = d;
         }
         
         this.yearData = [];
         var y = this.fullData[this.currentYear]
         if (typeof y != "undefined") {
            for (m in y) {
               for (i in y[m]) {
                  this.yearData.push(y[m][i]);
               }
            }
         }
         setTimeout(function() { nolPower.changeMonth.call(nolPower) },50);
      },
      
      updatePriceInfo: function() {
         function getCost(value) {
            var cost = (value*nolPower.pencePerKWH)/100;
            return "&pound;"+pv.Format.number().fractionDigits(2).format(cost)
         }
         var dc = getCost(this.currentDayUsage);
         var dd = getCost(this.currentDayUsage-this.currentMonthAverageUsage);
         if (dd == "£0.00") {
            dd = "";
         } else if (this.currentDayUsage-this.currentMonthAverageUsage < 0) {
            dd += " less ";
            document.getElementById('daydeltacost').className = "less";
         } else {
            dd += " more ";
            document.getElementById('daydeltacost').className = "more";
         }
         document.getElementById('daycost').innerHTML = dc;
         document.getElementById('daydeltacost').innerHTML = dd;
         document.getElementById('monthcost').innerHTML = getCost(this.currentMonthUsage);
         //document.getElementById('yearcost').innerHTML = getCost(this.currentYearUsage);
      },

      
      loadDay: function(date) {
         //var hashDateFormat = pv.Format.date("%d/%m/%Y");
         //window.location.hash = hashDateFormat.format(date);
         var dateFormat = pv.Format.date("%d_%m_%Y");
         var file = "data/data_"+dateFormat.format(date)+".js";
         $.getScript(file, function() {
               nolPower.dayDataCount = daydatacount;
               nolPower.dayDate = daydate;
               setTimeout(function() { nolPower.changeDay.call(nolPower)},500);
         });
      },
      
      changeDay: function() {
         if (typeof oldday == "undefined") {
            step = 0;
            oldday = this.currentDayData;
            this.currentDayUsage = this.fullData[this.currentYear][this.currentMonth][this.currentDay].value;
            this.currentMonthUsage = 0;
            this.currentMonthAverageUsage = 0;
            var dataCount = 0;
            for (var i=0;i<this.currentMonthLength+1;i+=1) {
               try {
                  this.currentMonthUsage += this.fullData[this.currentYear][this.currentMonth][i+1].value;
                  dataCount++;
               } catch(e) {
               }
            }
            if (dataCount > 0) {
               this.currentMonthAverageUsage = this.currentMonthUsage/dataCount;
            }


            this.updatePriceInfo();
         }
         
         var monthStepCount = 3;
         step+=1;
         this.currentDayData = [];
         for (i in newday) {
            if (i<oldday.length) {
               this.currentDayData.push(oldday[i]+(step*(newday[i]-oldday[i])/monthStepCount));
            } else {
               this.currentDayData.push(step*newday[i]/monthStepCount);
            }
         }
         this.vis_day.render();
         if (step < monthStepCount) {
            setTimeout(function() { nolPower.changeDay.call(nolPower) },50);
         } else {
            delete oldday;
            delete step;
            if (this.dayDataCount < 144) {
               this.currentDayData.splice(this.dayDataCount,144-this.dayDataCount);
               this.vis_day.render();
            }
         }
      },
      
      changeMonth: function() {
         if (typeof monthStep == "undefined") {
            oldMonthData = this.currentMonthData;
            monthStep = 0;
            //console.log(pv.Format.number().fractionDigits(0,2).format((totalMonth*nolPower.pencePerKWH)/100));
         }
         var monthStepCount = 3;
         monthStep += 1;
         this.currentMonthData = [];
         for (var i = 0;i<Math.max(oldMonthData.length,this.currentMonthLength);i+=1) {
            var oldValue = 0;
            if (i<oldMonthData.length) {
               oldValue = oldMonthData[i].value;
            }
            var targetValue = 0;
            
            if (i<this.currentMonthLength) {
               try {
                  targetValue = this.fullData[this.currentYear][this.currentMonth][i+1].value;
               } catch(e) {
                  targetValue = 0;
               }
            }
            this.currentMonthData[i] = {
               date: new Date(this.currentYear,this.currentMonth,i+1,0,0,0,0),
               value: oldValue+(monthStep*(targetValue-oldValue)/monthStepCount)
            }
         }
         
         if (monthStep == 1) {
            var i = nolPower.currentDay;
            var m = this.fullData[this.currentYear][this.currentMonth];
            if (typeof m[nolPower.currentDay] == "undefined") {
               while(typeof m[i] == "undefined" && i > 0) { 
                  i -= 1;
               }
               if (i == 0) {
                  i = nolPower.currentDay;
                  while(typeof m[i] == "undefined" && i <= this.currentMonthLength) {
                     i += 1;
                  }
               }
               nolPower.currentDay = i;
            }
            nolPower.loadDay(nolPower.currentMonthData[nolPower.currentDay-1].date);
         }
         if (this.vis_month) {
            this.vis_month.render();
         }
         if (this.vis_year) {
            this.vis_year.render();
         }
         if (this.vis_years) {
            this.vis_years.render();
         }
         if (monthStep < monthStepCount) {
            setTimeout(function() { nolPower.changeMonth.call(nolPower) },50);
         } else {
            delete monthStep;
            delete oldMonthData;
         }
      },
         
      init: function() {
         var d = new Date();
         this.todayYear = 2010; // d.getFullYear();
         this.todayMonth = 11; //d.getMonth();
         this.todayDay = 10; //d.getDate();
         
         var providedDate = window.location.hash.substring(1);
         if (providedDate == "") {
            this.currentYear = this.todayYear;
            this.currentDay = this.todayDay;
            this.setMonth(this.todayMonth);
         } else {
            var hashDateFormat = pv.Format.date("%d/%m/%Y");
            var d = hashDateFormat.parse(providedDate);
            this.currentYear = d.getFullYear();
            this.currentDay = d.getDate();
            this.setMonth(d.getMonth());
         }
         
         if (new Date(this.currentYear,1,29,0,0,0,0).getMonth() == 1) {
            this.MONTH_LENGTHS[1] = 29;
            for (var i=2;i<this.MONTH_DAYS.length;i+=1) {
               this.MONTH_DAYS[i]+=1;
            }
         }
         //this.updateData(pv.range(0,this.currentMonthLength).map(function(d) {return {date:"",value:0}}));
         this.currentDayData = pv.range(0,144,1).map(function(d){return 0 });
         $(document).ready(function() {
               var file = "data/days.js?"+Math.floor(10000*Math.random());
               $.getScript(file, function() {
                     nolPower.updateData(monthdata);
                     nolPower.loadDay(new Date(nolPower.currentYear,nolPower.currentMonth,nolPower.currentDay,0,0,0,0));
               });
         });
         return this;
      },


      create_years_graph: function() {
         this.vis_years = new pv.Panel().width(575).height(30);
         this.vis_years.year_over = -1;
         
         this.vis_years.add(pv.Bar)
            .visible(function(d) {return this.index == this.parent.year_over || d == nolPower.currentYear})
            .data(function() { return nolPower.yearsData })
            .width(55)
            .bottom(2)
            .height(3)
            .left(function() { return 10+this.index*57 })
            .fillStyle(function(d) {
                  if (d == nolPower.currentYear) { return "#D43D1A"; }
                  else if (this.index == this.parent.year_over) { return "#FF8000";}
            })
         ;
         this.vis_years.add(pv.Bar)
         .data(function() {return nolPower.yearsData})
            .width(55)
            .bottom(2)
            .height(26)
            .cursor("pointer")
            .left(function() {return 10+this.index*57})
            .fillStyle("rgba(0,0,0,.001)")
            .event("mouseout", function() {
                  this.parent.year_over = -1;
                  return nolPower.vis_years;
            })
            .event("mousemove", function() {
                  var newi = Math.floor((nolPower.vis_years.mouse().x-10)/57);
                  if (newi>=12) {newi=-1;}
                  if (newi!=this.parent.year_over) {
                     this.parent.year_over=newi;
                     return nolPower.vis_years;
                  }
            })
            .anchor("center")
            .add(pv.Label)
            .font("20px Arial")
            .textStyle("#999")
            .textAlign("center")
         ;
         this.vis_years.render();
      },
      
      create_year_graph: function() {
         this.vis_year = new pv.Panel().width(575).height(60);
         this.vis_year.year_month_over = -1;
         this.vis_year.add(pv.Label)
            .left(570)
            .bottom(55)
            .font("20px Arial")
            .text(function() {return nolPower.currentYear})
            .textStyle("#999")
            .textAlign("right")
            .textAngle(3*Math.PI/2)
         ;
         this.vis_year.add(pv.Bar)
         .visible(function() {return (this.index == this.parent.year_month_over) || (this.index == nolPower.currentMonth)})
            .data(pv.range(1,13))
            .left(function(d){return 32+nolPower.MONTH_DAYS[d-1]*1.4})
            .width(function(d){return (nolPower.MONTH_DAYS[d]-nolPower.MONTH_DAYS[d-1])*1.4})
            .bottom(2)
            .height(12+30*1.3)
            .fillStyle(function() {
                  if (this.index == nolPower.currentMonth) { return "#ffa851"; }
                  else if (this.index == this.parent.year_month_over) { return "#ffc489";}
            })
         ;
         this.vis_year.add(pv.Rule)
            .strokeStyle("#999")
            .bottom(14)
            .left(32)
            .width(511) /*365*1.4*/
         ;
         this.vis_year.add(pv.Rule)
            .strokeStyle("#999")
            .data(nolPower.MONTH_DAYS)
            .left(function(d){return 32+d*1.4})
            .bottom(8)
            .height(6)
         ;
         this.vis_year.add(pv.Label)
            .data(pv.range(1,13))
            .text(function(d) {return nolPower.MONTH_NAMES[d-1].substring(0,3)})
            .textAlign("center")
            .left(function(d){return 32+(nolPower.MONTH_DAYS[d-1]+(nolPower.MONTH_DAYS[d]-nolPower.MONTH_DAYS[d-1])/2)*1.4})
            .bottom(1)
         ;
         this.vis_year.add(pv.Line)
            .data(function() {return nolPower.yearData})
            .bottom(function(d){return 14+d.value*1.3})
            .left(function(d){return 32+(nolPower.MONTH_DAYS[d.date.getMonth()]+d.date.getDate()-1) * 1.4})
            .lineWidth(1)
         ;
         this.vis_year.add(pv.Bar)
            .cursor("pointer")
            .fillStyle("rgba(0,0,0,.001)")
            .event("mouseout", function() {
                  this.parent.year_month_over = -1;
                  return nolPower.vis_year;
            })
            .event("mousemove", function() {
                  var newi = Math.floor(0.5+(nolPower.vis_year.mouse().x-48)/(31*1.4));
                  if (newi>=12) {newi=-1;}
                  if (newi!=this.parent.year_month_over) {
                     this.parent.year_month_over=newi;
                     return nolPower.vis_year;
                  }
            })
            .event("click", function() {
                  if (this.parent.year_month_over>=0 && this.parent.year_month_over<=11) {
                     nolPower.setMonth(this.parent.year_month_over);
                  }
            })
         ;
         this.vis_year.render();
      },
      
      create_month_graph: function() {
         this.vis_month = new pv.Panel().width(575).height(250);
         this.vis_month.barWidth = 15.5;
         this.vis_month.firstDayOfWeek = -1;
         
         this.vis_month.add(pv.Bar)
            .visible(function() { 
                  var i = (this.index+nolPower.firstDayOfWeek)%7;
                  return i==0 || i==6;
            })
            .data(function() {return pv.range(0,nolPower.currentMonthLength)})
            .left(function(d) {return d * (nolPower.vis_month.barWidth+2)+29})
            .bottom(0)
            .height(13)
            .width(nolPower.vis_month.barWidth+3)
            .fillStyle("#bbb")
         ;
         
         this.vis_month.add(pv.Bar)
            .visible(function() { 
                  var i = (this.index+nolPower.firstDayOfWeek)%7;
                  return i==0 || i==6;
            })
            .data(function() {return pv.range(0,nolPower.currentMonthLength)})
            .left(function(d) {return d * (nolPower.vis_month.barWidth+2)+29})
            .bottom(13)
            .height(237)
            .width(nolPower.vis_month.barWidth+3)
            .fillStyle("#eee")
         ;
         
         this.vis_month.add(pv.Rule)
            .left(27.5)
            .bottom(14)
            .height(205)
            .strokeStyle("#999")
         ;
         this.vis_month.add(pv.Rule)
            .data(pv.range(0,21,1))
            .bottom(function(d){return d*10+14})
            .left(23)
            .width(4)
            .strokeStyle("#999")
         ;
         this.vis_month.add(pv.Rule)
            .data(pv.range(0,21,5))
            .bottom(function(d){return d*10+14})
            .left(20)
            .width(7)
            .strokeStyle("#999")
            .add(pv.Label)
            .textAlign("right")
            .textBaseline("middle")
         ;
         this.vis_month.add(pv.Bar)
         .data(function(){return nolPower.currentMonthData})
         .left(function(d){return (d.date.getDate()-1) * (nolPower.vis_month.barWidth+2)+30})
            .bottom(14)
            .cursor("pointer")
            .width(nolPower.vis_month.barWidth)
            .height(function(d){return d.value * 10})
            .def("selected",-1)
            .def("hovered",-1)
            .fillStyle(
               function() {
                  if (nolPower.currentDay == this.index+1) { return "#D43D1A"; }
                  else if (this.hovered() == this.index) { return "#FF8000"; }
                  else return "#96B0C1";
            })
            .event("mouseover", function() {this.hovered(this.index); return this;})
            .event("mouseout", function() {this.hovered(-1); return this;})
            .event("click", function() { 
                  nolPower.currentDay = this.index+1;
                  nolPower.loadDay(nolPower.currentMonthData[nolPower.currentDay-1].date);
                  this.parent.render();
            })
            .title(function(){return pv.Format.number().fractionDigits(0,2).format(nolPower.currentMonthData[this.index].value)+"kWh"})
         ;
         this.vis_month.add(pv.Rule)
            .bottom(14)
            .left(27.5)
            .width(31*(nolPower.vis_month.barWidth+2)+2)
            .strokeStyle("#999")
            .add(pv.Label)
            .left(function(){return this.index * (nolPower.vis_month.barWidth+2)+30+(nolPower.vis_month.barWidth/2)})
            .bottom(0)
            .data(function(){return pv.range(1,nolPower.currentMonthLength+1)})
            .textAlign("center")
         ;
         this.vis_month.add(pv.Label)
            .left(570)
            .bottom(245)
            .font("20px Arial")
            .text(function(){return nolPower.MONTH_NAMES[nolPower.currentMonth]})
            .textStyle("#999")
            .textAlign("right")
            .textAngle(3*Math.PI/2)
         ;
         
         this.vis_month.render();
      },
      
      create_day_graph: function() {
         this.vis_day = new pv.Panel().width(575).height(250);
         this.vis_day.dot_over = -1;
         this.vis_day.min_value = 0;
         this.vis_day.max_value = 0;
         this.vis_day.sx = pv.Scale.linear(0,144).range(41,545);
         this.vis_day.sy = pv.Scale.linear(0,4000).range(19,219);
         
         this.vis_day.add(pv.Label)
            .left(570)
            .bottom(225)
            .font("20px Arial")
            .text(function(){return nolPower.dayDate})
            .textStyle("#999")
            .textAlign("right")
         ;
         /*
         nolPower.vis_day.add(pv.Label)
         .left(500)
         .bottom(230)
         .font("16px Arial")
         .text(function() Math.floor(this.parent.min_value)+"w - "+Math.floor(this.parent.max_value)+"w")
         .textStyle("#999")
         .textAlign("right")
         ;
         */
         this.vis_day.add(pv.Rule)
            .left(40)
            .bottom(19)
            .height(205)
            .strokeStyle("#999")
         ;
         this.vis_day.add(pv.Rule)
            .data(pv.range(100,4000,100))
            .bottom(function(d){return nolPower.vis_day.sy(d)})
            .left(38)
            .width(2)
            .strokeStyle("#999")
         ;
         this.vis_day.add(pv.Rule)
            .data(pv.range(500,4000,1000))
            .bottom(function(d){return nolPower.vis_day.sy(d)})
            .left(36)
            .width(4)
            .strokeStyle("#999")
         ;
         this.vis_day.add(pv.Rule)
            .data(pv.range(0,4001,1000))
            .bottom(function(d){return nolPower.vis_day.sy(d)})
            .left(33)
            .width(7)
            .strokeStyle("#999")
            .add(pv.Label)
            .textAlign("right")
            .textBaseline("middle")
         ;
         this.vis_day.add(pv.Rule)
            .bottom(function() {
                  var max = 0;
                  for (var i=0;i<nolPower.currentDayData.length;i++) {
                     max = Math.max(max,nolPower.currentDayData[i]);
                  };
                  this.parent.max_value = max;
                  return nolPower.vis_day.sy(max);
            })
            .left(37.5)
            .width(520)
            .strokeStyle("#b5bdcc")
            .add(pv.Dot)
            .left(40)
            .size(30)
            .strokeStyle("#4975cc")
         ;
         this.vis_day.add(pv.Rule)
            .bottom(function() {
                  var min = 10000000;
                  for (var i=0;i<nolPower.dayDataCount;i++) {
                     min = Math.min(nolPower.currentDayData[i],min);
                  };
                  this.parent.min_value = min;
                  return nolPower.vis_day.sy(min);
            })
            .left(37.5)
            .width(520)
            .strokeStyle("#b5bdcc")
            .add(pv.Dot)
            .left(40)
            .size(30)
            .strokeStyle("#4975cc")
         ;
         
         this.vis_day.add(pv.Line)
         .data(function(){return nolPower.currentDayData})
         .left(function(){return nolPower.vis_day.sx(this.index)})
         .bottom(function(d){return nolPower.vis_day.sy(d)})
            .lineWidth(2)
         ;
         /*
         this.vis_day.add(pv.Dot)
            .visible(function() this.parent.dot_over>=0) 
            .data(function(d) {
            if (this.parent.dot_over>=0&&this.parent.dot_over<nolPower.currentDayData.length) {
            return [{x:this.parent.dot_over,y:nolPower.currentDayData[this.parent.dot_over]}]; 
            } else {
            return [{x:0,y:0}]
            }
            })
            .left(function(d) nolPower.vis_day.sx(d.x))
            .bottom(function(d) nolPower.vis_day.sy(d.y))
            .fillStyle(function() this.parent.strokeStyle())
            .strokeStyle("#4975cc")
            .lineWidth(1)
         ;
         */
         this.vis_day.add(pv.Rule)
            .bottom(19)
            .left(37.5)
            .width(520)
            .strokeStyle("#999")
         ;
         this.vis_day.add(pv.Rule)
            .bottom(16)
            .height(3)
            .data(pv.range(0,25,1))
            .left(function(d){return nolPower.vis_day.sx(d*6)})
            .strokeStyle("#999")
         ;
         this.vis_day.add(pv.Rule)
            .bottom(14)
            .height(5)
            .left(function(d){return nolPower.vis_day.sx(this.index*18)})
            .data(pv.range(0,25,3).map(function(d){return d+":00"}))
            .strokeStyle("#999")
            .add(pv.Label)
            .bottom(8)
            .textAlign("center")
            .textBaseline("middle")
         ;
         /*
         this.vis_day.add(pv.Bar)
            .fillStyle("rgba(0,0,0,.001)")
            .event("mouseout", function() {
            this.parent.dot_over = -1;
            return nolPower.vis_day;
            })
            .event("mousemove", function() {
            var newi = Math.floor(0.5+(nolPower.vis_day.mouse().x-40-1.75)/3.5);
            if (newi>=nolPower.currentDayData.length) {newi=nolPower.currentDayData.length-1;}
            if (newi!=this.parent.dot_over) {
            this.parent.dot_over=newi;
            return nolPower.vis_day;
            }
            })
         ;
         */
         this.vis_day.render();
      }
   
}).init();
