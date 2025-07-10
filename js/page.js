// bind functionality to processing buttons
document.addEventListener("DOMContentLoaded", () => {
    let buttons = document.getElementsByClassName("Button");
    for (let idx = 0; idx < buttons.length; idx++) {
      buttons[idx].onclick = (event) => {
		    runExample(event.target.getAttribute("data-ref"));
      };
    }
});

// set controls for examples rendering
let processCtrl = {
	1: true,
  2: true,
	3: true,
	4: true,
	5: true,
	6: true
};

//initiate templating factory
let factory = new TemplatingFactory();

//set example data
let exampleData = {
	//example 1 data
	example1: {
		item01: {
			title: "Hello World!",
			text: "my templating engine",
			color: "black"
		}
	},
  //example 2 data
  example2: [
		{
			title: "Hello World!!",
			text: "my templating engine",
			color: "green"
		}
 ],
	//example 3 data
	example3: {
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
	example4: {
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
  example5: {
		par: {
			color: "blue",
			content: [
				{text: "This example shows how text with inner formatting like "},
				{text: "bold", type: "emph"},
				{text: ", "},
				{text: "italic", type: "slant"},
				{text: ", "},
				{text: "link", url: "#", type: "link"},
			  {text: " and others can be processed."},
        {type: 'lbr'},
        {type: 'lbr'},
        {text: "And don't forget: "},
        {text: "This is data driven!", type: "emph"}
      ]
		}
	},
  //example 6 data
  example6: {
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
  }
};

// procesing specified example
function runExample(idx) {
  if (processCtrl[idx]) {
			factory.renderRoot(document.getElementById(`Root${idx}`),exampleData[`example${idx}`]);
			processCtrl[idx] = false;
	}
}
