var youcango = true;
var l_max = 3;
function get_json(numz) {
	l_max = (numz===1?3:2);
	youcango = false;
	var request = new XMLHttpRequest();
	const moment_list_json_url = 'https://twitter.com/i/moments/list_user_moments/dialog'; //니가 만든 모멘트 전부를 찾아준다
	request.open('GET', moment_list_json_url, true);
	request.send(null);
	var moment_list_p;
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			moment_list_json = JSON.parse(request.responseText);
			moment_list_p = JSON.stringify(moment_list_json.moment_map).split('"');
			var moment_id_list = [];
			var moment_title_list = [];
			var i=0;
			for (i=1;i<moment_list_p.length;i+=8) {
				moment_id_list.push(moment_list_p[i]);
				moment_title_list.push(moment_list_p[i+4].replace(/&quot;/gi,'"'));
			}
		}
		moment_tool([moment_id_list, moment_title_list]);
	}
}

function moment_tool(momentarray) {
	moment_lists = momentarray;
	const dropdown_openlist = document.querySelectorAll("div.dropdown-menu.is-autoCentered")[1]; //드롭다운 메뉴 찾기
	const moment_menu = document.querySelectorAll(".MomentCurationMenuItem"); //모멘트에 추가/삭제하는 버튼 찾기
	
	var firstmoment = dropdown_openlist.querySelector("ul").querySelectorAll("li.MomentCurationMenuItem")[0];
	var secondmoment = dropdown_openlist.querySelector("ul").querySelectorAll("li.MomentCurationMenuItem").length<1?undefined:dropdown_openlist.querySelector("ul").querySelectorAll("li.MomentCurationMenuItem")[1];
	var i=0
	if (secondmoment !== undefined) {
		dropdown_openlist.querySelector("ul").querySelectorAll("li.MomentCurationMenuItem").forEach(function deletedown(value,index) {
			value.outerHTML = (index===0?value.outerHTML:'');
		});
	}
	secondmoment = undefined;
	var listing_moment_menus = "";
	for (i=0;i<moment_lists[0].length;i++) {
		//push moment menus
		var plus_A = '<li class="MomentCurationMenuItem " data-moment-id="'+moment_lists[0][i]+'">';
		var minus_A = '<li class="MomentCurationMenuItem is-member " data-moment-id="'+moment_lists[0][i]+'">';
		var default_B = '<button type="button" class="dropdown-link" title="'+moment_lists[1][i]+'">';
		var default_subA = '<span class="MomentCurationMenuItem-addText">'+moment_lists[1][i]+'에 추가하기</span>';
		var default_subB = '<span class="MomentCurationMenuItem-removeText">'+moment_lists[1][i]+'에서 삭제하기</span>';
		var default_B_close = '</button>';
		var default_A_close = '</li>';
		listing_moment_menus += plus_A + default_B + default_subA + default_subB + default_B_close + default_A_close;
		listing_moment_menus += minus_A + default_B + default_subA + default_subB + default_B_close + default_A_close;
	}
	firstmoment.outerHTML = listing_moment_menus;
	youcango = true;
}

targetObject = document.querySelectorAll("div.dropdown-menu.is-autoCentered")[1];
var observerObject = new MutationObserver(mutationObjectCallback);
observerObject.observe(targetObject, {
	attributes: true,
	attributeFilter: ["id", "class"],
	childList: true,
	subtree: true
});
function mutationObjectCallback(mutationRecordsList) {
	console.log("mutationObjectCallback invoked.");
	
	mutationRecordsList.forEach(function(mutationRecord) {
		console.log(mutationRecord.type);
		if (mutationRecord.type == 'childList') {
			if (document.querySelectorAll(".MomentCurationMenuItem").length > 0 &&
			document.querySelectorAll(".MomentCurationMenuItem").length < l_max && youcango) {
				get_json(document.querySelectorAll(".MomentCurationMenuItem").length);
				//
			}
		}
	});
}
