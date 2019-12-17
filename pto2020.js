/* feedback to Time Entry window */
function pushDate(){
	for(var i=0;i<pto.length;i++){
		for(var j=1;j<ptorow;j++){
			setValue(pto[i]-1,j,null,null,null);
		}
		setValue(pto[i]-1,ptorow,null,null,'7.5');
	}
	w.close();
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
	d.getElementById('B30_'+y+'_'+x).value=v1;
	d.getElementById('B31_'+y+'_'+x).value=v2;
	d.getElementById('B32_'+y+'_'+x).value=v3
}

/* including 2018 holiday info*/
function getOffdays(_date){
	var days=[];
	var month=_date.getMonth();
	var date=new Date(_date);date.setDate(1);
	switch (month+1){
		case 1:return [1,2,3,13];
		case 2:return [11,23,24];
		case 3:return [20];
		case 4:return [29];
		case 5:return [3,4,5,6];
		case 7:return [23,24];
		case 8:return [10];
		case 9:return [21,22];
		case 10:return [];
		case 11:return [3,23];
		case 12:return [30,31]
	}
	for (;date.getMonth()==month;date.setDate(date.getDate()+1)){
		if (date.getDay()==0 || date.getDay()==6){
			days.push(date.getDate());
		}
	}
	return days;
}

var myDate=new Date(document.getElementById('N56').value.split('|')[0]);
var myWeekTbl="SMTWTFS";
var myMonthTbl=[31,29,31,30,31,30,31,31,30,31,30,31];
var s,w,i,j,ptorow,pto=[],bg='#ffffff',bd='#ff9999';
var offdays=getOffdays(myDate);
var myYear = myDate.getFullYear();
if (((myYear%4)==0 && (myYear%100)!=0) || (myYear%400)==0) myMonthTbl[1]++;
var myMonth = myDate.getMonth();
myDate.setDate(1);
var myWeek = myDate.getDay();
var myTblLine = Math.ceil((myWeek+myMonthTbl[myMonth])/7);
var myTable = new Array(7*myTblLine);

for(i=0; i<7*myTblLine; i++) myTable[i]="";
for(i=0; i<myMonthTbl[myMonth]; i++) myTable[i+myWeek]=i+1;

/**** set PTO rows ****/
L: for(i=1;i<10;i++){
	var options = document.getElementById('A23'+i+'N1');
	if(options==null){
		alert("CAUTION!!\nCould not find PTO row!");
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
// console.log('PTOrow='+i);
ptorow=i;

/**** open new pop-up window ****/
w = window.open('', 'Calender', 'width=300,height=300');
s='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Pragma" content="no-cache">';
s+='<style type="text/css">td {text-align:center;}</style>';
s+='</head><body><h4>'+myYear+'/'+(myMonth+1)+' Calender</h4>';
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
