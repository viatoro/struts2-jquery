/*! jQuery UI - v1.10.4 - 2014-04-02
 * http://jqueryui.com
 * Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */

jQuery(function(e) {
	e.datepicker.regional.th = {
		closeText : "ปิด",
		prevText : "&#xAB;&#xA0;ย้อน",
		nextText : "ถัดไป&#xA0;&#xBB;",
		currentText : "วันนี้",
		monthNames : [ "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม",
				"มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม",
				"พฤศจิกายน", "ธันวาคม" ],
		monthNamesShort : [ "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
				"ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค." ],
		dayNames : [ "อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์",
				"เสาร์" ],
		dayNamesShort : [ "อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส." ],
		dayNamesMin : [ "อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส." ],
		weekHeader : "Wk",
		dateFormat : "dd/mm/yy",
		firstDay : 0,
		isRTL : !1,
		showMonthAfterYear : !1,
		yearSuffix : "",
		isBuddhist: true
	}, e.datepicker.setDefaults(e.datepicker.regional.th)
});