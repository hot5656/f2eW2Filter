// variable - fix
var spotMaxItem = 3 ; // one page spot number
var shiftMaxNo = 5;		// max shift button
// reguest data varaible
var xhr = null;
var apiAddress = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97';
var xhrRespDataRaw = null;	// raw quest data
var recordTotalRaw = 0 ;		// raw quest data length
// filter variable 
var filterData = null;
var recordFilter = 0;
// maintain screen variable
var pagePositionStart = 0;  // screen list can show 1st page
var pagePosition = 0;		// screen show page
// show data variable
var recordTotal = 0;	// show data total record
var spotArry = null;	// show data 
// filter condition 
var filterAllDay = false ;
var filterNotAllDay = false ;
var filterFree = false ;
var filterNotFree = false ;
var filterLocation = "全部" ;
// filer button fix string
var filterLable = '<i class="far fa-times-circle"></i>' ;


// first open load data
getTrvelData(apiAddress);
/* RWD */
if (screen.width <= 768) {
	spotMaxItem = 2 ;
}
// enable filetr block height control
/* RWD */
if (screen.width <= 414) {
	var btn = document.getElementsByClassName("title_right");
	for(var i=0 ; i<btn.length ; i++) {
		btn[i].style.display = "block";
	}
	btn = document.getElementsByClassName("side_locate")[0];
	btn.style.height = "65px";
	btn = document.getElementsByClassName("side_open_time")[0];
	btn.style.height = "65px";
	btn = document.getElementsByClassName("side_pay")[0];
	btn.style.height = "65px";
}

xhr.onload = displaySpot;

// load show screen
function displaySpot() {
	// parse Xhr 
	parseXhrData();

	// show spot 
	showSpotData(spotArry, 0, recordTotal) ;
}

// search input and load
function inputSearch(event) {
	if (event.keyCode == 13) {
		// search load data
		getTrvelData(apiAddress + "&q=" + event.target.value);
		xhr.onload = displaySpot;
		event.target.value = "";
	}
}

// process clear fileter button
function clearFilter(index) {
	var filrterBtn = null ;
	switch(index) {
		case 0 :
			filrterBtn = document.getElementById("filter_btn1");
			filterLocation = "全部" ;
			document.getElementById("location").selectedIndex = 0 ;
			break ;
		case 1 :
			filrterBtn = document.getElementById("filter_btn2");
			filterAllDay = false ;
			filterNotAllDay = false ;
			document.getElementById("all_day").checked = false ;
			document.getElementById("not_all_day").checked = false ;
			break ;
		case 2 :
			filrterBtn = document.getElementById("filter_btn3");
			filterFree = false ;
			filterNotFree = false ;
			document.getElementById("p_pay").checked = false ;
			document.getElementById("p_free").checked = false ;
			break ;
		default :
			break;
	}
	if (filrterBtn) {
		filrterBtn.style.color = "#9013FE";
		filrterBtn.style.backgroundColor = "#F2F2F2";
		filrterBtn.innerHTML = filterLable ;
	}

	var recordShow = document.getElementsByClassName("list_item")[0] ;
	// fileter data 
	filterData = xhrRespDataRaw.result.records.filter(filterSpot);
	
	// show filter screen
  showFilterScreen();
}

// switch filter item Height
function switchFilterHeight(event,index) {
	var btn = null ; 
	switch(index) {
		case 0 :
			btn = document.getElementsByClassName("side_locate")[0];
			break;
		case 1 :
			btn = document.getElementsByClassName("side_open_time")[0];
			break;
		case 2 :
			btn = document.getElementsByClassName("side_pay")[0];
			break;
		default :
			break ;
	}
	if (btn) {
		if (event.target.innerHTML == "-"){
			event.target.innerHTML = "+";
			btn.style.height = "65px";
		}
		else {
			event.target.innerHTML = "-";
			btn.style.height = "auto";
		}

	}
}

// location filter
function locateSelect(event) {
  var filrterBtn1 = document.getElementById("filter_btn1");

  // get locate data
	filterLocation = event.target.options[event.target.selectedIndex].value ;
	// show filter button
  if (filterLocation == "全部") {
  	filrterBtn1.innerHTML = filterLable ;
		filrterBtn1.style.color = "#9013FE";
		filrterBtn1.style.backgroundColor = "#F2F2F2";
  }
  else {
		filrterBtn1.innerHTML = filterLocation + filterLable ;
		filrterBtn1.style.color = "#F2F2F2";
		filrterBtn1.style.backgroundColor = "#9013FE";
  }

  // filetr data
	filterData = xhrRespDataRaw.result.records.filter(filterSpot);
	
	// show filter screen
  showFilterScreen()
}

