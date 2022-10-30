/*jshint esversion: 8 */

/* global console*/
(function () {
    console.log("Initializing...");

    let httpRequest = new XMLHttpRequest();
    httpRequest.overrideMimeType("application/json");
    httpRequest.open('GET',
                     'phrases.json',
                     false);

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            loadJSON(httpRequest.responseText);
        }
    };

    httpRequest.send(null);

    function loadJSON(response) {
        // Parse JSON string into object
        let json = JSON.parse(response);

        json['phrases'].forEach((obj) => {
            console.log(obj);
        });
    }

    console.log("Initialized...");
})();
