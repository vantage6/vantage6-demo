// function SliderRange(min, max) {
//     $( "#slider-range-length" ).slider({
//       range: true,
//       min: 0,
//       max: 500,
//       values: [ 75, 300 ],
//       slide: function( event, ui ) {
//         $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
//       }
//     });
//     $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
//       " - $" + $( "#slider-range" ).slider( "values", 1 ) );
// }

// var range_length = document.getElementById("slider-range-length")
// SliderRange()

var slider = document.getElementById('slider');

noUiSlider.create(slider, {
    start: [20, 80],
    connect: true,
    range: {
        'min': 0,
        'max': 100
    }
});