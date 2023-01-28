const petsQualities = {
  dog: ["loyal", "energetic", "social", "intelligent", "caring"],
  cat: ["independent", "lazy", "little", "caring"],
  fish: ["little", "magical", "lazy", "gentle"],
  bird: ["little", "intelligent", "gentle", "social"],
  rabbit: ["gentle", "social", "little"],
  horse: ["magical", "energetic", "loyal"],
};
const menuIcon = document.querySelector(".menu-icon");
const findMatch = document.querySelector(".find");
const benefits = document.querySelector("#benefits");
const reviewsBox = document.querySelector("#reviews");
const funFact = document.querySelector("#fun-fact");
const btnsUnavailable = document.querySelectorAll(".unavailable");

// Start background animation on window load
window.onload = () => setInterval(modifyImages, 6000);

// Open and close navbar
menuIcon.addEventListener("click", () =>{
  menuIcon.classList.toggle('show-nav');
  document.querySelector("nav").classList.toggle("show")
});

// Location onclick scrolls to contact
document.querySelector(".location").addEventListener("click", () => {
  window.scrollTo(0, document.querySelector(".contact-box").offsetTop);
});

// Find best pet that matches user's perferences
findMatch.addEventListener("click", findAPet);

// Trigger these elements animations when inView
observeElement(benefits);
observeElement(funFact);
observeElement(reviewsBox);

// Show error message on some selected btns
btnsUnavailable.forEach((e) => {
  e.addEventListener("click", (e) => {
    e.preventDefault();
    showNotif();
  });
});

let count = 0;
function modifyImages() {
  let bgs = [...document.querySelectorAll(".bgs")];
  count++;
  bgs.forEach((e) => e.classList.remove("previous"));
  bgs[count - 1].classList.replace("current", "previous");
  count = count >= bgs.length ? 0 : count;
  bgs[count].classList.add("current");
}

(function petQualitiesOptions() {
  const qualities = document.querySelectorAll(".items");
  qualities.forEach((each) => {
    each.addEventListener("click", (e) => {
      document.querySelector(".imgs-box").classList.remove("loading");
      const selected = document.querySelectorAll(".selected").length;
      const unselectable = each.classList.contains("selected");
      if (selected < 3 || unselectable) each.classList.toggle("selected");
    });
  });
})();

function findAPet() {
  document.querySelector(".imgs-box").classList.add("loading");
  let selectedOPtions = document.querySelectorAll(".selected");
  selectedOPtions = [...selectedOPtions].map((e) => e.innerHTML.toLowerCase());
  let spiritAnimal = recommendedPet(selectedOPtions);
  const newIMG = document.querySelector(".new-img");
  newIMG.setAttribute("src", `img/2/${spiritAnimal}.webp`);
}

function recommendedPet(options) {
  let bestPets = [];
  let bestValue = null;

  for (const [pet, qualities] of Object.entries(petsQualities)) {
    const matches = qualities.filter((v) => options.includes(v)).length;
    if (bestValue === null || matches >= bestValue) {
      if (matches > bestValue) bestPets = [];
      bestPets.push(pet);
      bestValue = matches;
    }
  }

  const bestPet = bestPets[Math.floor(Math.random() * bestPets.length)];
  return bestPet;
}

function textAnimation() {
  document.querySelector(".benefits").classList.add("start");

  let words = [...document.querySelectorAll(".benefit")];
  let currIndex = 0;
  let wordsContent = words.map((e) => {
    let letters = e.innerHTML.split("").map((each) => {
      let letter = document.createElement("span");
      letter.classList.add("letter");
      letter.innerHTML = each;
      e.append(letter);
      return letter;
    });
    e.removeChild(e.firstChild);
    return letters;
  });

  function changeWord() {
    const currWord = wordsContent[currIndex];
    const newWord =
      currIndex === words.length - 1? wordsContent[0] : wordsContent[currIndex + 1];

    currWord.forEach((e, i) => {
      setTimeout(() => {
        currWord[i].className = "letter letter-out";
      }, i * newWord.length);
    });

    newWord.forEach((e, i) => {
      newWord[i].className = "letter letter-behind";
      newWord[i].parentElement.style.opacity = 1;

      setTimeout(() => {
        newWord[i].className = "letter letter-in";
      }, 1000 + i * newWord.length);
    });

    currIndex = currIndex >= words.length - 1 ? 0 : ++currIndex;
  }

  setInterval(changeWord, 4000);
}

function autoScroll(elem, scrollSpeed = 1, infinite = false) {
  let scrollDirection = 1;
  let isTouched = false;
  let isRunning = true;

  elem.addEventListener("pointerdown", () => (isTouched = true));
  elem.addEventListener("pointerup", () => (isTouched = false));
  elem.addEventListener("pointercancel", () => (isTouched = false));
  elem.addEventListener("touchstart", () => (isRunning = false));
  elem.addEventListener("touchend", () => {
    isRunning = true;
    requestAnimationFrame(scroll);
  });
  elem.addEventListener("touchcancel", () => {
    isRunning = true;
    requestAnimationFrame(scroll);
  });

  function scroll() {
    if (!isTouched) {
      scrollDirection === 1
        ? (elem.scrollLeft += scrollSpeed)
        : (elem.scrollLeft -= scrollSpeed);

      //used Math.ceil() due to browser rounding incosistencies 
      if (Math.ceil(elem.scrollLeft) >= elem.scrollWidth - elem.clientWidth && infinite) {
        scrollDirection = -1;
      } else if (Math.ceil(elem.scrollLeft) <= 0 && infinite) {
        scrollDirection = 1;
      }
    }

    if (isRunning) requestAnimationFrame(scroll);
  }

  requestAnimationFrame(scroll);
}

function observeElement(elem) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        switch (entry.target.id) {
          case "benefits":
            textAnimation();
            break;
          case "fun-fact":
            autoScroll(elem, 1.9);
            break;
          case "reviews":
            autoScroll(elem, 1, true);
            break;
          default:
            break;
        }

        observer.unobserve(elem);
      }
    });
  });

  observer.observe(elem);
}

function showNotif() {
  const notifs = document.querySelectorAll(".notif");
  const prevNotif = notifs[notifs.length - 1];
  const prevNotifPosition = prevNotif
    ? prevNotif.offsetTop + prevNotif.offsetHeight
    : 0;
  const notif = createNotif();
  notif.style.top = `${prevNotifPosition + 10}px`;
  setTimeout(() => notif.classList.add("show"));
  setTimeout(() => {
    notif.classList.remove("show");
    notif.ontransitionend = () => notif.remove();
  }, 2500);

  function createNotif() {
    const div = document.createElement("div");
    const para = document.createElement("p");
    div.className = "notif";
    para.className = "notif-info";
    para.innerHTML = `Server's on vacation!`;
    div.appendChild(para);
    document.body.appendChild(div);
    return div;
  }
}
