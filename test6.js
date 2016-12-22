/* feedback to Time Entry window */
function pushDate(){
	if(pto.length==0){
		if(window.confirm('No PTO?'))alert('ok');
	}		
	for(var i=0;i<pto.length;i++){
		for(var j=1;j<ptorow;j++){
			setValue(pto[i]-1,j,null,null,null);
		}
		setValue(pto[i]-1,ptorow,null,null,'7.5');
	}
	w.close();
}

function temp(){
	/* for a month */
	for(x=0;x<31;x++){
		if(document.getElementById('B24_1_'+x)==null){break}
		if(weekends.indexOf(x+1)>=0){
			setValue(x,1,null,null,null);
			setValue(x,2,null,null,null);
			setValue(x,3,null,null,null);
			continue
		}
		if(holidays.indexOf(x+1)>=0){
			setValue(x,1,null,null,8);
			continue
		}
		var time1 = randTime('09:00',60,0);
		var time2 = randTime('11:30',60,0);
		var time3 = randTime(time2,30,40);
		var time4 = randTime('19:00',180,0);
		if (holidays.length==0){
			setValue(x,1,time1,time2,null);
			setValue(x,2,time2,time3,null);
			setValue(x,3,time3,time4,null);
		}else{
			setValue(x,1,null,null,null);
			setValue(x,2,time1,time2,null);
			setValue(x,3,time2,time3,null);
			setValue(x,4,time3,time4,null);
		}
	}
	submitForm('DefaultFormName',1,{'_FORM_SUBMIT_BUTTON':recalcId});
	alert('Finished!');
}


/* select multiple PTO date */
function selectDate(id){
	var e=w.document.getElementById(id);
	if(offdays.indexOf(id)>=0){
		return;
	} else if(pto.indexOf(id)>=0){
		for(x=0;x<pto.length;x++){if(pto[x]==id) pto.splice(x,1)};
		e.style.background=bg;
		e.style.color='black';
	} else {
		pto.push(id);
		e.style.background='blue';
		e.style.color='white';
	}
}

function setValue(x,y,v1,v2,v3){
	var d=document;
	d.getElementById('B24_'+y+'_'+x).value=v1;
	d.getElementById('B26_'+y+'_'+x).value=v2;
	d.getElementById('B28_'+y+'_'+x).value=v3
}

/* including 2017 holiday info*/
function getOffdays(_date){
	var days=[];
	var month=_date.getMonth();
	var date=new Date(_date);date.setDate(1);
	switch (month+1){
		case 1:days=[1,2,3,9];break;
		case 2:days=[11];break;
		case 3:days=[20];break;
		case 4:days=[29];break;
		case 5:days=[3,4,5];break;
		case 7:days=[17];break;
		case 8:days=[11];break;
		case 9:days=[18,23];break;
		case 10:days=[9];break;
		case 11:days=[3,23];break;
		case 12:days=[23,30,31];
	}
	for (;date.getMonth()==month;date.setDate(date.getDate()+1)){
		if (date.getDay()==0 || date.getDay()==6){
			days.push(date.getDate());
		}
	}
	return days;
}

function getHolidays(date){
	if(!date.getMonth){return false}
	switch (date.getMonth() +1){
		case 1:return [1,2,3,9];
		case 2:return [11];
		case 3:return [20];
		case 4:return [29];
		case 5:return [3,4,5];
		case 7:return [17];
		case 8:return [11];
		case 9:return [18,23];
		case 10:return [9];
		case 11:return [3,23];
		case 12:return [23,30,31]
	}
	return []
}
function getWeekends(_date){
	var weekends=[];
	var month=_date.getMonth();
	var date=new Date(_date);date.setDate(1);
	for (;date.getMonth()==month;date.setDate(date.getDate()+1)){
		if (date.getDay()==0 || date.getDay()==6){
			weekends.push(date.getDate())
		}
	}
	return weekends
}

var myDate=new Date(document.getElementById('N56').value.split('|')[0]);
var myWeekTbl="SMTWTFS";
var myMonthTbl=[31,28,31,30,31,30,31,31,30,31,30,31];
var s,w,i,j,ptorow,pto=[],bg='#ffffff',bd='#eeeeee';
var offdays=getOffdays(myDate);
var myYear = myDate.getFullYear();
if (((myYear%4)==0 && (myYear%100)!=0) || (myYear%400)==0) myMonthTbl[1]++;
var myMonth = myDate.getMonth();
myDate.setDate(1);
var myWeek = myDate.getDay();
var myTblLine = Math.ceil((myWeek+myMonthTbl[myMonth])/7);
var myTable = new Array(7*myTblLine);

var addrowId=document.documentElement.outerHTML.match(/addrow[^\']+/);
var recalcId=document.documentElement.outerHTML.match(/recalc[^\']+/);
var config=[{work_type:'Public Holiday'},{work_type:'Regular Hours'},{work_type:'Break'},{work_type:'Regular Hours'}];
var holidays=getHolidays(first_day);
var weekends=getWeekends(first_day);
if (holidays.length==0){config.shift();}


for(i=0; i<7*myTblLine; i++) myTable[i]="";
for(i=0; i<myMonthTbl[myMonth]; i++) myTable[i+myWeek]=i+1;

/**** set PTO rows ****/
L: for(i=1;i<10;i++){
	var options = document.getElementById('A21'+i+'N1');
	if(options==null){
		alert("CAUTION!!\nCould not set PTO row!");
		break;
	}
	var type = options.selectedOptions[0].text;
	if(type.match(new RegExp('PTO$'))) break;
	if(type==""){
		for(var j=0;j<options.length;j++){
			if(options[j].text.match(new RegExp('PTO$'))){
				options[j].selected=true;
				break L;
			}
		}
	}
}
//console.log('PTOrow='+i);
ptorow=i;

/**** open new pop-up window ****/
w = window.open('', 'Calender', 'width=300,height=300');
s='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Pragma" content="no-cache">';
s+='<style type="text/css">td {text-align:center;}</style>';
s+='</head><body><h4>'+myYear+'/'+(myMonth+1)+' Calender</h4>';
//s+='<input type=text id=result>';
s+='<input type=button onclick="window.opener.pushDate()" value="apply PTO">';
s+='<table border=0><tr>';
for(j=0;j<7;j++) {s+='<th>'+myWeekTbl[j]+'</th>'}
s+='</tr>';
for(i=0; i<myTblLine; i++){
	s+='<tr>';
	for(j=0; j<7; j++){
		myDat = myTable[j+(i*7)];
		s+='<td id='+myDat+' onclick="window.opener.selectDate('+myDat+');" bgcolor=';
		if(offdays.indexOf(myDat)>=0){s+=bd}else{s+=bg}
		s+='>'+myDat+'</td>';
	}
	s+='</tr>';
}
w.document.write(s+'</table></body></html>');
