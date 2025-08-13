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

function createCircleEmpty() {
  const circleBigEmpty = document.createElement('div');
  circleBigEmpty.className = 'play-section__empty'; // без game-section__circle-big--play
  return circleBigEmpty;
}


const triangle = document.getElementById('bg-triangle');
const blueCircle = document.getElementById('blue-circle-game');
const yellowCircle = document.getElementById('yellow-circle-game');
const redCircle = document.getElementById('red-circle-game');

function fadeOut(element) {
  element.style.transition = 'opacity 0.5s ease';
  element.style.opacity = '0';
  setTimeout(() => {
    element.style.display = 'none';
  }, 500);
}

function fadeIn(element) {
    element.style.transition = 'opacity 3.5s ease';
    element.style.opacity = '1';
    setTimeout(() => {
      element.style.display = 'flex';
    }, 3500);
  }
  function animatePick(circleElement, color) {
    const icon = circleElement.querySelector('.game-section__icon-img');
  
    // Створюємо placeholder, щоб флекс-потік не зсувався
    const rect = circleElement.getBoundingClientRect();
    const placeholder = document.createElement('div');
    placeholder.style.width = rect.width + 'px';
    placeholder.style.height = rect.height + 'px';
    placeholder.style.display = 'inline-block';
    circleElement.parentNode.insertBefore(placeholder, circleElement);
  
    // Приховуємо інші кола та трикутник плавно
    [blueCircle, yellowCircle, redCircle].forEach(c => {
      if (c !== circleElement) {
        c.style.transition = 'opacity 0.5s ease';
        c.style.opacity = '0';
      }
    });
    triangle.style.transition = 'opacity 0.5s ease';
    triangle.style.opacity = '0';
  
    // Переводимо обране коло у fixed для анімації
    circleElement.style.position = 'fixed';
    circleElement.style.left = rect.left + 'px';
    circleElement.style.top = rect.top + 'px';
    circleElement.style.zIndex = 12;
    circleElement.style.transition = 'all 1s ease';
    icon.style.transition = 'all 1s ease';
  
    requestAnimationFrame(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const newSize = 240;
      const newLeft = (vw - newSize) / 2;
      const newTop = (vh - newSize) / 2;
      const newIconSize = 96;
  
      circleElement.style.width = `${newSize}px`;
      circleElement.style.height = `${newSize}px`;
      circleElement.style.left = `${newLeft}px`;
      circleElement.style.top = `${newTop}px`;
      icon.style.height = `${newIconSize}px`;
  
      setTimeout(() => {
        circleElement.style.transition = 'all 0.6s ease';
        circleElement.style.left = `${newLeft - 174.5}px`;
        circleElement.style.top = `${newTop + 114}px`;
  
        setTimeout(() => {
          fetch('choice.json')
            .then(res => res.json())
            .then(data => {
              const gameSection = document.querySelector('.game-section');
              const playSection = document.querySelector('.play-section');
              const youPicked = document.getElementById('you-picked');
              const housePicked = document.getElementById('house-picked');
              const housePickedEmpty = document.getElementById('house-picked-empty');
              const youPickedText = document.getElementById('text-you-picked');
              const housePickedText = document.getElementById('text-house-picked');
  
              // Вставляємо обране коло гравця у секцію play
              youPicked.innerHTML = '';
              youPicked.appendChild(circleElement);
  
              // Вибір кола комп’ютера
              const houseChoices = data.filter(i => i.owner === 'house');
              const houseChoice = houseChoices[Math.floor(Math.random() * houseChoices.length)];
  
              // Порожнє коло комп’ютера
              housePickedEmpty.innerHTML = '';

              housePickedEmpty.innerHTML = '';
const emptyCircle = createCircleEmpty();
housePickedEmpty.appendChild(emptyCircle);
housePickedEmpty.style.display = 'flex';

playSection.style.display = 'flex';
// Використовуємо requestAnimationFrame для плавного старту transition
requestAnimationFrame(() => {
  emptyCircle.style.opacity = '1';
  emptyCircle.style.transform = 'scale(1)';
});

// Тексти теж одночасно
requestAnimationFrame(() => {
  youPickedText.style.opacity = '1';
  youPickedText.style.transform = 'translateY(0)';
  housePickedText.style.opacity = '1';
  housePickedText.style.transform = 'translateY(0)';
});

  
              // Через коротку затримку показуємо реальне коло комп’ютера
              setTimeout(() => {
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
  
              // Ховаємо ігрову секцію
              gameSection.style.display = 'none';
  
              // Прибираємо fixed позиціонування у обраного кола
              circleElement.style.position = '';
              circleElement.style.left = '';
              circleElement.style.top = '';
              circleElement.style.transition = '';
              circleElement.style.zIndex = '';
              icon.style.transition = '';
              circleElement.style.pointerEvents = 'none';
  
              // Видаляємо placeholder
              placeholder.remove();
            })
            .catch(err => console.error('Error loading JSON:', err));
        }, 1000);
      }, 1000);
    });
  }
  
  
// Прив'язуємо функцію до кожного кола
blueCircle.addEventListener('click', () => animatePick(blueCircle, 'blue'));
yellowCircle.addEventListener('click', () => animatePick(yellowCircle, 'yellow'));
redCircle.addEventListener('click', () => animatePick(redCircle, 'red'));
