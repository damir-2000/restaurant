class Slider {
    constructor(options){
        this.settingsCheck =  function (settingsName) {
            return (options.settings[settingsName] != null && options.settings[settingsName] != undefined) ? options.settings[settingsName] : this.settingsDefault[settingsName];
        }
         /* получаем элементы со страницы */
        this.selector = {
            slider : document.querySelector(`.${options.selector.slider}`),
            slide : document.querySelectorAll(`.${options.selector.slide}`),
            track : document.querySelector(`.${options.selector.track}`),
            btnPrev : document.querySelector(`.${options.selector.btnPrev}`),
            btnNext : document.querySelector(`.${options.selector.btnNext}`),
            draggable : document.querySelector(`.${options.selector.slider} .draggable`),
                
            slideClassName: options.selector.slide,
            sliderClassName: options.selector.slider,
        }
        
        /* настройки по умолчанию*/
        this.settingsDefault = {
            slideToShow : 1,
            /* slideToScroll пока не работает */
            slideToScroll : 1,
            slideSpeed: 500,
            infinity: true,
            autoPlay: false,
            autoPlaySpeed: 3000,
            responsive: 0,  
            swipe: false,
            verticalSlider: false,
        }
         /* стандартные настройки которые получаем*/
        this.settingsReceive = {
            slideToShow : this.settingsCheck('slideToShow'),
            slideToScroll : this.settingsCheck('slideToScroll'),
            slideSpeed : this.settingsCheck('slideSpeed'),
            infinity : this.settingsCheck('infinity'),
            autoPlay : this.settingsCheck('autoPlay'),
            autoPlaySpeed : this.settingsCheck('autoPlaySpeed'),
            swipe: this.settingsCheck('swipe'),
            verticalSlider: this.settingsCheck('verticalSlider'),
            
        }
        /* настройки  которые меняються от размера экрана*/
        this.settings = {
            slideToShow : this.settingsCheck('slideToShow'),
            slideToScroll : this.settingsCheck('slideToScroll'),
            slideSpeed : this.settingsCheck('slideSpeed'),
            infinity : this.settingsCheck('infinity'),
            autoPlay : this.settingsCheck('autoPlay'),
            autoPlaySpeed : this.settingsCheck('autoPlaySpeed'),
            responsive:this.settingsCheck('responsive'),
            swipe: this.settingsCheck('swipe'),
            verticalSlider: this.settingsCheck('verticalSlider'),
        }
        
        /* обновление переменых */
        this.varReload = function () {
            return {
                slideLength: this.settings.infinity ? this.selector.slide.length + this.settings.slideToShow : this.selector.slide.length,
                
                slideWidth: this.settings.verticalSlider ? this.selector.slider.offsetWidth : this.selector.slider.offsetWidth / this.settings.slideToShow,
                slideHeight: this.selector.slide[0].offsetHeight,
                
                slideActiveName: `${options.selector.slide}_active`,
                
                trackWidth: this.settings.verticalSlider ? this.selector.slider.offsetWidth : ((this.selector.slider.offsetWidth / this.settings.slideToShow) * (this.selector.slide.length + (this.settings.infinity ? this.settings.slideToShow : 0))),
                
                trackHeight: (this.selector.slide[0].offsetHeight) * (this.selector.slide.length + (this.settings.infinity ? this.settings.slideToShow : 0)),
                
                trackStart: this.settings.infinity ? (this.settings.verticalSlider ? (-this.selector.slide[0].offsetHeight) * this.settings.slideToShow : -this.selector.slider.offsetWidth) : 0,
                
                trackEnd: -(this.settings.verticalSlider ? ((this.selector.slide[0].offsetHeight) * (this.selector.slide.length + (this.settings.infinity ? this.settings.slideToShow : 0)) - this.selector.slide[0].offsetHeight * this.settings.slideToShow) : (this.selector.slider.offsetWidth / this.settings.slideToShow) * (this.selector.slide.length + (this.settings.infinity ? this.settings.slideToShow : 0)) - this.selector.slider.offsetWidth),
                
                trackPosition: this.settings.infinity ? (this.settings.verticalSlider ? (-this.selector.slide[0].offsetHeight) * this.settings.slideToShow : -this.selector.slider.offsetWidth) : 0,
                
                trackMoveDistance: (this.settings.verticalSlider ? this.selector.slide[0].offsetHeight :(this.selector.slider.offsetWidth / this.settings.slideToShow)) * (this.settings.slideToScroll <= this.settings.slideToShow ? this.settings.slideToScroll : this.settings.slideToShow),
                     
            }
        }
        /* Сами переменные */
        this.var = this.varReload();

        /* Размер дисплея */
        this.screenWidth ={
            max: window.screen.width,
            min: window.screen.width,
        }
        /* размер окна браузера */
        this.innerWidth = {
            max: window.innerWidth,
            min: window.innerWidth,
        }
        /* создаем таймер и запуска сам слайдер */
        this.timer;
        
        this.autoPlayOnOff = true;
        
        this.start();

    }
    
    /* Запуск */
    start(){
        let drag = document.createElement('div');
        drag.classList.add('draggable');
        this.selector.slider.append(drag);
        this.selector.draggable = document.querySelector(`.${this.selector.sliderClassName} .draggable`);
        this.selector.draggable.append(this.selector.track);
        
        /* меняем курсор */
        if (this.settings.swipe) {
            this.selector.slider.style.cursor = 'grab';
        }
        /* Добавляем атрибут слайду */
        for (let i = 0; i < this.selector.slide.length; i++) {
            this.selector.slide[i].setAttribute('slide', i);
        }
        
        this.responsiveSettings(window.screen.availWidth);
        
        /* слушаем кнопки */
        if(this.selector.btnPrev){
            this.selector.btnPrev.addEventListener('click', ()=>{this.prev()})
        }
        if(this.selector.btnNext){
            this.selector.btnNext.addEventListener('click', ()=>{this.next()})
        }
        
        /* слушаем слайдер при наведение отключаем автоплей */
        if (this.settings.autoPlay) {
            this.selector.track.addEventListener('mouseout', ()=>{
                this.autoPlayOnOff = true;
                this.autoPlay(); 
                
            })
            this.selector.track.addEventListener('mouseover', ()=>{
                this.autoPlayOnOff = false;
                clearInterval(this.timer);
                
            })
        }
        
        
        /* слушаем измение размера экрана */
        window.addEventListener('resize', (size) =>{
            
            /* размер дисплея */
            if (this.screenWidth.min > window.screen.width || this.screenWidth.max < window.screen.width) {
                this.screenWidth.min = window.screen.width - 10;
                this.screenWidth.max = window.screen.width + 10;
                this.responsiveSettings(window.screen.width);
                
            }
            /* размер окна */
            else if(this.innerWidth.min > window.innerWidth || this.innerWidth.max < window.innerWidth){
                
                this.innerWidth.min = window.innerWidth - 10;
                this.innerWidth.max = window.innerWidth + 10;
                this.responsiveSettings(window.innerWidth);
            }
            
        });
        
        this.swipe()
        this.addActiveClass()
        this.autoPlay(); 
    
    }
    
    /* Задействует новые значение */
    reloadSlider(){
        /* Обновляем переменные */
        this.var = this.varReload();
        
        if (this.settings.verticalSlider) {
            this.selector.track.style.display = 'block';
        }
        else{
            this.selector.track.style.display = 'flex';
        }
        
        /*Duplicate для бесконечного слайдера*/
        if(!this.settings.infinity && document.querySelectorAll(`.${this.selector.slideClassName}_duplicate`).length != 0 || document.querySelectorAll(`.${this.selector.slideClassName}_duplicate`).length != this.settings.slideToShow){
            
            document.querySelectorAll(`.${this.selector.slideClassName}_duplicate`).forEach(element => {
                element.remove();
            });
        } 
        if (this.settings.infinity && document.querySelectorAll(`.${this.selector.slideClassName}_duplicate`).length == 0) {
            
            for (let i = (this.var.slideLength - this.settings.slideToShow - 1); i > this.var.slideLength - this.settings.slideToShow * 2 - 1; i--) {
                
                let slide = this.selector.slide[i].cloneNode(true);
                slide.classList.add(`${this.selector.slideClassName}_duplicate`);
                this.selector.track.prepend(slide);
            }
        }
        

        /* значения по умолчаню для Track*/
        this.selector.track.style.width = `${this.var.trackWidth}px`;
        this.selector.track.style.transition = `${this.settings.slideSpeed}ms`;
   
        /* начальное положение слайдера*/
        this.trackMove(this.var.trackStart);
        
        
       /* Задаем размер одного слайда*/
        document.querySelectorAll(`.${this.selector.slideClassName}`).forEach((element) => {
            element.style.width = `${this.var.slideWidth}px`

        }); 
        /* задаем высоту слайдера когда слайдер работает вертикально */
        if (this.settings.verticalSlider) {
            this.selector.draggable.style.height = `${this.selector.slide[0].offsetHeight * this.settings.slideToShow}px`;
            this.selector.track.style.height = `${this.var.trackHeight}px`;
        }
        else{
            this.selector.draggable.style.height = 'auto';
            this.selector.track.style.height = `auto`;
        }
        
        this.var = this.varReload();  
        this.addActiveClass();
        
    }
    
    /* Для адаптации, чтобы задействовать новые настройки  */
    responsiveSettings(width){
        
        if (this.settings.responsive != 0 ) {
            
            this.settings.responsive.forEach(element =>{
                if (width > element.breakpoint) {
                    Object.keys(this.settingsReceive).forEach(el => {
                        this.settings[el] = this.settingsReceive[el];
                    });
                }
            });
                
            this.settings.responsive.forEach(element =>{
                
                if (width < element.breakpoint) {
                    Object.keys(element.settings).forEach(setting =>{
                        this.settings[setting] = element.settings[setting];
                        
                    });
                }
            });
        }
        this.reloadSlider()
        
    }
    
    
    trackMove(distance){
        if (this.settings.verticalSlider) {
            this.selector.track.style.transform = `translate3d(0, ${distance}px, 0)`;
        }
        else{
            this.selector.track.style.transform = `translate3d(${distance}px, 0, 0)`;
        }
        
    }
    
    /* Переход на предыдущий слайд */
    prev(){
        
        clearInterval(this.timer);
        
        if (this.var.trackPosition == 0 && this.settings.infinity) {
            this.infifnity(this.var.trackEnd, 0, ()=>{
                this.var.trackPosition = this.var.trackPosition + this.var.trackMoveDistance;
                this.trackMove(this.var.trackPosition);
                
            })
        }
        
        else if (this.var.trackPosition < 0){
            this.var.trackPosition = this.var.trackPosition + this.var.trackMoveDistance;
            this.trackMove(this.var.trackPosition);
            
            if(this.settings.infinity && this.var.trackPosition === 0){
            
                this.infifnity(this.var.trackEnd, this.settings.slideSpeed, ()=>{})
                
            }
        }
        this.addActiveClass()
        this.autoPlay();
    }
    
    /* Переход на следующий слайд */
    next(){
        
        clearInterval(this.timer);
    
        if (this.var.trackPosition == this.var.trackEnd && this.settings.infinity) {
            this.infifnity(0, 0, ()=>{
                this.var.trackPosition = this.var.trackPosition - this.var.trackMoveDistance;
                this.trackMove(this.var.trackPosition);
            })
        }
        else if (this.var.trackPosition > this.var.trackEnd) {
            this.var.trackPosition = this.var.trackPosition - this.var.trackMoveDistance;
            this.trackMove(this.var.trackPosition);
            this.addActiveClass()

            if(this.settings.infinity && this.var.trackPosition == this.var.trackEnd) {
                
                this.infifnity(0, this.settings.slideSpeed, ()=>{})
                
            }
            
        }
       
        this.autoPlay();
            
    }
    
    /* функция для создание бесконечности слайдов */
    infifnity(position, speed, cb){
        setTimeout(() => {
            this.var.trackPosition = position;
            this.selector.track.style.transition = `0ms`;
            this.trackMove(this.var.trackPosition);
            
            setTimeout(() => {
                this.selector.track.style.transition = `${this.settings.slideSpeed}ms`;
                cb();
                this.addActiveClass()
            }, 30);
        },speed - 30)
        
    }
    
    /* Автоплей */
    autoPlay(){
        if (this.settings.autoPlay && this.autoPlayOnOff) {
            this.timer = setInterval(() => {
                this.next();
            }, this.settings.autoPlaySpeed);
        }
    }
    
    /* Добавляем актив классы */
    addActiveClass(){
        let indexStart = Math.floor(this.settings.verticalSlider ? ((this.var.trackHeight - this.var.trackPosition) / this.var.slideHeight - this.var.slideLength) : ((this.var.trackWidth - this.var.trackPosition) / this.var.slideWidth - this.var.slideLength)),
        
            indexEnd = Math.floor((this.settings.verticalSlider ? ((this.var.trackHeight - this.var.trackPosition) / this.var.slideHeight) : ((this.var.trackWidth - this.var.trackPosition) / this.var.slideWidth))- this.var.slideLength + this.settings.slideToShow - 1),
            slide = document.querySelectorAll(`.${this.selector.slideClassName}`);
                
        for (let i = 0; i < slide.length; i++) {
            
            if (indexStart <= i && indexEnd >= i) {
                document.querySelectorAll(`.${this.selector.slideClassName}[slide='${slide[i].getAttribute('slide')}']`).forEach(el =>{
                    el.classList.add(this.var.slideActiveName);
                    
                });
            }
            else{
                slide[i].classList.remove(this.var.slideActiveName);
            }
            
        }
        
    }
     
    swipe(){
       
        let StartPosition,
        moveDistance,
        EndPosition,
        positionY;
        let context = this;
        
        this.selector.slider.addEventListener('mousedown', startMove);
        this.selector.slider.addEventListener('touchstart', startMove);
         
        function startMove(e) {
            if (context.settings.swipe) {
                console.log(e.type);
                context.selector.track.style.transition = `0ms`;
                context.selector.slider.style.cursor = 'grabbing';
                positionY = e.type == 'mousedown' ? false : e.changedTouches[0].clientY;
                StartPosition = (context.settings.verticalSlider ? (e.clientY || e.changedTouches[0].clientY):(e.clientX || e.changedTouches[0].clientX));
            
                context.selector.slider.addEventListener('mousemove', move);
                context.selector.slider.addEventListener('mouseup', endMove);
                context.selector.slider.addEventListener('mouseleave', endMove);
                context.selector.slider.addEventListener('touchmove', move);
                context.selector.slider.addEventListener('touchend', endMove);
                context.selector.slider.addEventListener('touchcancel', endMove);
        }
        }
        function move(e) {
            e.preventDefault();
            
            moveDistance = context.var.trackPosition - (StartPosition - (context.settings.verticalSlider ? (e.clientY || e.changedTouches[0].clientY):(e.clientX || e.changedTouches[0].clientX)));
            context.trackMove(moveDistance);
            
            if (positionY && (!context.settings.verticalSlider && Math.abs(positionY - e.changedTouches[0].clientY) > 20)) {
                context.selector.slider.removeEventListener('touchmove', move);
            }
        }
        function endMove(e) {
            EndPosition = (context.settings.verticalSlider ? (e.clientY || e.changedTouches[0].clientY):(e.clientX || e.changedTouches[0].clientX));
            
            context.selector.slider.removeEventListener('mousemove', move);
            context.selector.slider.removeEventListener('mouseup', endMove);
            context.selector.slider.removeEventListener('mouseleave', endMove);
            context.selector.slider.removeEventListener('touchmove', move);
            context.selector.slider.removeEventListener('touchend', endMove);
            context.selector.slider.removeEventListener('touchcancel', endMove);
             
            context.selector.track.style.transition = `${context.settings.slideSpeed}ms`;
            
            if ((StartPosition - EndPosition) > (context.settings.verticalSlider ? context.var.slideHeight : context.var.slideWidth) / 3) {
                context.next();
            }
            else{
                context.trackMove(context.var.trackPosition);
            }
            
            if ((StartPosition - EndPosition) < - (context.settings.verticalSlider ? context.var.slideHeight : context.var.slideWidth) / 3) {
                context.prev();
            }
            else{
                context.trackMove(context.var.trackPosition);
            }
            context.selector.slider.style.cursor = 'grab';
        }
            
    }
      
}


