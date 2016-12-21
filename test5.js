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
	//w.document.getElementById('result').value = pto.join();
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

if(document.getElementById('N56')==null){
	alert('This Page is NOT Time Entry!');
	break;
}
var myDate=new Date(document.getElementById('N56').value.split('|')[0]);
//var myDate=new Date();
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
console.log('PTOrow='+i);
ptorow=i;


/**** open new pop-up window ****/
w = window.open('', 'Calender', 'width=300,height=300');
s='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Pragma" content="no-cache">';
s+='<style type="text/css">td {text-align:center;}</style>';
s+='</head><body><h4>'+myYear+'/'+(myMonth+1)+' Calender</h4>';
//s+='<input type=text id=result>';
s+='<input type=button onclick="window.opener.pushDate()" value="apply PTO">';
s+='<table border=0><tr>';
for(j=0;j<7;j++) {s+='<th>'+myWeekTbl[j]+'</th>';}
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
