document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready');


});
window.onload = () => {
    console.log('Resourses loaded');
    let cards = document.querySelectorAll('.card__item');
    let setActive = function() {
        let cardList = document.querySelector('.card__list');

        this.classList.add('card__item_active');
        cardList.classList.add('card__list_active');
    };
    let removeActive = function() {
        let cardList = document.querySelector('.card__list');

        this.classList.remove('card__item_active');
        cardList.classList.remove('card__list_active');
    };

    let timerBg;
    let timerVideo;

    let stopVideo = function() {
        let video = document.querySelector('.bg__video');
        let bg = document.querySelector('.bg__img');
        bg.style.opacity = '0';

        video.style.opacity = '0';
        video.style.zIndex = '0';

        clearTimeout(timerBg);
        clearTimeout(timerVideo);

        setTimeout(function () {
            bg.setAttribute('src', 'img/default.png');
            bg.style.opacity = '1';
        }, 200)
    };

    let playVideo = function() {
        let src = this.getAttribute('data-src');
        clearTimeout(timerBg);
        clearTimeout(timerVideo);
        timerBg = setTimeout(function(){
            let bg = document.querySelector('.bg__img');
            bg.setAttribute('src', 'img/' + src + '.png');
            bg.style.opacity = '1';
            timerVideo = setTimeout(function(){
                let video = document.querySelector('.bg__video');
                video.style.opacity = '1';
                video.style.zIndex = '3';
                video.pause();
                let path = '';
                if (document.documentElement.clientWidth >= 1255) {
                    path = 'video/desktop/'
                } else {
                    path = 'video/mobile/'
                }
                video.children[0].setAttribute('src', path + src + '.mp4');
                video.load();
                video.play();
            }, 2000);
        }, 500);
    };



    for(let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('mouseleave', removeActive, false);
        cards[i].addEventListener('mouseleave', stopVideo, false);

        cards[i].addEventListener('mouseenter', setActive, false);
        cards[i].addEventListener('mouseenter', playVideo, false);
    }


};
