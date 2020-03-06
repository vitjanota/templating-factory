// bind functionality to processing buttons
$(document).ready(function(){
    $(".Button").click(function(event) {
		runExample($(this).attr("data-ref"));
    });
});

var factory = new templatingFactory(), //initiate templating factory
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
	};

// start procesing for specified example
function runExample(idx) {
	switch (idx) {
		case "01":
			factory.renderRoot($("#Root01"),exampleData01);
			break;
		case "02":
			factory.renderRoot($("#Root02"),exampleData02);
			break;
		case "03":
			factory.renderRoot($("#Root03"),exampleData03);
			break;
	}

}
