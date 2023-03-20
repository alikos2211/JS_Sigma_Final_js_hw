async function loadJson() {
    const request = await fetch('./data/what-we-do-objects.json');
    const result = await request.json();

    return result;
}

function setupWhatWeDoSection(data) {
    // Adding all section
    const allSectionInfo = {
        name: "All",
        objects: data.map(obj => obj.objects[obj.objects.length - 1])
    };
    data.unshift(allSectionInfo);
    console.log('Added all section:', data);

    setupWhatWeDoSectionMenu(data.map(obj => obj.name));
    setupWhatWeDoSectionGrid(data);
}

function setupWhatWeDoSectionMenu(items) {
    const parent = document.querySelector('#what-we-do-menu');

    items.forEach(item => {
        const menuItem = createWhatWeDoMenuItem(item, items.indexOf(item));
        parent.appendChild(menuItem);
    });

    // selectWhatWeDoAllSection();
}

function selectWhatWeDoAllSection() {
    const parent = document.querySelector('#what-we-do-menu');

    const allSection = parent.querySelector('.menu-item');
    allSection.focus();
}

function createWhatWeDoMenuItem(info, id) {
    const element = document.createElement('button');
    element.classList.add('menu-item');
    element.innerText = info;

    element.addEventListener('click', () => {
        if (this.activeId == id) {
            selectWhatWeDoAllSection();
            scrollWhatWeDoSectionToSection(0);
        } else {
            element.focus();
            scrollWhatWeDoSectionToSection(id);
        }
        this.activeId = id;
    });

    return element;
}

function setupWhatWeDoSectionGrid(data) {
    const parent = document.querySelector('#block-block-what-we-do-bottom');

    data.forEach(category => {
        const section = createWhatWeDoGridSection(category);
        parent.appendChild(section);
    });

    scrollWhatWeDoSectionToSection(0);
}

function createWhatWeDoGridSection(sectionInfo) {
    const section = document.createElement('div');
    section.classList.add('what-we-do-section');

    sectionInfo.objects.forEach(obj => {
        const block = createWhatWeDoGridBlock(obj);
        section.appendChild(block);
    });

    return section;
}

function createWhatWeDoGridBlock(obj) {
    const element = document.createElement('div');
    element.classList.add('what-we-do-card');
    element.classList.add('card');

    const img = document.createElement('img');
    img.src = obj.img;
    element.appendChild(img);

    const header = document.createElement('h2');
    header.innerText = obj.title;
    element.appendChild(header);

    const description = document.createElement('p');
    description.innerText = obj.description;
    element.appendChild(description);

    return element;
}

function setupCurrentDate() {
    const year = new Date().getFullYear();
    document.querySelectorAll("span.current-year").forEach(element => {
        element.innerText = year;
    })
}
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function scrollWhatWeDoSectionToSection(id) {
    const carousel = document.querySelector('#block-block-what-we-do-bottom');
    const slide = document.querySelector('.what-we-do-section');

    const slidesPadding = parseInt(getComputedStyle(carousel).getPropertyValue("padding"), 10);
    const slidesGap = parseInt(getComputedStyle(carousel).getPropertyValue("gap"), 10);
    const scrollAmount = slide.clientWidth + slidesPadding + slidesGap;

    carousel.scrollLeft = scrollAmount * id;
}

function setupWeather() {
    const latitude = '49.9935';
    const longitude = '36.2304';
    const apiKey = 'e00e8f6a73e53c44da09cd450f4c8b3e';
    const units = 'metric';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
    console.log(`Requesting weather data with URL: ${url}`);
    fetch(url)
        .then(response => {
            console.log(response)

            if (!response.ok) {
                if (response.status === 401) {
                    console.error('Invalid API Key!');
                } else {
                    console.error('Unknown error...');
                }
            }

            return response.json();
        })
        .then(json => {
            console.log(json);
            displayWeatherData(json);
        })
        .catch(err => {
            console.error(`Weather request failed: ${err}`);
        });
}

function displayWeatherData(data) {
    const block = document.querySelector('#weather');

    const text = block.querySelector('p');
    text.innerText = `The temperature is ${data.main.temp}°C, but feels more like ${data.main.feels_like}°C\nWind speed is ${data.wind.speed}km/h\nOther info is boring so I left it in the console for you to inspect!`;
}

