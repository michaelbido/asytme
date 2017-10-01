function openNav() {
    document.getElementById("mySidenav").style.width = "100%";

    function fadeIn(element) {
        var opacity = 0.1;  
        element.style.display = 'block';
        var timer = setInterval(function () {
            if (opacity >= 1){
                clearInterval(timer);
            }
            element.style.opacity = opacity;
            element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
            opacity += opacity * 0.1;
        }, 10);
    }
    fadeIn(document.getElementById("mySidenavText"));
    fadeIn(document.getElementById("mySidenavText1"));
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";

    function fadeOut(element) {
        var opacity = 1;
        var timer = setInterval(function () {
            if (opacity <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = opacity;
            element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
            opacity -= opacity * 0.1;
        }, 6);
    }
    fadeOut(document.getElementById("mySidenavText"));
    fadeOut(document.getElementById("mySidenavText1"));
    
}

// function InitMap() {

// }