const discoverSlider = new Slider ({
    selector:{
        slider      :'discover-slider__wrapper',
        track       :'discover-slider__track',
        slide       :'discover-slider__slide',
        btnPrev     :'discover-slider__button-left',
        btnNext     :'discover-slider__button-right'
    },
    settings:{
        infinity: true,
        slideSpeed: 500,
        slideToShow: 1,
        autoPlay: true,
        autoPlaySpeed: 3000,
        swipe: true,
        responsive: [{
                       breakpoint : 1200,
                       settings:{
                            
                       } 
                    }]
    } 
    
});


const foodSlider = new Slider ({
    selector:{
        slider      :'food-slider__wrapper',
        track       :'food-slider__track',
        slide       :'food-slider__slide',
        btnNext     :'food-slider__button-right',
       
    },
    settings:{
        infinity: true,
        slideSpeed: 500,
        slideToShow: 2,
        autoPlay: true,
        autoPlaySpeed: 3000,
        swipe: true,
        responsive: [{
                        breakpoint : 1100,
                        settings:{  
                            slideToShow: 1,
                        }, 
                    },
                    {
                       breakpoint : 660,
                       settings:{  
                            slideToShow: 2,
                            verticalSlider: true,
                            swipe: false,
                       } 
                    }]
    }
    
});

