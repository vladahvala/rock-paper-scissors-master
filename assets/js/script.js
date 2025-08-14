// Showing rules
const rulesBtn = document.getElementById('rules-btn');
const closeRulesBtn = document.getElementById('close-rules');
const rules = document.querySelector('.rules');

rulesBtn.addEventListener("click", () => {
  rules.style.visibility = 'visible'; 
  rules.classList.add('show');          
});

closeRulesBtn.addEventListener("click", () => {
  rules.classList.remove('show');       
  setTimeout(() => {
    rules.style.visibility = 'hidden';
  }, 200);
});



// Adding code for creating a game circle
function createCircle(data) {
  const circleBig = document.createElement('div');
  circleBig.className = `game-section__circle-big game-section__circle-big--${data.color} game-section__circle-big--play`;

  const circleSmall = document.createElement('div');
  circleSmall.className = 'game-section__circle-small';

  const img = document.createElement('img');
  img.src = data.iconSrc;
  img.alt = data.alt;
  img.className = 'game-section__icon-img game-section__icon-img--play';

  circleSmall.appendChild(img);
  circleBig.appendChild(circleSmall);

  return circleBig;
}

// Adding code for creating an empty circle
function createCircleEmpty() {
  const circleBigEmpty = document.createElement('div');
  circleBigEmpty.className = 'play-section__empty'; 
  return circleBigEmpty;
}


// Getting result of the game
function getResultByIcon(userCircle, houseCircle) {
  const user = userCircle.querySelector('img').alt.replace('-img', '');
  const house = houseCircle.querySelector('img').alt.replace('-img', '');

  if(user === house) return 'draw';

  if(
    (user === 'rock' && house === 'scissors') ||
    (user === 'scissors' && house === 'paper') ||
    (user === 'paper' && house === 'rock')
  ) return 'win';

  return 'lose';
}


const triangle = document.getElementById('bg-triangle');
const blueCircle = document.getElementById('blue-circle-game');
const yellowCircle = document.getElementById('yellow-circle-game');
const redCircle = document.getElementById('red-circle-game');


// Play again btn
const playAgainBtn = document.querySelector('.button--play-again');

playAgainBtn.addEventListener('click', () => {
  window.location.reload();
});



// Scoring
const scoreElement = document.querySelector('.text--score-num');

let score = parseInt(localStorage.getItem('score')) || 0;
scoreElement.textContent = score;

function updateScore(result) {
  if (result === 'win') score += 1;
  else if (result === 'lose') score = Math.max(0, score - 1); 
  localStorage.setItem('score', score);
  scoreElement.textContent = score;
}


