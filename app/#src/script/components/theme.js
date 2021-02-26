let body = document.querySelector('body'),
    menuBtn = document.querySelector('.nav__user-menu-button'),
    menuList = document.querySelector('.nav__user-menu-list'),
    colorBtn = document.querySelectorAll('.theme-color__btn');


menuBtn.addEventListener('click', ()=>{
    menuList.classList.toggle('nav__user-menu-list_active');
});


if (localStorage.getItem('theme') == null) {
    body.classList.add('theme_green');
    localStorage.setItem('theme', 'theme_green');
    
}
else{
    body.classList.add(localStorage.getItem('theme'));
}


colorBtn.forEach(element => {
    
    element.addEventListener('click', (e) =>{
        menuList.classList.toggle('nav__user-menu-list_active');
        colorBtn.forEach(element => {
            body.classList.remove(element.getAttribute('color'));
        });
        
        body.classList.add(element.getAttribute('color'));
        localStorage.setItem('theme', element.getAttribute('color'));
    })
});
