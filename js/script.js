// Freelancer Theme JavaScript

(function($) {
    "use strict"; // Start of use strict

    var constituencyDetails = {};

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('.page-scroll a').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function(){ 
            $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    // Floating label headings for the contact form
    $(function() {
        $("body").on("input propertychange", ".floating-label-form-group", function(e) {
            $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
        }).on("focus", ".floating-label-form-group", function() {
            $(this).addClass("floating-label-form-group-with-focus");
        }).on("blur", ".floating-label-form-group", function() {
            $(this).removeClass("floating-label-form-group-with-focus");
        });
    });

    $(document).ready(function(){
        // Input auto suggest binding
        var input = document.getElementById('locationTextField');
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', function() {
                //$(".leaflet-popup-close-button")[0].click();
                var place = autocomplete.getPlace();
                var lat = place.geometry.location.lat();
                var lng = place.geometry.location.lng();
                map.setView(new L.LatLng(lat, lng), 15);
                //$("#map").css({"opacity" : 1});
        });
        

        function style(feature) {
            return {
                fillColor : '#FFEDA0', weight : 2, opacity : 1, color : 'black', dashArray : '1', fillOpacity : 0.1
            };
        }

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({ weight : 5, color : 'black', dashArray : '', fillOpacity : 0.7 });

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }
            info.update(layer.feature.properties);
        }

        function resetHighlight(e) {
            var layer = e.target;

            layer.setStyle({ fillColor : '#FFEDA0', weight : 2, opacity : 1, color : 'black', dashArray : '1', fillOpacity : 0.1 });

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }
            info.update(layer.feature.properties);
        }

        function zoomToFeature(e) {
            var layer = e.target;
            //console.log(layer.feature.properties);
            constituencyDetails.constituencyName = layer.feature.properties.Name;
            $("#lblConstituencyName").html(layer.feature.properties.Name);
            info.update(layer.feature.properties);
            
            $('html, body').stop().animate({
                scrollTop: ($("#volunteer").offset().top - 50)
            }, 1250, 'easeInOutExpo');
        }

        function onEachFeature(feature, layer) {
            layer.on({ mouseover : highlightFeature, mouseout : resetHighlight, click : zoomToFeature });
        }

        var geojson;
        var info = L.control();
        info.onAdd = function(map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        // method that we will use to update the control based on feature properties passed
        info.update = function(props) {
            this._div.innerHTML = '<h4>Delhi</h4>'
                    + (props ? '<b>' + props.Name + '</b><br />'
                            : 'Hover over a district');
        };

        var map = L.map('map', { center : [28.6456024, 77.21110499999998 ], zoom : 10, zoomControl : true, scrollWheelZoom : false,
            dragging : true, touchZoom : false, doubleClickZoom : true });

        map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));

        info.addTo(map);

        var acjson = L.geoJson(ac_data, { style : style, onEachFeature : onEachFeature }).addTo(map);
        
        $("#contactForm").on("submit", function(){
            //var hasError = $("#contactForm").hasClass("error");
            //alert(selectedSchoolId);
            // If validation fails then return;
            
            if($("#name").val() === "" || $("#email").val() === "" || $("#phone").val() === "" || $("#message").val() === "")
                return;

            if(!constituencyDetails.constituencyName){
                alert("Please select a constituency before submitting your request.");
                return;
            }
            var newPostKey = firebase.database().ref('volunteer_requests').push().key;
            
            constituencyDetails.volunteerName = $("#name").val();
            constituencyDetails.volunteerPhone = $("#email").val();
            constituencyDetails.volunteerEmail = $("#phone").val();
            constituencyDetails.volunteerMessage = $("#message").val();
            var updates = {};
            updates['/volunteer_requests/' + newPostKey] = constituencyDetails;

            firebase.database().ref().update(updates).then(function(data){
                $("#name").val("");
                $("#email").val("");
                $("#phone").val("");
                $("#message").val("");
                alert("Your request to volunteer has been submitted successfully. The school administration will contact you soon.");
            });
        })
    });

    // Load Schools on Map
//    function onEachFeatureSchool(feature, layer) {
//        
//        var html_for_popup = '<div class="schoolTooltip">'
//            +'<h4>'+layer.feature.properties.SchoolName +'</h4>'
//            +'<h5>'+layer.feature.properties.Address +'</h5>'
//            +'<p class="page-scroll"><a href="#volunteer"><button type="button" ng-click="getSchoolIdForPrashant('+layer.feature.properties.SchoolID+')" class="btn btn-success btn-block">INTERESTED IN VOLUNTEERING</button></a></p>'
//        + '</div>';
//
//        var link = $(html_for_popup).click(function() {
//            schoolDetails = layer.feature.properties;
//            $("#lblSchoolName").html(layer.feature.properties.SchoolName);
//            $("#lblSchoolAddress").html(layer.feature.properties.Address);
//        })[0];
//        
//        layer.bindPopup(link,{keepInView:true});
//    }
//
//    var geojson;
//
//    var school = L.control();
//
//    var map = L.map('map', {
//        center : [28.6456024, 77.21110499999998 ],
//        zoom : 11,
//        zoomControl : true,
//        scrollWheelZoom : false,
//        dragging : true,
//        touchZoom : false,
//        doubleClickZoom : true
//    });
//
//    map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));
//    
//
//    var schooljson = L.geoJson(school_data, {
//        onEachFeature : onEachFeatureSchool
//    }).addTo(map);


})(jQuery); // End of use strict
