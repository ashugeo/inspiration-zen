let $body;
let $burger;
let $menu;
let $header;
let $logo;
let $ctrl;
let $text;
let ding;
let dong;

let playing = false;
let text = ''; // bottom line
let t = 0; // seconds / 10

let duration = 1; // minutes
let breaths = 4; // per minute
let animation = 'grow';
let sounds = 'all';

let breathPoints = [];
let breathPointsToCheck = [];

$(document).ready(() => {
    $body = $('body');
    $burger = $('.burger');
    $menu = $('.menu');
    $header = $('.header');
    $logo = $('.logo');
    $ctrl = $('.ctrl');
    $text = $('.text');
    ding = new Audio('./sound/ding.mp3');
    ding.volume = .2;
    dong = new Audio('./sound/dong.mp3');
    dong.volume = .2;
});

$(document).on('click', '.select div', (e) => {
    const $el = $(e.currentTarget);
    const $select = $el.closest('.select');
    $select.find('div.selected').removeClass('selected');
    $el.addClass('selected');
});

$(document).on('click', '.pause', (e) => {
    $('.overlay').addClass('visible');
});

$(document).on('click', '.resume', (e) => {
    $('.overlay').removeClass('visible');
});

$(document).on('click', '.start', () => {
    playing = true;
    getOptions();

    init(1000);
});

function init(transition) {
    computeBreathsPoints();

    breathPointsToCheck = breathPoints.slice();
    $ctrl.fadeOut(transition);
    $header.fadeOut(transition);

    if (animation === 'line') {
        $logo.css({
            'top': '360px',
            'margin-left': 0
        });
        $body.addClass('line');
    } else if (animation === 'rotate') {
        $logo.css({
            'top': 'calc(50% - 75px)',
            'width': 150,
            'height': 150,
            'margin-left': -24
        });
    } else if (animation === 'grow') {
        $logo.css({
            'top': 'calc(50% - 50px)',
            'margin-left': 0
        });

        $body.addClass('grow');
    }

    $burger.addClass('pause');

    setTimeout(() => {
        if (playing) {
            start();
        }
    }, 2000);
}

$(document).on('click', '.burger', (e) => {
    if ($(e.currentTarget).hasClass('pause')) return;
    $menu.toggleClass('visible');
    $burger.toggleClass('light');
});

$(document).on('click', '.reset', () => {
    // Reset clock, time and breathpoints
    playing = false;
    t = 0;
    text = '';
    breathPoints = [];
    breathPointsToCheck = [];

    $text.fadeOut(1000);
    $burger.removeClass('pause');
    $('.overlay').removeClass('visible');

    $logo.css({
        'top': '',
        'margin-left': '',
        'animation-name': '',
        'width': '',
        'height': ''
    });

    $body.removeClass('grow line');

    setTimeout(() => {
        $text.fadeOut(1000);
        $ctrl.fadeIn(1000);
        $header.fadeIn(1000);
    }, 1000);
});

function start() {
    clock();

    setTimeout(() => {
        if (playing) {
            $logo.css({
                'animation-name': animation,
                'animation-duration': (60 / breaths) + 's'
            });
        }
    }, 1000);
}

function getOptions() {
    duration = parseInt($('.select[data-option="duration"] div.selected').attr('data-value'));
    breaths = parseInt($('.select[data-option="breaths"] div.selected').attr('data-value'));
    animation = $('.select[data-option="animation"] div.selected').attr('data-value');
    sounds = $('.select[data-option="sounds"] div.selected').attr('data-value');
}

function computeBreathsPoints() {
    const steps = breaths * 2 * duration;
    for (let i = 0; i <= steps; i += 1) {
        let point = i * 60 / breaths / 2;
        point = Math.round(point * 100) / 100;
        breathPoints.push(point);
    }
}

function clock() {
    t += .1;
    t = Math.round(t * 10) / 10;

    if (breathPointsToCheck.length === 0 && playing) {
        end();
    }

    if (t > breathPointsToCheck[0]) {
        breathPointsToCheck.shift();

        if (breathPointsToCheck.length > 0) {
            if (breathPoints.length - breathPointsToCheck.length > 6) {
                switchText(' ');
            } else {
                switchText();
            }
        }
    }

    setTimeout(() => {
        if (playing) clock();
    }, 100);
}

function switchText(overwrite) {
    $text.fadeOut(1000);
    setTimeout(() => {
        if (text === 'Inspirez') {
            text = 'Expirez';
        } else if (text === 'Expirez' || text === '') {
            text = 'Inspirez';
        }
        $text.html(overwrite || text);
        $text.fadeIn(1000);
        if (overwrite && overwrite === `C’est terminé !<div class="button reset"><p>Revenir à l'accueil</p></div>` && (sounds === 'all' || sounds === 'end')) {
            dong.currentTime = 0;
            dong.play();
        } else if (sounds === 'all') {
            ding.currentTime = 0;
            ding.play();
        }
    }, 1000);
}

function end() {
    playing = false;
    switchText(`C’est terminé !<div class="button reset"><p>Revenir à l'accueil</p></div>`);

    setTimeout(() => {
        $logo.css('animation-name', '');
    }, 1000);
}

// document.ontouchmove = (e) => {
//     e.preventDefault();
// }

$(document).on('click', 'ul.nav li', (e) => {
    const $el = $(e.currentTarget);
    const link = $el.attr('data-link');

    $menu.removeClass('visible');
    $burger.toggleClass('light');

    $('section').removeClass('visible');
    $('section#' + link).addClass('visible');
});

$(document).on('click', '#what .button', (e) => {
    const $el = $(e.currentTarget);
    duration = parseInt($el.attr('data-duration'));
    breaths = parseInt($el.attr('data-breaths'));
    animation = $('.select[data-option="animation"] div.selected').attr('data-value');
    sounds = $('.select[data-option="sounds"] div.selected').attr('data-value');

    $('#breath').addClass('visible');
    $('#what').removeClass('visible');

    playing = true;
    init(0);
});