// condition filter
function conditionSelect(event) {
	var filrterBtn2 = document.getElementById("filter_btn2");
	var filrterBtn3 = document.getElementById("filter_btn3");

	switch (event.target.value) {
		case "all_day" :
			if (event.toElement.checked) {
				filterAllDay = true ;
			}
			else {
				filterAllDay = false ;
			}
			break ;
		case "not_all_day" :
			if (event.toElement.checked) {
				filterNotAllDay = true ;
			}
			else {
				filterNotAllDay = false ;			
			}
			break ;
		case "p_pay" :
			if (event.toElement.checked) {
				filterNotFree = true ;
			}
			else {
				filterNotFree = false ;
			}
			break ;
		case "p_free" :
			if (event.toElement.checked) {
				filterFree = true ;
			}
			else {
				filterFree = false ;
			}
			break ;
		default :
			break ;
	}

	filrterBtn2.innerHTML = "" ;
	if (filterAllDay && filterNotAllDay) {
		filrterBtn2.innerHTML = "全天候開放" + "/" + "非全天候開放";
	}
	else {
		if (filterAllDay) {
			filrterBtn2.innerHTML = "全天候開放";
		}
		if (filterNotAllDay) {
			filrterBtn2.innerHTML = "非全天候開放";
		}
	}
	if (filrterBtn2.innerHTML == "") {
		filrterBtn2.style.color = "#9013FE";
		filrterBtn2.style.backgroundColor = "#F2F2F2";
	}
	else {
		filrterBtn2.style.color = "#F2F2F2";
		filrterBtn2.style.backgroundColor = "#9013FE";
	}
	filrterBtn2.innerHTML += filterLable ;

	filrterBtn3.innerHTML = "" ;
	if (filterFree && filterNotFree){
		filrterBtn3.innerHTML = "免費參觀" + "/" + "非免費參觀";
	}
	else {
	 	if (filterFree) {
			filrterBtn3.innerHTML = "免費參觀";
		}
		if (filterNotFree) {
			filrterBtn3.innerHTML = "非免費參觀";
		}
	}
	if (filrterBtn3.innerHTML == "") {
		filrterBtn3.style.color = "#9013FE";
		filrterBtn3.style.backgroundColor = "#F2F2F2";
	}
	else {
		filrterBtn3.style.color = "#F2F2F2";
		filrterBtn3.style.backgroundColor = "#9013FE";
	}
	filrterBtn3.innerHTML += filterLable ;

  // filter data
	filterData = xhrRespDataRaw.result.records.filter(filterSpot);
	
	// show filter screen
  showFilterScreen();
}

// filter check function
function filterSpot(data) {
	var filterState = true ;

	if (filterLocation != "全部") {
		if (!(data.Zone==filterLocation)) {
			filterState = false ;
		}
	}

  var a = data.Opentime ;
	if (filterAllDay ||  filterNotAllDay)  {
		if (filterAllDay &&  filterNotAllDay) {
			// all open select
		  ;
		}
		else if (filterAllDay) {
			// all day - mask not all day
			if (!(data.Opentime=="全天候開放")) {
				filterState = false ;
			}
		}
		else {
			// not all day - mask all ady
			if (data.Opentime=="全天候開放") {
				filterState = false ;
			}
		}
	}

	var b = data.Opentime ;
	if (filterFree || filterNotFree) {
		if (filterFree && filterNotFree) {
			// all pay condition
			;
		}
		else if (filterFree) {
			// free - mask not free
			if (!(data.Ticketinfo=="免費參觀") && !(data.Ticketinfo==="")) {
				filterState = false ;
			}
		}
		else {
			// not free - mask free
			if ((data.Ticketinfo=="免費參觀") || (data.Ticketinfo=="")){
				filterState = false ;
			}
		}
	}
	return filterState;
}

// get trvel data from website
function getTrvelData(dataApi) {
	xhr = new XMLHttpRequest();
	xhr.open('get', dataApi, true);
	xhr.send(null);
}

