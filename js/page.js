var processCtrl = {
	1: true,
  2: true,
	3: true,
	4: true,
	5: true,
	6: true
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
  exampleData02 = [
		{
			title: "Hello World!!",
			text: "my templating engine",
			color: "green"
		}
 ],
	//example 3 data
	exampleData03 = {
		item01: {
			title: "Fruits",
			text: "Among fruits belong",
			color: "red",
			list: [
				{
					content:"apple",
					color: "#e0c900"
				},
				{
					content:"orange",
					color: "orange"
				}
      ]
		},
		item02: {
			title: "Vegetables",
			text: "Among vegetables belong",
			color: "green",
			list: [
				{
					content:"carrot",
					color: "orange"
				},
				{
					content:"tomato",
					color: "red"
				},
				{
					content:"cucumber",
					color: "green"
				}
      ]
		}
	},
	//example 4 data
	exampleData04 = {
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
	//example 5 data
  exampleData05 = {
		par: {
			color: "blue",
			content: [
				{text: "This example shows how text with inner formatting like "},
				{text: "bold", type: "emph"},
				{text: ", "},
				{text: "italic", type: "slant"},
				{text: ", "},
				{text: "link", url: "#", type: "link"},
			  {text: " and others can be processed."}
      ]
		}
	},
  //example 6 data
  exampleData06 = {
    table: {
      header: [
        {
          cells: [
            {content: 'header 1'},
            {content: 'header 2'}
          ]
        }
      ],
      body: [
        {
          cells: [
            {content: 'cell 1.1'},
            {content: 'cell 1.2'}
          ]
        },
        {
          cells: [
            {content: 'cell 2.1'},
            {content: 'cell 2.2'}
          ]
        }
      ],
      footer: [
        {
          cells: [
            {content: 'footer 1'},
            {content: 'footer 2'}
          ]
        }
      ]
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
    case "5":
			if (processCtrl[idx]) {
				factory.renderRoot($("#Root05"),exampleData05);
				processCtrl[idx] = false;
			}
			break;
    case "6":
			if (processCtrl[idx]) {
				factory.renderRoot($("#Root06"),exampleData06);
				processCtrl[idx] = false;
			}
			break;
	}
}
