// import username and password from config
var imported = document.createElement('script');
imported.src = '../static/config.js';
document.head.appendChild(imported);

var weight_range, age_range;

function StartDemo() {
    $("#welcome").animate({ "top": "-100%", "bottom": "100%" }, 500);
    var request = new XMLHttpRequest()
    request.open(
        'POST',
        'https://petronas.vantage6.ai/token/user'
    )
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ "username": USERNAME, "password": PASSWORD}));

    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            var token = JSON.parse(request.response).access_token
            MakeComputationRequest(token)
        }
    }
}

function getNoUiSliderRange(slider){
    return slider.noUiSlider.get();
}

function MakeComputationRequest(token) {
    var request = new XMLHttpRequest()
    request.open(
        "POST",
        "https://petronas.vantage6.ai/task"
    )
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.setRequestHeader('Authorization', 'Bearer ' + token);

    weight_range = getNoUiSliderRange(weight_slider);
    age_range = getNoUiSliderRange(age_slider);

    var requirements = [
        // {
        //     "range": true,
        //     "name": "length",
        //     "lowerLimit": {
        //         "type": "numeric",
        //         "value": String(length_range[0]),
        //         "attributeName": "length"
        //     },
        //     "upperLimit": {
        //         "type": "numeric",
        //         "value": String(length_range[1]),
        //         "attributeName": "length"
        //     }
        // },
        {
            "range": true,
            "name": "weight",
            "lowerLimit": {
                "type": "numeric",
                "value": String(weight_range[0]),
                "attributeName": "weight"
            },
            "upperLimit": {
                "type": "numeric",
                "value": String(weight_range[1]),
                "attributeName": "weight"
            }
        },
        {
            "range": true,
            "name": "age",
            "lowerLimit": {
                "type": "numeric",
                "value": String(age_range[0]),
                "attributeName": "age"
            },
            "upperLimit": {
                "type": "numeric",
                "value": String(age_range[1]),
                "attributeName": "age"
            }
        }
    ]
    console.log(requirements)

    input_encoded =
        btoa(
            'json.' +
            JSON.stringify({
                'method': 'health_ri_demo',
                'master': true,
                'output_format': 'json',
                'args': [
                    [13, 14], //the node IDs
                    requirements  // range data
                ]
            })
        )

    request.send(
        JSON.stringify(
            {
                "image": "harbor2.vantage6.ai/demo/health-ri-demo-arm",
                "collaboration_id": 8,
                "name": 'health-ri-demo',
                "description": 'health-ri-demo',
                "organizations": [
                    {
                        "id": 22,
                        "input": input_encoded
                    }
                ],
            }
        )
    );

    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            console.log(request.response)
            // computation request has been send
            var id_ = JSON.parse(request.response).results[0].id
            // alert("start polling2")
            results = PollResults(id_, token)
        }
    }
}

function PollResults(result_id, token) {
    var request = new XMLHttpRequest()

    request.open(
        "GET",
        "https://petronas.vantage6.ai/result/" + result_id.toString()
    )
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.setRequestHeader('Authorization', 'Bearer ' + token);

    request.onreadystatechange = function() {
        console.log(request.response)
        if (request.readyState === 4) {
            // computation request has been send
            var finished = JSON.parse(request.response).finished_at
            if (finished != null) {
                encoded_result = JSON.parse(request.response).result
                decoded_result = atob(encoded_result)
                var result = decoded_result.slice(-1)
                LoadedData(result)
            }
            else {
                setTimeout(function () {
                    PollResults(result_id, token)
                }, 2000)
            }
        }
    }
    request.send()

}

function EnteredData() {
    $("#data-entry").animate({ "top": "-100%", "bottom": "100%" }, 500);

}

function LoadedData(result) {
    $("#loader").animate({ "top": "-100%", "bottom": "100%" }, 500);
    var final_result = document.getElementById("result-count");

    final_result.innerHTML = result

    var weight_table_cell = document.getElementById('td-weight-cell')
    var age_table_cell = document.getElementById('td-age-cell')

    weight_table_cell.innerHTML = `${weight_range[0]} - ${weight_range[1]} kg`
    age_table_cell.innerHTML = `${age_range[0]} - ${age_range[1]} years`
}

function BackToStart() {
    $(".main-section").animate({ "top": "150px", "bottom": "30px" }, 500);
}

var data1slider = document.getElementById("data1");
var data1output = document.getElementById("data1-out");
if (data1output !== null){
    data1output.innerHTML = data1slider.value; // Display the default slider value
    // Update the current slider value (each time you drag the slider handle)
    data1slider.oninput = function () {
        data1output.innerHTML = this.value;
    }
    data1slider.onchange = function () {
        data1output.innerHTML = this.value;
        WriteData();
    }
}


var data2slider = document.getElementById("data2");
var data2output = document.getElementById("data2-out");
if (data2output !== null){
    data2output.innerHTML = data2slider.value; // Display the default slider value
    // Update the current slider value (each time you drag the slider handle)
    data2slider.oninput = function () {
        data2output.innerHTML = this.value;
    }
    data2slider.onchange = function () {
        data2output.innerHTML = this.value;
        WriteData();
    }
}

var data3slider = document.getElementById("data3");
var data3output = document.getElementById("data3-out");
if (data3output !== null){
    data3output.innerHTML = data3slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    data3slider.oninput = function () {
        data3output.innerHTML = this.value;
    }
    data3slider.onchange = function () {
        data3output.innerHTML = this.value;
        WriteData();
    }
}

var datalabel = document.getElementById("datalabel");

function WriteData(){
    var request = new XMLHttpRequest()
    request.open('GET', 'http://localhost/update?data1='+data1output.innerHTML+'&&data2='+data2output.innerHTML+'&&data3='+data3output.innerHTML+'&&label='+datalabel.innerHTML)
    request.send()
}


// Sliders on home page
function setSlider(slider_name, min, max, start_range){
    var slider = document.getElementById(slider_name);

    values_slider = Array.from(Array(max).keys())

    var format = {
        to: function(value) {
            return values_slider[Math.round(value)];
        },
        from: function (value) {
            return values_slider.indexOf(Number(value));
        }
    }

    noUiSlider.create(slider, {
        connect: true,
        range: {
            'min': min,
            'max': max
        },
        margin: 10, // values at least 10 apart
        format: format, // show only ints, not float values
        tooltips: true,
        // Show a scale with the slider
        pips: {
            mode: 'steps',
            stepped: true,
            density: 4
        },
        start: start_range,
    });
    return slider;
}
var age_slider = setSlider('slider-age', 0, 120, [0, 119])
var weight_slider = setSlider('slider-weight', 0, 300, [0, 280])