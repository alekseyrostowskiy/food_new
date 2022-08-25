window.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items");

  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.style.display = "none";
    });
    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].style.display = "block";
    tabs[i].classList.add("tabheader__item_active");
  }

  hideTabContent();
  showTabContent();

  // Timer

  const deadline = '2022-08-07';

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;
    const t = Date.parse(endtime) - Date.parse(new Date());
    if (t <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
        hours = Math.floor(t / (1000 * 60 * 60) % 24),
        minutes = Math.floor((t / 1000 / 60) % 60),
        seconds = Math.floor((t / 1000) % 60);
    }

    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds');
    timeInterval = setInterval(updateClock, 1000)

    updateClock(); // чтобы сразу показывало правильное время на странице(в противном случае будет выведено на первую секунду значение по умолчанию deadline)

    function getZero(num) {
      if (num >= 0 && num < 10) {
        return `0${num}`;
      } else {
        return num;
      }
    }

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }


  }

  setClock('.timer', deadline);

  tabsParent.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  // Modal

  const btn = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal");

  function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = "hidden";
    clearInterval(modalTimerId);
  }

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  function showModalByScroll() {
    if (
      document.documentElement
      .scrollTop /* можно также воспользоваться свойством window.pageYOffset */ +
      document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal();
    }
    window.removeEventListener("scroll", showModalByScroll);
  }

  btn.forEach((item) => {
    item.addEventListener("click", openModal);
  });


  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal") || e.target.getAttribute('data-close') == '') { // сделали так, чтобы динамически создаваемые объекты тоже реагировали на события(257 строка)
      closeModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.code == "Escape" && modal.style.display == "block") {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 50000);

  window.addEventListener("scroll", showModalByScroll);


  // Используем классы для карточек

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) { // в classes аргумент по умолчанию поставить нельзя, так как это массив
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parent = document.querySelector(parentSelector)
      this.classes = classes;
      this.transfer = 27;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }

    render() {
      const element = document.createElement('div');
      if (this.classes.length === 0) {
        this.classes = 'menu__item';
        element.classList.add(this.classes); // случай, когда в classes не передали аргументы
      } else {
        this.classes.forEach(className => element.classList.add(className))
      }
      element.innerHTML = `
            <img src=${this.src} alt=${this.alt} />
            <h3 class="menu__item-subtitle">Меню "Фитнес"</h3>
            <div class="menu__item-descr">
              ${this.descr}
            </div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
              <div class="menu__item-cost">Цена:</div>
              <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
      `
      this.parent.append(element)

    }

  }

  const getResources = async (url, data) => {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return res.json();
  }

  getResources('http://localhost:3000/menu') /* 1-ый вариант */
    .then(data => {
      data.forEach(({
        img,
        altimg,
        title,
        descr,
        price
      }) => {
        /* деструктуризация объекта */
        new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
      })
    })


  /* 2-ой варинат - без использования классов */

  // getResources('http://localhost:3000/menu')
  //   .then(data => createCard(data));

  // function createCard(data) {
  //   data.forEach(({
  //    img, altimg, title, descr, price
  //   }) => {
  //     const element = document.createElement('div');

  //     element.classList.add('menu__item');
  //     element.innerHTML = `
  //     <img src=${img} alt=${altimg} />
  //     <h3 class="menu__item-subtitle">Меню "Фитнес"</h3>
  //     <div class="menu__item-descr">
  //       ${descr}
  //     </div>
  //     <div class="menu__item-divider"></div>
  //     <div class="menu__item-price">
  //       <div class="menu__item-cost">Цена:</div>
  //       <div class="menu__item-total"><span>${price}</span> грн/день</div>
  //     </div>
  //     `;
  //     document.querySelector('.menu .container').append(element);
  //   })
  // }



  // new MenuCard(      /* чтобы не делать так, мы написали код, что идёт сразу выше */
  //   "img/tabs/vegy.jpg",
  //   "vegy",
  //   'Меню "Фитнес"',
  //   'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
  //   9,
  //   '.menu .container'
  // ).render();


  const forms = document.querySelectorAll('form');
  const message = {
    loading: 'img/spinner.svg',
    success: 'Спасибо, скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так'
  };

  forms.forEach(item => {
    bindPostData(item);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    })
    return res.json();
  }

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
      display:block;
      margin: 0 auto;
      `
      // form.append(statusMessage); /* в некоторых местах будет некорректно располагаться */

      form.insertAdjacentElement('afterend', statusMessage);



      // const request = new XMLHttpRequest();/* старый способ */
      // request.open('POST', 'server.php');

      // ОТПРАВЛЕНИЕ JSON-ФАЙЛА

      const formData = new FormData(form); // если в вёртске не указаны атрибуты name , будут скорее всего ошибки при формаровании объекта

      // const object = {};
      // formData.forEach(function (key, value) {
      //   object[key] = value;
      // });
      //более элегантный способ преображения form-data в json :
      const json = JSON.stringify(Object.fromEntries(formData.entries()))
      /* берём фоform-data и превращаем в массив массивов--> превращение в обычный объект(обратная операция - 
               fromEntries()---> и далее превращаем объект в json) */
      postData('http://localhost:3000/requests', json)
        // .then(data => data.text()) /* прописали это, чтобы чётко понимать какой ответ приходит от сервера */
        .then(data => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        })
      /////         

      // ОТПРАВЛЕНИЕ FORM-DATA:

      // const formData = new FormData(form); // если в вёртске не указаны атрибуты name , будут скорее всего ошибки при формаровании объекта


      // fetch('server.php', {
      //   method: 'POST',
      //   body:  formData
      // })
      // .then(data => data.text())    /* прописали это, чтобы чётко понимать какой ответ приходит от сервера */
      // .then(data => {
      //   console.log(data);
      //   showThanksModal(message.success);
      //   statusMessage.remove();
      // })
      // .catch(() => {
      //   showThanksModal(message.failure);
      // })
      // .finally(() => {
      //   form.reset();
      // })
      ////
      // request.send(formData);

      // request.addEventListener('load', () => {
      //   if (request.status === 200) {
      //     console.log(request.response);
      //     showThanksModal(message.success);
      //     form.reset();
      //     statusMessage.remove();
      //   } else {
      //     showThanksModal(message.failure);
      //   }
      // });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.style.display = 'none';
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    // динамичекси созданные элементы не работают с обработчиками событий, если не прописать через делегирование событий
    thanksModal.innerHTML = `
            <div class="modal__content">
            <div class="modal__close" data-close >×</div>         
            <div class="modal__title">${message}</div>
            </div>
        `;
    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.style.display = "";
      closeModal();
    }, 4000)
  }

  fetch('db.json')
    .then(data => data.json())
    .then(res => console.log(res));

  // Slider

  const slides = document.querySelectorAll('.offer__slide'),
    slider = document.querySelector('.offer__slider'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'),
    total = document.querySelector('#total'),
    current = document.querySelector('#current'),
    slidesWrapper = document.querySelector('.offer__slider-wrapper'),
    slidesField = document.querySelector('.offer__slider-inner'),
    width = window.getComputedStyle(slidesWrapper).width;
  let slideIndex = 1;
  let offset = 0;

  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';
  slidesWrapper.style.overflow = 'hidden';


  if (slides.length < 10) {
    total.textContent = `0${slides.length}`;
    current.textContent = `0${slideIndex}`;
  } else {
    total.textContent = slides.length;
    current.textContent = `0${slideIndex}`;
  }


  slides.forEach(slide => {
    slide.style.width = width;     
  })

  slider.style.position = 'relative';

  const indicators = document.createElement('ol'),
  dots = [];
  indicators.classList.add('carousel-indicators');
  indicators.style.cssText = `
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 15;
  display: flex;
  justify-content: center;
  margin-right: 15%;
  margin-left: 15%;
  list-style: none;
  `;

  slider.append(indicators);

  for(let i = 0; i < slides.length; i++){
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.style.cssText = `
    box-sizing: content-box;
    flex: 0 1 auto;
    width: 30px;
    height: 6px;
    margin-right: 3px;
    margin-left: 3px;
    cursor: pointer;
    background-color: #fff;
    background-clip: padding-box;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    opacity: .5;
    transition: opacity .6s ease;
    `;
    if(i ==0){
      dot.style.opacity = 1; 
    }
    indicators.append(dot);
    dots.push(dot);
  }

  next.addEventListener('click', () => {
    if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +width.slice(0, width.length - 2);
    }

    slidesField.style.transform = `translateX(-${offset}px)`

    if(slideIndex == slides.length){
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    if(slides.length < 10){
      current.textContent = `0${slideIndex}`;
    }else {
      current.textContent = slideIndex;
    }

    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex - 1].style.opacity = 1;


  });

  prev.addEventListener('click', () => {
    if (offset == 0) {
      offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    } else {
      offset -= +width.slice(0, width.length - 2);
    }

    slidesField.style.transform = `translateX(-${offset}px)`
    
    if(slideIndex == 1){
      slideIndex = slides.length ;
    } else {
      slideIndex--;
    }

    if(slides.length < 10){
      current.textContent = `0${slideIndex}`;
    }else {
      current.textContent = slideIndex;
    }

    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex - 1].style.opacity = 1;

  });





  // showSlides(slideIndex);

  // if (slides.length < 10) {
  //   total.textContent = `0${slides.length}`
  // } else {
  //   total.textContent = slides.length;
  // }

  // function showSlides(n) {
  //   if (n > slides.length) {
  //     slideIndex = 1;
  //   }

  //   if (n < 1) {
  //     slideIndex = slides.length;
  //   }

  //   slides.forEach(item => item.style.display = 'none')
  //   slides[slideIndex - 1].style.display = 'block';

  //   if (slides.length < 10) {
  //     current.textContent = `0${slideIndex}`
  //   } else {
  //     current.textContent = slideIndex;
  //   }

  // }

  // function plusSlides(n) {
  //   showSlides(slideIndex += n)
  // }

  // prev.addEventListener('click', () => {
  //   plusSlides(-1);
  // });


  // next.addEventListener('click', () => {
  //   plusSlides(1);
  // });





});