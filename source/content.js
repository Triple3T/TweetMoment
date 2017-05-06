var youcango = true;
function get_json(numz) {
	youcango = false;
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
	moment_lists = momentarray;
	var i=0;
	const dropdown_openlist = document.querySelectorAll("div.dropdown-menu.is-autoCentered")[1]; //드롭다운 메뉴 찾기
	const moment_menu = document.querySelectorAll(".MomentCurationMenuItem"); //모멘트에 추가/삭제하는 버튼 찾기
	var listing_moment_menus = '';
	for (i=0;i<moment_lists[0].length;i++) {
		//push moment menus
		var plus_A = '<li class="MomentCurationMenuItem " created="true" data-moment-id="'+moment_lists[0][i]+'">';
		var minus_A = '<li class="MomentCurationMenuItem is-member " data-moment-id="'+moment_lists[0][i]+'">';
		var default_B = '<button type="button" class="dropdown-link" title="'+moment_lists[1][i]+'">';
		var default_subA = '<span class="MomentCurationMenuItem-addText">'+moment_lists[1][i]+'에 추가하기</span>';
		var default_subB = '<span class="MomentCurationMenuItem-removeText">'+moment_lists[1][i]+'에서 삭제하기</span>';
		var default_B_close = '</button>';
		var default_A_close = '</li>';
		listing_moment_menus += plus_A + default_B + default_subA + default_subB + default_B_close + default_A_close;
		listing_moment_menus += minus_A + default_B + default_subA + default_subB + default_B_close + default_A_close;
	}
	
	var momentmenu_list_df = dropdown_openlist.querySelector("ul").querySelectorAll("li.MomentCurationMenuItem");
	if (momentmenu_list_df.length<1) {
		youcango = true;
		return 0;
	}
	var momentmenu_d=[];
	for (i=0;i<parseInt(momentmenu_list_df.length);i++) {
		if (momentmenu_list_df[i].attributes.created === undefined) {
				momentmenu_d[momentmenu_d.length] = i;
		}
	}
	if (momentmenu_d.length < 1) {
		youcango=true;
		return 0;
	}
	var firstmoment = momentmenu_list_df[momentmenu_d[0]];
	if (firstmoment === undefined) {
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
		if (mutationRecord.type == 'childList') {
			console.log(mutationRecord.type);
			if (document.querySelectorAll(".MomentCurationMenuItem").length > 0 &&
			document.querySelectorAll(".MomentCurationMenuItem").length < 3 && youcango) {
				get_json(document.querySelectorAll(".MomentCurationMenuItem").length);
				//
			}
		}
	});
}