// parse get data from webside 
function parseXhrData() {
	var recordShow = document.getElementsByClassName("list_item")[0] ;

	// parser json to object
	xhrRespDataRaw = JSON.parse(xhr.responseText) ;
	if (xhrRespDataRaw.success) {
/*		console.log("get success!") ;
		console.log(xhrRespDataRaw) ;
		console.log("count : " + xhrRespDataRaw.result.records.length);
		for(var i=0 ; i<xhrRespDataRaw.result.records.length ; i++) {
			console.log("("+ (i+1) +") " +  
				"Oc" + xhrRespDataRaw.result.records[i].Orgclass + 
				" C1" + xhrRespDataRaw.result.records[i].Class1 + 
				" C2" + xhrRespDataRaw.result.records[i].Class2 + 
				" C3" + xhrRespDataRaw.result.records[i].Class3 +
				xhrRespDataRaw.result.records[i].Zone + " " + xhrRespDataRaw.result.records[i].Name);
			}*/

		// prepare show 	
		recordTotalRaw = xhrRespDataRaw.result.records.length ;
		spotArry = xhrRespDataRaw.result.records ;
		recordTotal = recordTotalRaw ;

		// show button
		addShiftButtom(recordTotal,pagePosition);
		setButtonMark(pagePosition);
		// show record No
		recordShow.innerHTML = "景點筆數 : " + recordTotal ;

		// show spot mode 0
		switchSpotMode(0);
	}
	else {
		console.log("get website data fail!") ;
	}
}

// show home spot screen
function	showSpotData(records, startRecord, totalRecord) {
	var spot = document.getElementsByClassName("one_spot");
	for(var i=0 ; i < spotMaxItem ; i++) {
		if ((startRecord+i) >= totalRecord) {
			spot[i].style.display = "none";
		}
		else {
			spot[i].style.display = "block";
			// img
			var x = spot[i].firstElementChild;
			x.src = records[i+startRecord].Picture1;

			// spot_title
			x = x.nextElementSibling ;
			x.innerHTML = records[i+startRecord].Name ;
			// spot_discribe
			x = x.nextElementSibling ;
			x.innerHTML = records[i+startRecord].Description ;
			// spot_dollar + address
			x = x.nextElementSibling ;
			x.innerHTML = '<i class="fas fa-dollar-sign"></i>' + records[i+startRecord].Ticketinfo 
										+"  " +'<i class="fas fa-address-card"></i>' + records[i+startRecord].Add ;
			// spot_locate + opentime
			x = x.nextElementSibling ;
			x.innerHTML = '<i class="fas fa-map-marker-alt"></i>' + records[i+startRecord].Zone 
										+"  " +'<i class="far fa-calendar-alt"></i>' + records[i+startRecord].Opentime ;
		}
	}
}

// 2nd spot screen go back to 1st spot
function goHomePage()
{
	switchSpotMode(0);
}

// show shift button
function addShiftButtom(recordAll, startPage) {
	var board = document.getElementById("shift_block") ;
	var node ;
	var pageMax ;

	if (recordAll == 0) {
		pageMax = 1 ;
	}
	else {
		pageMax = recordAll/3 ;
	}

  pagePositionStart = startPage;
	if (board) {
		// clear + add left item
		node = document.createElement("button");
		board.innerHTML = "";
		node.innerHTML = "<<" ;
		node.setAttribute("class", "btn_shift");
		node.onclick = btnShift;
		board.appendChild(node) ;

		// add left ...
		if (startPage != 0) {
			node = document.createElement("button");
			node.innerHTML = "..." ;
			node.setAttribute("class", "btn_show");
			board.appendChild(node) ;			
		}

		// add index item
		for(var i=0 ; i < shiftMaxNo ; i++) {
			if ((startPage+i) < pageMax) {
				node = document.createElement("button");
				node.innerHTML = String(startPage+i+1) ;
				node.setAttribute("class", "btn_shift");		
				node.onclick = btnShift;
				board.appendChild(node) ;	
			}
		}

		// add right ...
		if (pageMax > (startPage+shiftMaxNo)) {
			node = document.createElement("button");
			node.innerHTML = "..." ;
			node.setAttribute("class", "btn_show");
			board.appendChild(node) ;
		}

		// add right item
		node = document.createElement("button");
		node.innerHTML = ">>" ;
		node.setAttribute("class", "btn_shift");
		node.onclick = btnShift;
		board.appendChild(node) ;
	}
}

