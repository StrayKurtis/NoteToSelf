## Kurtis Key's Code Sample

This code sample is a complete mobile-ready responsive 'ToDo' application. Built using a mobile-first approach, and implementing media queries for larger displays later in the development process, the design works well on any size screen.

This project was completed using HTML5, CSS3, JavaScript, and PHP. 

The user interface was built using W3C-valid HTML5, making use of the new custom 'data-' attributes and semantic markup tags.

Styling of the UI was done using CSS3, employing many new features such as pseudo-elements+selectors, imageless gradients and border-radius.

The localStorage API was applied legacy JavaScript in the form of the 'NoteToSelf' object(/js/NoteToSelf.js) allowing for client side storage and offline application usage by eliminating the need for server-side storage. The interface was enhanced using a combination of JavaScript and CSS3 animations, also allowing for the addition of dynamic content without the need for a single page refresh.

However, using PHP5/MySQL/PDO with a side of AJAX/JSON, I also implemented server-side storage. Using AJAX, PHP and JavaScript communicate in JSON in order to save your local todo list on the web server, also allowing you to load them from the MySQL database at any time.

Live view: http://kurtisdesigns.net/notetoself/

######Files:
* index.html - Main application interface   
* user.php - Server-side storage PHP class   
* js/NoteToSelf.js - NoteToSelf object   
* css/index.css - Main stylesheet   
* css/reset.css - Basic style reset   
