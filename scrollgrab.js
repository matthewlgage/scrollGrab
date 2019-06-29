/* ---------------------------------------------
ScrollGrab
Version: 1.0.0
Author: Matthew Gage
Licensed under MIT: http://www.opensource.org/licenses/mit-license.php
---------------------------------------------- */

function ScrollGrab(selector, options) {
    this.elements = document.querySelectorAll(selector);
    this.userOptions = options !== undefined ? options : {};

    this.defaultOptions = {
        autoHide: false,
        autoHideDelay: 1500,
        enableButtonScroll: false,
        enableKeyScroll: true,
        enableMouseWheel: true,
        responsive: true,
        scrollInteger: 15,
        theme: 'light'
    };

    //Merge Default Options with User Options
    this.options = Object.assign(this.defaultOptions, this.userOptions);

    this.init = function(element) {
        //Create Scroller Wrapper Element
        var $scrollGrabWrapper = document.createElement('div');
        $scrollGrabWrapper.classList.add('scrollgrab');
        $scrollGrabWrapper.style.height = element.offsetHeight + 'px';

        //Create Scroller Content Element
        var $scrollGrabContent = document.createElement('div');
        $scrollGrabContent.classList.add('scrollgrab-content');
    
        //Create Scroller Scrollbar Element
        var $scrollGrabScrollbar = document.createElement('div');
        $scrollGrabScrollbar.classList.add('scrollgrab-scrollbar', this.options.theme);

        //Create Scroller Scrollbar Tab Element
        var $scrollGrabScrollbarTab = document.createElement('span');
        $scrollGrabScrollbarTab.classList.add('scrollgrab-scrollbar-tab');
        
        //Inject Scroller Elements        
        element.parentElement.insertBefore($scrollGrabWrapper, element);
        $scrollGrabScrollbar.appendChild($scrollGrabScrollbarTab);
        $scrollGrabContent.appendChild(element);
        $scrollGrabWrapper.appendChild($scrollGrabContent);
        $scrollGrabWrapper.appendChild($scrollGrabScrollbar);

        if (this.options.enableButtonScroll) {
            $scrollGrabScrollbar.classList.add('buttons');

            //Create Button Elements
            var $scrollGrabButtonUp = document.createElement('button');
            $scrollGrabButtonUp.classList.add('scrollgrab-up');
            var $scrollGrabButtonDown = document.createElement('button');
            $scrollGrabButtonDown.classList.add('scrollgrab-down');

            //Inject Button Elements
            $scrollGrabScrollbar.appendChild($scrollGrabButtonUp);
            $scrollGrabScrollbar.appendChild($scrollGrabButtonDown);
        }
    }

    this.autoHide = function(element) {
        setTimeout(function() {
            element.classList.add('auto-hide');
        }, this.options.autoHideDelay);
    }

    this.dragTab = function(event, element) {
        var $rootElement = element.parentElement.parentElement;
        
        var $positionEverything = function(event) {
            $this.positionTab('detect', $rootElement, event);
            $this.positionContent($rootElement, event);
        }

        event.preventDefault();

        //Allows mouse drag functionality on left click only
        if (event.which === 1) {
            element.classList.add('focus');

            //Start Drag Events
            $rootElement.addEventListener('mousemove', $positionEverything);

            //Stop Drag Events
            $rootElement.addEventListener('mouseup', function() {
                element.classList.remove('focus');
                $rootElement.removeEventListener('mousemove', $positionEverything);
            });
            document.addEventListener('mouseup', function() {
                element.classList.remove('focus');
                $rootElement.removeEventListener('mousemove', $positionEverything);
            });
        }
    }

    this.keyScroll = function(event, element) {
        switch(event.keyCode) {
            case 38: this.positionTab('up', element);
            break;
            case 40: this.positionTab('down', element);
            break;
        }

        this.positionContent(element);
    }

    this.positionContent = function(element, event) {
        var $element = element;
        var $clientHeight = $element.clientHeight;
        var $scrollContent = $element.firstChild;

        //Mouse Wheel & Keypress Positioning
        if (event === undefined) {
            var $scrollBar = $element.lastChild;
            var $scrollTab = $scrollBar.firstChild;
            var $scrollTabRect = $scrollTab.getBoundingClientRect();
            var $scrollTabHeight = $scrollTabRect.height;
            var $scrollTabPosition = $scrollTabRect.top - element.offsetTop;
            var $scrollContentPosition = ($scrollHeight - $clientHeight) * ($scrollTabPosition / ($clientHeight - $scrollTabHeight));

            $scrollContent.style.top = '-' + $scrollContentPosition + 'px';
        }

        //Mouse Drag Positioning
        else {
            var $elementRect = $element.getBoundingClientRect();
            var $maxContentHeight = $scrollHeight - $clientHeight;
            var $scrollContentPosition = $maxContentHeight * ((event.clientY - $elementRect.top) / $elementRect.height);

            if ($scrollContentPosition < $maxContentHeight) {
                $scrollContent.style.top = '-' + $scrollContentPosition + 'px';
            }
        }
    }

    this.positionTab = function(direction, element, event) {
        var $element = element;
        var $clientHeight = $element.clientHeight;
        var $scrollBar = $element.lastChild;
        var $scrollTab = $scrollBar.firstChild;
        var $scrollTabRect = $scrollTab.getBoundingClientRect();
        var $scrollTabHeight = $scrollTabRect.height;
        var $scrollTabPosition = $scrollTabRect.top - $element.offsetTop;
        var $scrollerMin = this.options.scrollInteger;
        var $scrollerMax = $clientHeight - $scrollTabHeight - $scrollerMin;

        //Up
        if (direction === 'up') {
            if ($scrollTabPosition > $scrollerMin) {
                $scrollTab.style.top = ($scrollTabPosition - $scrollerMin) + 'px';
            }
            else { $scrollTab.style.top = 0 + 'px'; }
        }

        //Down
        if (direction === 'down') {
            if ($scrollTabPosition < $scrollerMax) {
                $scrollTab.style.top =  ($scrollTabPosition + $scrollerMin) + 'px';    
            }
            else { $scrollTab.style.top = ($clientHeight - $scrollTabHeight) + 'px'; }
        }

        //Mouse Drag
        if (direction === 'detect') {
            var $mousePosition = (event.clientY - $element.offsetTop) / $clientHeight;
            var $maxScrollerHeight = $clientHeight - $scrollTabHeight;
            var $newTabPosition = $mousePosition * $maxScrollerHeight;

            $scrollTab.style.top = $newTabPosition + 'px';
        }
    }

    this.setTabHeight = function(element, height) {
        element.style.height = Math.round(height) + 'px';
    }

    this.stopAutoHide = function(element) {
        element.classList.remove('auto-hide');
    }

    this.wheelScroll = function(event, element) {
        event.deltaY < 0 ? this.positionTab('up', element) : this.positionTab('down', element);
        
        element.focus();
        this.positionContent(element);
    }

    this.windowResize = function() {
        var $scrollers = document.querySelectorAll('.scrollgrab');

        for (var i = 0; $scrollers.length > i; i++) {
            var $element = $scrollers[i];
            var $originalElement = $element.firstChild.firstChild;
            var $originalElementHeight = $originalElement.getBoundingClientRect().height;
            var $elementHeight = $element.offsetHeight;
            var $scrollHeight = $element.firstChild.scrollHeight;
            var $scrollTabHeight = $elementHeight * ($elementHeight / $scrollHeight);

            $scrollers[i].style.height = $originalElementHeight + 'px';
            $this.setTabHeight($element.lastChild.firstChild, $scrollTabHeight)
        }
    }

    for (var i = 0; this.elements.length > i; i++) {
        var $this = this;
        var $element = this.elements[i];

        if ($element.scrollHeight > $element.offsetHeight) {
            this.init($element);

            var $elementHeight = $element.offsetHeight;
            var $scroller = $element.parentElement.parentElement;
            var $scrollHeight = $scroller.scrollHeight;
            var $scrollBar = $scroller.lastChild;
            var $scrollTab = $scrollBar.firstChild;
            var $scrollTabHeight = $elementHeight * ($elementHeight / $scrollHeight);
            var $buttonUp = $scrollTab.nextSibling;
            var $buttonDown = $scrollBar.lastChild;

            //Set height of scroller tab based on height of container
            this.setTabHeight($scrollTab, $scrollTabHeight);

            //Drag events for scrollbar tab and content
            $scrollBar.addEventListener('click', function(event) {
                var $rootElement = this.parentElement;
                
                //Mimic default scrollbar function and reposition content on scroll bar click
                if (event.target === $scrollBar) {
                    $this.positionContent($rootElement, event);
                    $this.positionTab('detect', $rootElement, event);
                }
            });

            $scrollTab.addEventListener('mousedown', function(event) {          
                $this.dragTab(event, this);
            });

            //Automatically hides scroll bar if 'autoHide' is set to true
            if (this.options.autoHide) {
                this.autoHide($scrollBar);

                $scroller.addEventListener('mouseenter', function() {
                    $this.stopAutoHide($scrollBar);
                });
                $scroller.addEventListener('mouseleave', function() {
                    $this.autoHide($scrollBar);
                });
            }

            //Allows scrolling via button click if 'enableButtonScroll' is set to true
            if (this.options.enableButtonScroll) {
                $buttonUp.addEventListener('click', function() {
                    var $rootElement = this.parentElement.parentElement;
                    
                    $this.positionTab('up', $rootElement);
                    $this.positionContent($rootElement);
                });
                $buttonDown.addEventListener('click', function() {
                    var $rootElement = this.parentElement.parentElement;
                    
                    $this.positionTab('down', $rootElement);
                    $this.positionContent($rootElement);
                });
            }
            
            //Allows scrolling via keypress if 'enableKeyScroll' is set to true
            if (this.options.enableKeyScroll) {
                $scroller.setAttribute('tabindex', 0);

                $scroller.addEventListener('keydown', function(event) {
                    $this.keyScroll(event, this);
                });
            }

            //Allows scrolling via mouse wheel if 'enableMouseWheel' is set to true
            if (this.options.enableMouseWheel) {
                $scroller.addEventListener('wheel', function(event) {
                    $this.wheelScroll(event, this);
                }, {passive: true});
            }
        }
    }

    //Updates scrollers in the event of window resizing
    if (this.options.responsive) {
        window.addEventListener('resize', this.windowResize);
    }
}

var scrollGrab = function(selector, options) {
    return new ScrollGrab(selector, options);
}