// process shift bitton process 
function btnShift(event) {
	var inStr = event.toElement.innerText ;
	var inValue = Number(inStr);
	if (inStr == "<<") {
		if (pagePosition!=0) {
			pagePosition-- ;
			showSpotData(spotArry, pagePosition*spotMaxItem, recordTotal) ;
		}
	}
	else if (inStr == ">>") {
		if ((pagePosition+1)<(recordTotal/3)) {
			pagePosition++ ;
			showSpotData(spotArry, pagePosition*spotMaxItem, recordTotal) ;
		}
	}
	else {
		if (!isNaN(inValue)) {
			pagePosition = inValue-1;
			showSpotData(spotArry, pagePosition*spotMaxItem, recordTotal) ;
		}
	}

	if ((pagePosition<pagePositionStart) || (pagePosition>(pagePositionStart+shiftMaxNo-1))) {
		addShiftButtom(recordTotal,pagePosition);
	}
	else {
		addShiftButtom(recordTotal,pagePositionStart);
	}
	setButtonMark(pagePosition);
}

// set active shit button  
function setButtonMark(pagePosition) {
	var btn = document.getElementsByClassName("btn_shift") ;
	for (var i=0 ; i<btn.length ; i++) {
		if (btn[i].innerHTML == String(pagePosition+1)) {
			btn[i].style.color = "#FFFFFF";
			btn[i].style.backgroundColor = "#9013FE";
		}
	}
}

// show 2nd spot screen
function showOneSpot(event, index) {
	var winRight2 = document.getElementsByClassName("win_right2")[0];
	var upScreen = event.currentTarget.childNodes ;
	var curScreen = winRight2.childNodes ;
	var curScreenSub = curScreen[5].childNodes ;
	var spotIndex = pagePosition * spotMaxItem + index ;

	// show spot mode 0
	switchSpotMode(1);

  // title
    curScreen[1].innerHTML = "<span>Explore</span> / "+ spotArry[spotIndex].Name;
	// img
	curScreen[3].src = spotArry[spotIndex].Picture1;
  // title 2
	curScreenSub[1].innerHTML = spotArry[spotIndex].Name;
	// dollar + address
	curScreenSub[3].innerHTML = '<i class="fas fa-dollar-sign"></i>' + spotArry[spotIndex].Ticketinfo
																+" " + '<i class="fas fa-address-card"></i>' + spotArry[spotIndex].Add;
	// locate + opentime
	curScreenSub[7].innerHTML = '<i class="fas fa-map-marker-alt"></i>' + spotArry[spotIndex].Zone
																+" " + '<i class="far fa-calendar-alt"></i>' + spotArry[spotIndex].Opentime;
	// describe
	curScreenSub[11].innerHTML = spotArry[spotIndex].Description;
}

// switch mode0(3 spot) and mode1(on spot) screen
function switchSpotMode(modeIndex) {
	var winRight = document.getElementsByClassName("win_right")[0];
	var winRight2 = document.getElementsByClassName("win_right2")[0];
	var footerPoint = document.getElementsByClassName("footer")[0];
	var wrapPoint = document.getElementsByClassName("wrap")[0];
	var winLeft = document.getElementsByClassName("win_left")[0];
	if (modeIndex == 0) {
		winRight.style.display = "block";
		winRight2.style.display = "none" ;
		footerPoint.style.display = "block";
		wrapPoint.style.maxWidth = "1200px";
		/* RWD */
		if (screen.width > 768) {
			winLeft.style.marginLeft = "3.3%";
		}
		/* RWD */
		if (screen.width <= 414) {
			winLeft.style.display = "block";
		}
	}
	else {
		winRight.style.display = "none";
		winRight2.style.display = "block" ;
		footerPoint.style.display = "none";
		wrapPoint.style.maxWidth = "1000px";
		winLeft.style.marginLeft = "0px";
		/* RWD */
		if (screen.width <= 414) {
			winLeft.style.display = "none";
		}
	}
}

// show filter screen
function showFilterScreen() {
	var recordShow = document.getElementsByClassName("list_item")[0] ;

	// point to filter data
	spotArry = filterData ;
	recordTotal = filterData.length;

	// jump to 1at page
	pagePositionStart = 0;
	pagePosition = 0 ;
	// show spot 
	showSpotData(spotArry, 0, recordTotal) ;
	// show button
	addShiftButtom(recordTotal,pagePosition);
	setButtonMark(pagePosition);
	// show record No
	recordShow.innerHTML = "景點筆數 : " + recordTotal ;

	// show spot mode 0
	switchSpotMode(0);
}
