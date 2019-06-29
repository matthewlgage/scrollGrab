# Scrollbar
Scrollbar is a light weight vanilla javascript plugin (12kb) that replaces native vertical scroll and allows you to customize scrolling functionality

## Usage

```javascript
Any css selector can be used to apply the scrollbar functionality to every element using the corresponding selector

Example:
scrollGrab('.your-class');

Each div below will receive the scrollbar functionality.

<div class=".your-class"></div>
<div class=".your-class"></div>
<div class=".your-class"></div>

Additional Examples:
scrollGrab('#your-id');
scrollGrab('[your-attribute]');
scrollGrab('.your-class #your-id[your-attribute]');
```

## Default Options 

```javascript
These are the initial options:
{
  autoHide: false,
  autoHideDelay: 1500,
  enableButtonScroll: false,
  enableKeyScroll: true,
  enableMouseWheel: true,
  responsive: true,
  scrollInteger: 15,
  theme: 'light'
}

'autoHide' Automatically hides the scrollbar when not in use.
'autoHideDelay' Is the integer in which the auto hide is applied in milliseconds.
'enableButtonScroll' Enables or disables button scrolling.
'enableKeyScroll' Enables or disables key scrolling (up and down).
'enableMouseWheel' Enables or disables scrolling with the mouse wheel.
'responsive' Enables or disables auto resizing on window resize.
'scrollInteger' Is the integer that determines how far the the content scrolls in pixels.
'theme' Corresponds to the available themes. There is a light and dark theme. Leave blank for custom styling.
```

## Customizing Options

```javascript
Example:

scrollGrab('.your-class', {
  enableButtonScroll: true,
  enableMouseWheel: false
});

This will add button scrolling to the scrollbar and disable mouse wheel scrolling.
```

## License
[MIT](http://www.opensource.org/licenses/mit-license.php)