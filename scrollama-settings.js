// using d3 for convenience
var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
// 1. update height of step elements
var stepH = Math.floor(window.innerHeight * 0.75);
step.style("height", stepH + "px");

var figureHeight = window.innerHeight / 1.5;
var figureMarginTop = (window.innerHeight - figureHeight) / 2;

figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");

// 3. tell scrollama to update new element dimensions
scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {

console.log(response);
// response = { element, direction, index }
let currentIndex = response.index;
let currentDirection = response.direction;

// add color to current step only
step.classed("is-active", function(d, i) {
    return i === currentIndex;
});

// update graphic based on step
// figure.select("p").text("Graph " + (response.index + 1));
switch(currentIndex) {
    case 0:
        // scatterSpain()
        // figure.select("p").text(1);
        if(currentDirection === 'up'){
            crawl_chart();
        }
        break;
    case 1:
        // scatterPeru();
        // figure.select("p").text(2);
        income_chart();
        break;
    case 2:
        // scatterMoldova()
        // figure.select("p").text(3);
        age_chart();
        break;
    case 3:
        // scatterMoldova()
        // figure.select("p").text(4);
        growth_chart();
        break;
    default:
        // figure.select("p").text(0);
        crawl_chart();
        break;
}
}

function setupStickyfill() {
d3.selectAll(".sticky").each(function() {
    Stickyfill.add(this);
});
}

function init() {
setupStickyfill();

// 1. force a resize on load to ensure proper dimensions are sent to scrollama
handleResize();

// 2. setup the scroller passing options
// 		this will also initialize trigger observations
// 3. bind scrollama event handlers (this can be chained like below)
scroller
    .setup({
    step: "#scrolly article .step",
    offset: 0.33,
    debug: false
    })
    .onStepEnter(handleStepEnter);

// setup resize event
window.addEventListener("resize", handleResize);
}

// kick things off
init();
