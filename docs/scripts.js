

console.log("scripts.js loaded...");
let DEFAULT_SPEED = 20;
const newline = "<br><br>";

function loadHeader(text, speed = DEFAULT_SPEED) {
    const target = document.getElementById("typing-effect");
    if(!target) {
        return;
    }

    let idx = 0;
    function typeWriting() {
        if(idx <= text.length) {
          target.innerHTML = text.slice(0, idx);
          idx++;
          setTimeout(typeWriting, speed);
        }
    }
    typeWriting();
    
}

