let DEFAULT_SPEED = 20;
const newline = "<br>";

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

function animateSlideshow() {
    const prefix = "/static/coverphotos/";
        const imageArray = ["mark_providence_photo.jpg", "mark_acadia_photo.jpg",  "mark_bern_photo.jpg"];
        const length = imageArray.length;
        const imageElement = document.getElementById("cover-image");
        
        let index = 0;

        function changeImage() {
            //fade out the current image
            imageElement.style.opacity = '0';
            
            //after the fade out completes, change the image
            setTimeout(() => {
                imageElement.src = prefix + imageArray[index];
                index = (index + 1) % length;
                
                //preloading the image to avoid any flicker
                const img = new Image();
                img.onload = () => {
                    //once its loaded fade it in
                    imageElement.style.opacity = '1';
                };
                img.src = imageElement.src;
                
            }, 500); 
        }

        //initialize with first image
        function initializeSlideshow() {
            imageElement.src = prefix + imageArray[index];
            index = (index + 1) % length;
            
            //fade in the first image once it loads
            imageElement.onload = () => {
                imageElement.style.opacity = '1';
            };
        }

        
        initializeSlideshow();
        setInterval(changeImage, 60000);
}

function animateLoading(div) {
    window.addEventListener("load", () => {
    const section = document.getElementById(div);
    section.classList.remove("opacity-0", "translate-y-5");
    section.classList.add("opacity-100", "translate-y-0");
  });
}
