var targetcolors = []
var guessColors = []
var roundScores = []
var currentround = 0
var difficulty = 0
var hue = 0
var sat = 0.5
var countdowntimer = null

var isDraggingHue = false
var isDraggingSat = false
var currentGuessrgb = {r: 0, g: 0, b: 0}

var startbtn = document.getElementById("startBtn")
var screenstart = document.getElementById("screenStart")
var screenMem = document.getElementById("screenMemorize")
var screenguess = document.getElementById("screenGuess")
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
