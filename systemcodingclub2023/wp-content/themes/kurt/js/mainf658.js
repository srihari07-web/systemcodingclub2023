/*======== Window Load Function ========*/
jQuery(window).on('load', function ($) {

    if (CtKurtThemeOptions.enable_preloader == 1) {
        var tl = new TimelineMax();
        var timer = setInterval(function () {
            if (window.preloadFinished) {
                tl
                    .to('.loader-wrap', .3, { y: 100, autoAlpha: 0, ease: Back.easeIn })
                    .to('.preloader', .5, { y: '100%', ease: Power4.easeInOut })
                    .addLabel('preloaded')
                    .fromTo('.item-cat', .3, { y: '-50px', autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 'preloaded')
                    .fromTo('.item-title', .3, { autoAlpha: 0 }, { autoAlpha: 1 }, 'preloaded')
                    .fromTo('.item-link', .3, { y: "50px", autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 'preloaded')
                    .fromTo('.project-subtitle', .3, { y: "-50px", autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 'preloaded')
                    .fromTo('.project-title', .3, { y: "50px", autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 'preloaded');

                clearInterval(timer);
            }
        }, 10);

    }
    jQuery(window).on('elementor/frontend/init', function () {
        if (typeof elementor !== "undefined") {
            elementorFrontend.hooks.addAction("frontend/element_ready/global", function ($elemnt) {
                window.initMap();
            });
            elementorFrontend.hooks.addAction('init', function () {
                $('header').removeClass('header-dark')
            });
        }
    });

});

jQuery(function ($) {

    /*======== Document Ready Function ========*/
    $(document).ready(function () {
        "use strict";
        if ((typeof CtKurtThemeOptions != 'undefined') && (CtKurtThemeOptions.enable_ajax == "1")) {
            AjaxLoad();
        } else {
            PageLoadNoAjax();
        }
        pageLoad();
        preloaderSetup();

    });

    /*======== Load Via Ajax Function ========*/
    window.loadViaAjax = function () {
        pageLoad();

        if (window.elementorFrontend) {
            elementorFrontend.init();
        }

        $('div.wpcf7 > form').each(function () {
            if($.isFunction(wpcf7.initForm)) {
                wpcf7.initForm($(this));
            } 
            else if ($.isFunction(wpcf7.init)) {
                wpcf7.init($(this)[0]);
            }
        });
    }


    /*======== Page Load Function ========*/
    function pageLoad() {
        basicSetup();
        scrollMagicSetup();
        textAnimateSetup();
        logoColorSetup();
        menuBurgerSetup();
        window.initMap();
    }

    /*======== Preloader Setup ========*/
    function preloaderSetup() {


        if (CtKurtThemeOptions.enable_preloader == 1) {
            var width = 100,
                perfData = window.performance.timing,
                EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
                time = ((EstimatedTime / 1000) % 60) * 50

            // Percentage Increment Animation
            var PercentageID = $('#percent'),
                start = 0,
                end = 100,
                durataion = time;

            animateValue(PercentageID, start, end, durataion);

            function animateValue(id, start, end, duration) {

                var range = end - start,
                    current = start,
                    increment = end > start ? 1 : -1,
                    stepTime = Math.abs(Math.floor(duration / range)),
                    obj = $(id);

                window.preloadFinished = false;

                var timer = setInterval(function () {
                    current += increment;
                    //obj.innerHTML = current;
                    $('.loader-percent').css('width', current + '%');
                    $(obj).text(current + "%");
                    if (current == end) {
                        clearInterval(timer);
                        window.preloadFinished = true;
                    }
                }, stepTime);

            }
        }

    }


    /*======== Site Common Setup Function ========*/
    function basicSetup() {

        /*==== Pixi Slider Setup ====*/
        if ($('#pixi-slider').length > 0) {
            imagesLoaded('#slider-wrapper', function () {
                initCanvasSlideshow = new CanvasSlideshow({
                    container: '#pixi-slider',
                    images: '.slide-item__image'
                });
            });

            /* Adjust Slider Height */
            function adjustHeight() {
                var sliderElements = $('#pixi-slider, #canvas-container');

                sliderElements.css({
                    "height": $(window).height() + "px"
                });
            }
            adjustHeight();
            $(window).resize(adjustHeight);
        }

        /*==== Scroll buttons Setup ====*/
        $('#scroll-down').on('click', function () {
            var height = $(".project-hero").height();
            if ($("body").hasClass("smooth-scroll")) {
                TweenMax.to(window.scrollbar, 1.5, { scrollTop: height, ease: Power4.easeInOut });
            } else {
                $("html,body").animate({ scrollTop: height }, 800);
            }
        });
        $('#scroll-top').on('click', function () {
            if ($("body").hasClass("smooth-scroll")) {
                TweenMax.to(window.scrollbar, 1.5, { scrollTop: 0, ease: Power4.easeInOut });
            } else {
                $("html,body").animate({ scrollTop: 0 }, 800);
            }
        });

        /*==== Smooth Scrollbar Setup ====*/
        if ($('body').hasClass('smooth-scroll')) {
            var scrollContent = $('#scroll-content');
            window.scrollbar = Scrollbar.init(scrollContent[0],
                {
                    renderByPixels: true,
                    damping: 0.07
                });
        }

        /*==== Google Map Elementor Setup ====*/
        $('.smooth-scroll .elementor-widget-google_maps iframe').css('pointer-events', 'none');
        $('.smooth-scroll .elementor-widget-google_maps').on('click', function() {
            $(this).find('iframe').css('pointer-events', 'auto');
        });
        $('.smooth-scroll .elementor-widget-google_maps').on('mouseleave', function() {
            $(this).find('iframe').css('pointer-events', 'none');
        });


        /*==== Owl Carousel Setup ====*/
        $('.owl-carousel').owlCarousel({
            margin: 30,
            autoHeight: false,
            navSpeed: 600,
            responsive: {
                0: {
                    items: 1
                },
                1024: {
                    items: 2
                }
            }
        });

        /*==== Magnific Popup Setup ====*/
        $('.link-popup .image-link').magnificPopup({
            type: 'image',
            zoom: { enabled: true, duration: 250 }
        });

        $('.menu-item-has-children>a, .primary-nav .page_item_has_children>a').on('click', function (e) {
            e.preventDefault();
            var _that = $(this).parent();
            var subMenu = _that.find('> ul');
            var dispaly = subMenu.css("display");
            subMenu.slideUp("slow");
            if (dispaly !== "block") {
                subMenu.slideDown("slow");
            }

        })

    }


    /*======== Text Animation Setup Function ========*/
    function textAnimateSetup() {

        var delay = .4;
        TweenMax.fromTo('.page-changed .hero-subtitle', .3,
            {
                y: "50px",
                autoAlpha: 0
            },
            {
                y: 0,
                autoAlpha: 1,
                delay: delay
            });
        TweenMax.fromTo('.page-changed .project-subtitle', .3,
            {
                y: "-50px",
                autoAlpha: 0
            },
            {
                y: 0,
                autoAlpha: 1,
                delay: delay
            });
        TweenMax.fromTo('.page-changed .hero-title, .page-changed .project-title', .3,
            {
                y: "50px",
                autoAlpha: 0
            },
            {
                y: 0,
                autoAlpha: 1,
                delay: delay
            });
        TweenMax.fromTo('.page-changed .item-cat', .3,
            {
                y: "-50px",
                autoAlpha: 0
            },
            {
                y: 0,
                autoAlpha: 1,
                delay: delay
            });
        TweenMax.fromTo('.page-changed .item-link', .3,
            {
                y: "50px",
                autoAlpha: 0
            },
            {
                y: 0,
                autoAlpha: 1,
                delay: delay
            });
        TweenMax.fromTo('.page-changed .item-title', .3,
            {
                autoAlpha: 0
            },
            {
                autoAlpha: 1,
                delay: delay
            });

        var controller = new ScrollMagic.Controller();

        $('.text-animate').attr('data-splitting', 'words');

        Splitting();

        $('.text-animate').each(function () {
            var $this = $(this);

            var scene = new ScrollMagic.Scene({
                triggerElement: $this[0],
            })
                .setClassToggle($this[0], 'is-active')
                .reverse(false)
                .addTo(controller);

            scene.triggerHook(.9);
            if ($("body").hasClass("smooth-scroll")) {
                window.scrollbar.addListener(() => {
                    scene.refresh()
                });
            }
        });
    }

    /*======== Logo Color Setup Function ========*/
    function logoColorSetup() {

        var ctrl = new ScrollMagic.Controller;
        $('a[data-type="page-transition"]').on('click', function() {
            ctrl = ctrl.destroy(true);
        });

        setTimeout(function () {

            $(".change-header-dark").each(function () {

                var elemHeight = $(this).outerHeight(!0),
                    scene = new ScrollMagic.Scene({
                        triggerElement: this,
                        duration: elemHeight
                    }).addTo(ctrl);

                scene.triggerHook(.11);

                scene.on("enter", function () {
                    setTimeout(function () {
                        $("header").addClass("header-dark");
                    }, 10)
                });

                scene.on("leave", function () {
                    $("header").removeClass("header-dark")
                });

                $("body").hasClass("smooth-scroll") && window.scrollbar.addListener(() => {
                    scene.refresh();
                });

            })
        }, 1000);
    }

    /*=======Scroll Magic Related Setup Function ========*/
    function scrollMagicSetup() {
        var controller = new ScrollMagic.Controller();

        $('.bg-parallax').each(function () {
            var $this = $(this);
            var $thisHeight = $(this).height();
            var bg = $this.find("img");

            var parallax = TweenMax.fromTo(bg, 1, {
                y: '-20%',
                scale: 1
            }, {
                y: '10%',
                scale: 1.12,
                ease: Linear.easeNone
            });
            var parallaxScene = new ScrollMagic.Scene({
                triggerElement: this,
                triggerHook: 1,
                duration: '200%'
            })
                .setTween(parallax)
                .addTo(controller);

            if ($("body").hasClass("smooth-scroll")) {
                window.scrollbar.addListener(() => {
                    parallaxScene.refresh()
                });
            }

        });


        var heroparallax = TweenMax.to('.hero-bg-image', 1, {
            top: "20%",
            scale: 1.12
        });

        var heroScene = new ScrollMagic.Scene({
            triggerElement: '.project-hero',
            triggerHook: 0,
            duration: '200%'
        })
            .setTween(heroparallax)
            .addTo(controller);

        if ($("body").hasClass("smooth-scroll")) {
            window.scrollbar.addListener(() => {
                heroScene.refresh()
            });
        }

        $('.fade-up').each(function () {
            var $this = $(this);
            var elemHeight = $(this).height();
            var scene = new ScrollMagic.Scene({
                triggerElement: $this[0],
                duration: elemHeight
            })
                .addTo(controller);
            scene.triggerHook(1)
            scene.on('enter', function () {
                $this.delay($this.attr('data-delay')).queue(function () {
                    TweenMax.to($this, 0.6, {
                        force3D: true,
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        delay: 0.1,
                        ease: Power2.easeOut
                    });
                });
            });

            if ($("body").hasClass("smooth-scroll")) {
                window.scrollbar.addListener(() => {
                    scene.refresh()
                });
            }
        });
    }


    /*======== Burger Menu Button Setup Function ========*/
    function menuBurgerSetup() {
        var textTl = new TimelineMax();
        var textClose = $('.burger-text .text-close'),
            textMenu = $('.burger-text .text-menu'),
            textOpen = $('.burger-text .text-open');

        $('.menu-burger .burger-wrap').on('mouseenter', function () {

            textTl.clear();

            if ($('.menu-burger').hasClass('is-active')) {

                textTl
                    .to(textMenu, .2, { y: '-50%', autoAlpha: 0 })
                    .fromTo(textClose, .2, { y: '50%', autoAlpha: 0 }, { y: '0%', autoAlpha: 1 });
            } else {
                textTl
                    .to(textMenu, .2, { y: '-50%', autoAlpha: 0 })
                    .fromTo(textOpen, .2, { y: '50%', autoAlpha: 0 }, { y: '0%', autoAlpha: 1 });
            }

        });

        $('.menu-burger').on('click', function () {

            if ($('header').hasClass('header-dark')) {
                $('header').addClass('header-dark-open');
            }

            if ($('#menu-overlay').hasClass('active') && $('header').hasClass('header-dark-open')) {
                $('header').removeClass('header-dark-open');
            }

            textTl.clear();
            textTl
                .to(textMenu, .2, { y: '-50%', autoAlpha: 0 });

            $('#menu-overlay').toggleClass('active');

            if ($('#menu-overlay').hasClass('active')) {
                $('body').addClass('menu-active');
            } else {
                $('body').removeClass('menu-active');
            }

            $('.sub-menu, .primary-nav .children').css('display', 'none');

            $(this).toggleClass('is-active')

            if ($(this).hasClass('is-active')) {
                textTl
                    .to(textOpen, .2, { y: '-50%', autoAlpha: 0 })
                    .fromTo(textClose, .2, { y: '50%', autoAlpha: 0 }, { y: '0%', autoAlpha: 1 });
            } else {
                textTl
                    .to(textClose, .2, { y: '-50%', autoAlpha: 0 })
                    .fromTo(textOpen, .2, { y: '50%', autoAlpha: 0 }, { y: '0%', autoAlpha: 1 });
            }

        });

        $('.menu-burger .burger-wrap').on('mouseleave', function () {
            textTl.clear();
            if ($('.menu-burger').hasClass('is-active')) {
                textTl
                    .to(textOpen, .2, { autoAlpha: 0 })
                    .to(textClose, .2, { y: '50%', autoAlpha: 0 })
                    .to(textMenu, .2, { y: '0%', autoAlpha: 1 });

            } else {
                textTl
                    .to(textClose, .2, { autoAlpha: 0 })
                    .to(textOpen, .2, { y: '50%', autoAlpha: 0 })
                    .to(textMenu, .2, { y: '0%', autoAlpha: 1 });
            }

        });
    }

    /*======== Google Map Setup Function ========*/
    window.initMap = function () {
        if ($("#map").length) {


            if ($('#map_api').length < 1) {
                //Add google map scripts
                var GOOGLE_MAP_KEY = CtKurtMapOptions.map_api;
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.id = "map_api";
                script.src = "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_MAP_KEY;
                document.body.appendChild(script);
            }

            setTimeout(function () {
                try {

                    var latitude = $("#map").data('latitude'),
                        longitude = $("#map").data('longitude'),
                        zoom = $("#map").data('zoom'),
                        cordinates = new google.maps.LatLng(latitude, longitude);

                    var styles = [{ "stylers": [{ "hue": "#ff1a00" }, { "invert_lightness": true }, { "saturation": -100 }, { "lightness": 33 }, { "gamma": 0.5 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#1e1e1e" }] }];

                    var mapOptions = {
                        zoom: zoom,
                        center: cordinates,
                        mapTypeControl: false,
                        disableDefaultUI: true,
                        zoomControl: true,
                        scrollwheel: false,
                        styles: styles
                    };
                    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

                    google.maps.event.addDomListener(window, "resize", function() {
                        var center = map.getCenter();
                        google.maps.event.trigger(map, "resize");
                        map.setCenter(center);
                    });

                    var marker = new google.maps.Marker({
                        position: cordinates,
                        map: map,
                        animation: google.maps.Animation.BOUNCE,
                        icon: CtKurtMapOptions.map_marker_icon,
                        title: "We are here!"
                    });

                } catch (e) {
                    console.log(e);
                }
            }, 1000);

        }
    }

});