function setupTestimonialsCarousel() {
    const block = document.querySelector('#block-testimonials');
    const carousel = block.querySelector('#testimonials-carousel');
    const slide = carousel.querySelector('.testimonial-pair');

    // const slidesPadding = parseInt(getComputedStyle(carousel).getPropertyValue("padding"), 10);
    const slidesGap = parseInt(getComputedStyle(carousel).getPropertyValue("gap"), 10);
    const scrollAmount = slide.clientWidth + slidesGap;

    const buttons = block.querySelector('.carousel-buttons');
    const prevButton = buttons.querySelector('#slide-arrow-prev');
    const nextButton = buttons.querySelector('#slide-arrow-next');

    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    prevButton.addEventListener('click', () => {
        if (carousel.scrollLeft <= 0) {
            carousel.scrollLeft = maxScroll;
        } else {
            carousel.scrollLeft -= scrollAmount;
        }
    });
    nextButton.addEventListener('click', () => {
        if (carousel.scrollLeft >= maxScroll) {
            carousel.scrollLeft = 0;
        } else {
            carousel.scrollLeft += scrollAmount;
        }
    });
}

function setupForm() {
    const form = document.querySelector('#form');
    const inputName = form.querySelector('#name');
    const inputSurname = form.querySelector('#surname');
    const inputEmail = form.querySelector('#email');
    const confirmButton = form.querySelector('#btn-form');

    const clearFormErrors = () => {
        inputName.classList.remove('input-error');
        inputSurname.classList.remove('input-error');
        inputEmail.classList.remove('input-error');
    };

    const isValidName = name => name.match(/^[A-Z][a-z]*$/);
    const isValidSurname = isValidName;
    const isValidEmail = email => email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

    const isMyData = (name, surname, email) => {
        // Email can be validated too if needed...
        return (name == 'Olesia') && (surname == 'Kostikova');
    };

    const saveDataToLocalStorage = (name, surname, email) => {
        localStorage.setItem('name', name);
        localStorage.setItem('surname', surname);
        localStorage.setItem('email', email);
    };

    const fillDataFromLocalStorage = () => {
        const name = localStorage.getItem('name');
        const surname = localStorage.getItem('surname');
        const email = localStorage.getItem('email');

        inputName.value = name;
        inputSurname.value = surname;
        inputEmail.value = email;
    };

    confirmButton.addEventListener('click', (e) => {
        clearFormErrors();

        const name = inputName.value;
        const surname = inputSurname.value;
        const email = inputEmail.value;

        if (!isValidName(name)) {
            inputName.classList.add('input-error');
            e.preventDefault();
            return;
        }

        if (!isValidSurname(surname)) {
            inputSurname.classList.add('input-error');
            e.preventDefault();
            return;
        }

        if (!isValidEmail(email)) {
            inputEmail.classList.add('input-error');
            e.preventDefault();
            return;
        }

        if (isMyData(name, surname, email)) {
            e.preventDefault();
            displayCongratulations(name, surname, email);
        }

        saveDataToLocalStorage(name, surname, email);
    });

    fillDataFromLocalStorage();
}

function displayCongratulations(name, surname, email) {
    const message = `Congratulations, ${name}! Only on ${new Date().toISOString().split('T')[0]} all users with YOUR name can get 120% off your next buy! Hurry!`;
    const block = document.querySelector('.congrats-message');
    block.querySelector('p').innerText = message;
    block.style.opacity = 1;
    setTimeout(() => {
        block.style.opacity = 0;
    }, 1000 * 5);
}

function setupLoader() {
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        loader.style.opacity = 0;
        setTimeout(() => {
            loader.remove();
        }, 1000 * 5);
    }, 1000 * 5);
}

function setupLatestReveal() {
    function reveal() {
        var reveals = document.querySelectorAll(".reveal");

        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            } else {
                reveals[i].classList.remove("active");
            }
        }
    }

    window.addEventListener("scroll", reveal);
}

window.onload = () => {
    loadJson()
        .then((json) => {
            console.log('Loaded json:', json)
            setupWhatWeDoSection(json);
        });

    setupCurrentDate();
    setupSmoothScroll();
    setupWeather();
    setupTestimonialsCarousel();
    setupForm();
    // setupLoader();
    setupLatestReveal();

    // setupIdleTimer();
}

function setupIdleTimer() {
    let time;
    window.onload = resetTimer;
    window.addEventListener('load', resetTimer, true);
    var events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(function (name) {
        document.addEventListener(name, resetTimer, true);
    });

    function logout() {
        let reset = setTimeout(() => {
            console.log('timeout');
            document.location = './logout.html';
        }, 1000 * 2);
        if (confirm('Are you still here? You need to click cancel if not, lol. Alerts stop async timers...')) {
            clearTimeout(reset);
        }
    }

    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(logout, 1000 * 60);
    }
}

window.onscroll = () => {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.querySelector("#progress-indicator").style.width = scrolled + "%";
}