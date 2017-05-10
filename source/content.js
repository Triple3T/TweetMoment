/*var target=undefined;
document.addEventListener('click', function(e) {
    e = e || window.event;
	target = e.target || e.srcElement;
	console.log(target);
}, false);
*/
var youcango = true;
function get_json() {
	console.log("get_json func running...")
	var request = new XMLHttpRequest();
	var moment_id_list = [];
	var moment_title_list = [];
	const moment_list_json_url = 'https://twitter.com/i/moments/list_user_moments/dialog'; //니가 만든 모멘트 전부를 찾아준다
	request.open('GET', moment_list_json_url, true);
	request.send(null);
	var moment_list_p;
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			moment_list_json = JSON.parse(request.responseText);
			moment_list_p = JSON.stringify(moment_list_json.moment_map).split('"');
			var i=0;
			for (i=1;i<moment_list_p.length;i+=8) {
				moment_id_list.push(moment_list_p[i]);
				moment_title_list.push(moment_list_p[i+4].replace(/&quot;/gi,'"'));
			}
			moment_tool([moment_id_list, moment_title_list]);
		}
	}
}

function moment_tool(momentarray) {
	console.log("moment_tool func running...");
	moment_lists = momentarray;
	var i=0;
	var dropdown_openlist;
	var dropdown_all_lists = document.querySelectorAll("div.dropdown-menu.is-autoCentered");
	var realindex = -1;
	for (i=0;i<dropdown_all_lists.length;i++) {
		if (dropdown_all_lists[i].querySelector("ul").getAttribute("aria-hidden") == "false") {
			realindex = i;
			break;
		}
	}
	if (realindex<0) {
		console.log("no desired ul.");
		youcango = true;
		return 0;
	}
	dropdown_openlist = dropdown_all_lists[realindex].querySelector("ul");
	//리스팅 텍스트
	var listing_moment_menus = '';
	for (i=0;i<moment_lists[0].length;i++) {
		//push moment menus
		var plus_A = '<li class="MomentCurationMenuItem ___created" created="true" data-moment-id="'+moment_lists[0][i]+'">';
		var minus_A = '<li class="MomentCurationMenuItem is-member ___created" created="true" data-moment-id="'+moment_lists[0][i]+'">';
		var default_B = '<button type="button" class="dropdown-link" title="'+moment_lists[1][i]+'">';
		var default_subA = '<span class="MomentCurationMenuItem-addText">'+moment_lists[1][i]+'에 추가하기</span>';
		var default_subB = '<span class="MomentCurationMenuItem-removeText">'+moment_lists[1][i]+'에서 삭제하기</span>';
		var default_B_close = '</button>';
		var default_A_close = '</li>';
		listing_moment_menus += plus_A + default_B + default_subA + default_subB + default_B_close + default_A_close;
		listing_moment_menus += minus_A + default_B + default_subA + default_subB + default_B_close + default_A_close;
	}
	//listing moment menus - READY!!
	
	//드롭다운 메뉴의 모멘트 메뉴를 전부 선택
	var momentmenu_list_df = dropdown_openlist.querySelectorAll("li.MomentCurationMenuItem");//모멘트에 추가/삭제하는 버튼 찾기
	//하나도 없으면 트리거를 돌리고 이스케이프
	if (momentmenu_list_df.length<1) {
		console.log("no moment menu.");
		youcango = true;
		return 0;
	}
	//있으면?
	var momentmenu_d=[];
	for (i=0;i<parseInt(momentmenu_list_df.length);i++) {
		//created 어트리뷰트가 언디파인드(기본 생성된 메뉴)일 경우에만 인덱스를 저장
		if (momentmenu_list_df[i].attributes.created === undefined) {
			momentmenu_d[momentmenu_d.length] = i;
		}
	}
	//만약 기본 생성 메뉴가 없다면 이스케이프
	if (momentmenu_d.length < 1) {
		console.log("no new moment menu detected.");
		youcango=true;
		return 0;
	}
	//혹시 몰라서
	var firstmoment = momentmenu_list_df[momentmenu_d[0]];
	if (firstmoment === undefined) {
		console.log("no moment menu.");
		youcango =true;
		return 0;
	}
	var secondmoment = momentmenu_list_df.length<1?undefined:momentmenu_list_df[momentmenu_d[1]];
	
	if (secondmoment !== undefined) {
		momentmenu_list_df.forEach(function deletedown(value,index) {
			if (index===momentmenu_d[0]) {
				value.outerHTML = listing_moment_menus;
			} else {
				value.outerHTML = '';
			}
			secondmoment = undefined;
		});
	}
	console.log("moment menu successfully expaned.");
	youcango = true;
}

var observerObject = new MutationObserver(mutationObjectCallback);
observerObject.observe(document, {
	attributes: true,
	attributeFilter: ["id", "class"],
	childList: true,
	subtree: true
});
function mutationObjectCallback(mutationRecordsList) {
	//console.log("mutationObjectCallback invoked.");
	mutationRecordsList.forEach(function(mutationRecord) {
		if (mutationRecord.type == 'childList'
		&& mutationRecord.addedNodes.length >= 2
		&& youcango
		&& mutationRecord.addedNodes[1].tagName == 'LI') {
			youcango = false;
			get_json();
		}
	});
}