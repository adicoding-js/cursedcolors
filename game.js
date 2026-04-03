var targetcolors = []
var guessColors = []
var roundScores = []
var currentround = 0
var difficulty = 0
var hue = 0
var sat = 0.5
var countdowntimer = null

var hue = 0;
var sat = 50;
var light = 50;
var guessR = 128, guessG = 128, guessB = 128;

var isDraggingHue = false
var isDraggingSat = false
var currentGuessrgb = {r: 0, g: 0, b: 0}

var startbtn = document.getElementById("startBtn")
var screenstart = document.getElementById("screenStart")
var screenMem = document.getElementById("screenMemorize")
var screenguess = document.getElementById("screenGuess")
var screenResult = document.getElementById("screenRoundResult");
var screenEnd = document.getElementById("screenEnd");
  var card = document.getElementById("mainCard")

var hueStrip = document.getElementById("hueStrip")
var satBriStrip = document.getElementById("satBriStrip")
var hueDot = document.getElementById("hueDot")
var satBriDot = document.getElementById("satBriDot")
var livePreview = document.getElementById("livePreview")
var submitbtn = document.getElementById("submitGuessBtn")
var screenResult = document.getElementById("screenRoundResult")

startbtn.onclick = function() {
var radius = document.getElementsByName("diff")
  for(var i=0; i<radius.length; i++) {
        if(radius[i].checked) {
            difficulty = radius[i].value
        }
  }

screenstart.classList.remove("active")
    startRound()
}
function startRound() {
    screenMem.classList.add("active")

    document.getElementById("roundIndMem").innerHTML = (currentround+1) + "/5"
    document.getElementById("roundIndGuess").innerHTML = (currentround + 1) + "/5"


var r = Math.floor(Math.random() * 255)
var g = Math.floor(Math.random() * 255)
var b = Math.floor(Math.random() * 255)

targetcolors.push({r: r, g: g, b: b})

card.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")"

var time = 5
if(difficulty == "hard") {
    time =2
}

document.getElementById("countdown").innerHTML = time

countdowntimer = setInterval(function() {
time = time -1
 document.getElementById("countdown").innerHTML = time

if(time <= 0 ) {
    clearInterval(countdowntimer);
    card.style.backgroundColor = "#0f0f0f"
    screenMem.classList.remove("active")
    screenguess.classList.add("active")
}
}, 1000)
}

function updatePicker(e, type) {
    var rect = (type == "hue" ? hueStrip : satBriStrip).getBoundingClientRect();
    var y = (e.clientY || e.touches[0].clientY) -rect.top;
   var percent = Math.max(0, Math.min(1,y/rect.height));

if(type == "hue") {
    hue = percent * 360;
    document.getElementById("hueDot").style.top = (percent * 100) + "%";
    satBriStrip.style.background = "linear-gradient(to bottom, #ffffff, hsl(" + hue + ", 100%, 50%), #000000)";
} else { 
if(percent < 0.5) {
    sat = percent * 200;
    light = 100 - (percent * 100);
} else {
    sat = (1-percent) * 200;
    light = 100-( percent * 100);
}
    document.getElementById("satBriDot").style.top = (percent * 100) + "%";
}
var rbg = hslToRgb(hue, sat, light);
guessR = rbg.r; guessG = rbg.g; guessB = rbg.b;
document.getElementById("livePreview").style.background = "rgb("+guessR+","+guessG+","+guessB+")";
}

hueStrip.onmousedown = function() {window.onmousemove = (e) => updatePicker(e, "hue")};
satBriStrip.onmousedown = function() {window.onmousemove = (e) => updatePicker(e, "sat")};
window.onmouseup = function() {window.onmousemove = null;};

function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2, r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return { r: Math.round((r+m)*255), g: Math.round((g+m)*255), b: Math.round((b+m)*255) };
}

submitbtn.onclick = function() {
    var target = targetcolors[currentround];
    var score = calcScore(target.r,target.g,target.b,guessR,guessG,guessB);  
    roundScores.push(score);
    guessColors.push({r:guessR, g: guessG, b: guessB});

    screenguess.classList.remove("active");
    screenResult.classList.add("active");

document.getElementById("targetHalf").style.backgroundColor = "rgb("+target.r+","+target.g+","+target.b+")";
    document.getElementById("guessHalf").style.backgroundColor = "rgb("+guessR+","+guessG+","+guessB+")";
    document.getElementById("flashScore").innerHTML = score + "%";

    setTimeout(function() {
    screenResult.classList.remove("active");
    currentround++;
    if(currentround < 5) {
        startRound();
    } else {
        showEndScreen();
    }
    }, 2000)
}

function calcScore(tr,tg,gr,tb,gg,gb){
    var rm = (tr + gr) / 2;
    var dR = tr - gr;
    var dG = tg - gg;
    var dB = tb - gb;

var weightR = 2 + (rm / 256);
var weightG = 4.0;
var weightB = 2+ ((225 - rm) / 256);

var dist = Math.sqrt((weightR * dR * dR) + (weightG * dG * dG) + (weightB * dB * dB));
var maxDist = 764.83;
return Math.max(0, Math.round((1-dist / maxDist) * 100));

}

function showEndScreen() {
    screenEnd.classList.add("active");
    var sum = 0;
    var grid = document.getElementById("summaryGrid");
    grid.innerHTML = "";

    roundScores.forEach((s,i) => {
    sum += s;
    var item = document.getElementById("div");
    item.innerHTML = `
            <div style="display:flex; gap:2px; margin-bottom:5px">
                <div style="width:30px; height:30px; border-radius:4px; background:rgb(${targetcolors[i].r},${targetcolors[i].g},${targetcolors[i].b})"></div>
                <div style="width:30px; height:30px; border-radius:4px; background:rgb(${guessColors[i].r},${guessColors[i].g},${guessColors[i].b})"></div>
            </div>
            <div style="font-size:10px; font-weight:bold">${s}%</div>
        `;
    grid.appendChild(item);
    });
document.getElementById("finalScoreText").innerHTML = Math.round(sum/5) + "%";
}

document.getElementById("playAgainBtn").onclick = () => location.reload();
satBriStrip.style.background = "linear-gradient(to bottom, #ffffff, hsl(0, 100%, 50%), #000000)";