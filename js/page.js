var processCtrl = {
	1: true,
	2: true,
	3: true,
	4: true
};

// bind functionality to processing buttons
$(document).ready(function(){
    $(".Button").click(function(event) {
		runExample($(this).attr("data-ref"));
    });
});

var factory = new TemplatingFactory(), //initiate templating factory
	//example 1 data
	exampleData01 = {
		item01: {
			title: "Hello World!",
			text: "my templating engine",
			color: "black"
		}
	},
	//example 2 data
	exampleData02 = {
		item01: {
			title: "Fruits",
			text: "Among fruits belong",
			color: "red",
			list: {
				listitem01:{
					content:"apple",
					color: "#e0c900"
				},
				listitem02:{
					content:"orange",
					color: "orange"
				}
			}
		},
		item02: {
			title: "Vegetables",
			text: "Among vegetables belong",
			color: "green",
			list: {
				listitem01:{
					content:"carrot",
					color: "orange"
				},
				listitem02:{
					content:"tomato",
					color: "red"
				},
				listitem03:{
					content:"cucumber",
					color: "green"
				}
			}
		}
	},
	//example 3 data
	exampleData03 = {
		item01: {
			title: "Apple",
			color: "red"
		},
		item02: {
			title: "Pear",
			color: "green"
		},
		item03: {
			title: "Plum",
			color: "blue",
			type: "refrigerate"
		},
		item04: {
			title: "Orange",
			color: "orange"
		}
	},
	//example 4 data
	exampleData04 = {
		item01: {
			color: "blue",
			text: {
				text01: {content: "This example shows how text with inner formatting like "},
				text02: {content: "bold", type: "emph"},
				text03: {content: ", "},
				text04: {content: "italic", type: "slant"},
				text05: {content: ", "},
				text06: {url: "#", content: "link", type: "link"},
				text07: {content: " and others can be processed."}
			}
		}
	};

// start procesing for specified example
function runExample(idx) {
	switch (idx) {
		case "1":
			if (processCtrl[idx]) {
				factory.renderRoot($("#Root01"),exampleData01);
				processCtrl[idx] = false;
			}
			break;
		case "2":
			if (processCtrl[idx]) {
				factory.renderRoot($("#Root02"),exampleData02);
				processCtrl[idx] = false;
			}
			break;
		case "3":
			if (processCtrl[idx]) {
				factory.renderRoot($("#Root03"),exampleData03);
				processCtrl[idx] = false;
			}
			break;
		case "4":
			if (processCtrl[idx]) {
				factory.renderRoot($("#Root04"),exampleData04);
				processCtrl[idx] = false;
			}
			break;
	}
}