function animatePick(circleElement, color) {

  // Creating an empty placeholder instead of circle, so flex-flow is fixed
  const rect = circleElement.getBoundingClientRect();
  const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    
  const placeholder = document.createElement('div');
  placeholder.style.width = (rect.width / remSize) + 'rem';
  placeholder.style.height = (rect.height / remSize) + 'rem';
  placeholder.style.display = 'inline-block';
    
  circleElement.parentNode.insertBefore(placeholder, circleElement);
  
  // All other (unpicked circles) and a triangle fade out
  [blueCircle, yellowCircle, redCircle].forEach(c => {
    if (c !== circleElement) {
      c.style.transition = 'opacity 0.5s ease';
      c.style.opacity = '0';
    }
  });
  triangle.style.transition = 'opacity 0.5s ease';
  triangle.style.opacity = '0';
  
  // Picked circle gets fixed and we get its position on the page
  circleElement.style.position = 'fixed';
  circleElement.style.left = rect.left / remSize + 'rem';
  circleElement.style.top = rect.top / remSize + 'rem';
  circleElement.style.zIndex = 12;
  circleElement.style.transition = 'all 1s ease';
  
  const icon = circleElement.querySelector('.game-section__icon-img');
  icon.style.transition = 'all 1s ease';
  
  requestAnimationFrame(() => {
    // Calculating coodinates for center positioning of the circle
    const vw = window.innerWidth/remSize;
    const vh = window.innerHeight/remSize;
    const newSize = 15;
    const newLeft = (vw - newSize) / 2;
    const newTop = (vh - newSize) / 2;
    const newIconSize = 6;
  
    // Moving the circle to the center
    circleElement.style.width = `${newSize}rem`;
    circleElement.style.height = `${newSize}rem`;
    circleElement.style.left = `${newLeft}rem`;
    circleElement.style.top = `${newTop}rem`;
    icon.style.height = `${newIconSize}rem`;
  
    setTimeout(() => {
      // Moving the circle to the left
      circleElement.style.transition = 'all 0.6s ease';
      circleElement.style.left = `${newLeft - 10.90625}rem`;
      circleElement.style.top = `${newTop + 7.125}rem`;
  
      setTimeout(() => {
        fetch('choice.json')
        .then(res => res.json())
        .then(data => {
          const gameSection = document.querySelector('.game-section');
          const playSection = document.querySelector('.play-section');

          const youPicked = document.querySelector('.play-section--you-picked');
          const youPickedText = document.getElementById('text-you-picked');

          const housePickedEmpty = document.querySelector('.play-section--house-picked-empty');
          const housePicked = document.querySelector('.play-section--house-picked');
          const housePickedText = document.getElementById('text-house-picked');
  
          // Inserting the player`s choice cirle into play section
          youPicked.innerHTML = '';
          youPicked.appendChild(circleElement);

          // Computer chooses circle
          const houseChoices = data.filter(i => i.owner === 'house');
          const houseChoice = houseChoices[Math.floor(Math.random() * houseChoices.length)];
  
          // Empty computer loading circle
          housePickedEmpty.innerHTML = '';
          const emptyCircle = createCircleEmpty();
          housePickedEmpty.appendChild(emptyCircle);
          housePickedEmpty.style.display = 'flex';

          // Showing play section
          playSection.style.display = 'flex';

          // Animation 
          requestAnimationFrame(() => {
            // for showing empty circle
            emptyCircle.style.opacity = '1';
            emptyCircle.style.transform = 'scale(1)';

            // for showing texts
            youPickedText.style.opacity = '1';
            youPickedText.style.transform = 'translateY(0)';

            housePickedText.style.opacity = '1';
            housePickedText.style.transform = 'translateY(0)';
          });

          // Showing computer`s choice crircle
          setTimeout(() => {
            emptyCircle.style.display = 'none';

            housePicked.innerHTML = '';
            const houseCircle = createCircle(houseChoice);
            housePicked.appendChild(houseCircle);

            housePicked.style.opacity = '0';
            housePicked.style.transform = 'scale(0.7)';
            housePicked.style.transition = 'opacity 0.6s ease-in, transform 0.6s ease-in';
            housePicked.style.display = 'flex';
  
            requestAnimationFrame(() => {
              housePicked.style.opacity = '1';
              housePicked.style.transform = 'scale(1)';
              });
          }, 1000);
  
          // Hiding game section
          gameSection.style.display = 'none';
  
          // Circle user`s choice position: fixed is removed
          circleElement.style.position = '';
          circleElement.style.left = '';
          circleElement.style.top = '';
          circleElement.style.transition = '';
          circleElement.style.zIndex = '';
          icon.style.transition = '';
          circleElement.style.pointerEvents = 'none';
  
          // Deleting placeholder
          placeholder.remove();

          // Moving circles and texts to different sides animation
          setTimeout(() => {
            const circlesSection = document.querySelector('.play-section__circles');
            const textsSection = document.querySelector('.play-section__picked');

            circlesSection.style.transition = 'column-gap 1.6s ease';
            circlesSection.style.columnGap = '22rem';

            textsSection.style.transition = 'column-gap 1.6s ease';
            textsSection.style.columnGap = '26rem';

            // Showing resuls 
            setTimeout(() => {
              const userCircle = circleElement;                 
              const houseCircle = housePicked.querySelector('.game-section__circle-big'); // <-- змінили тут
              const result = getResultByIcon(userCircle, houseCircle);

              // Scoring
              updateScore(result);

              const resultsText = document.querySelector('.play-section__results .text--result');

              const resultsSection = document.querySelector('.play-section__results');
              resultsSection.style.display = 'flex';

              const userPulseCircles = circleElement.querySelectorAll('.play-section__user-pulse-circle');
              const housePulseCircles = document.querySelectorAll('.play-section__house-pulse-circle');

              const playAgain = document.querySelector('.button--play-again');

              if(result === 'win'){
                resultsText.textContent = 'YOU WON';
                playAgain.color = '#393c4d';

                for (let i = 0; i < 3; i++) {
                  const pulse = document.createElement('div');
                  pulse.className = 'play-section__user-pulse-circle active';
                  circleElement.parentNode.insertBefore(pulse, circleElement);
                }
                
                userPulseCircles.forEach(circle => {
                  circle.classList.add('active'); 
                });
              }
              else if(result === 'lose'){
                 resultsText.textContent = 'YOU LOSE';
                 playAgain.color = '#bb556b';
                 
                 housePulseCircles.forEach(circle => {
                   circle.classList.add('active'); 
                 });
              }
              else{
                 resultsText.textContent = 'DRAW';
              }
             
              requestAnimationFrame(() => {
                resultsSection.style.opacity = '1';
                resultsSection.style.transform = 'scale(1)';
              });
            }, 1600);
          }, 2500); 
        }).catch(err => console.error('Error loading JSON:', err));
      }, 1000);
    }, 1000);
  });
}
  
// Setting same animations for all the circles (paper, rock, scissors)
blueCircle.addEventListener('click', () => animatePick(blueCircle, 'blue'));
yellowCircle.addEventListener('click', () => animatePick(yellowCircle, 'yellow'));
redCircle.addEventListener('click', () => animatePick(redCircle, 'red'));
