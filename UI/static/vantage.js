function StartDemo() {
 
    $("#welcome").animate({ "top": "-100%", "bottom": "100%" }, 500);
    var request = new XMLHttpRequest()
    request.open(
        'POST', 
        'https://trolltunga.distributedlearning.ai/token/user'
    )
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ "username": "a@demo.org", "password": "demo-456!"}));
    
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            var token = JSON.parse(request.response).access_token
            MakeComputationRequest(token)
        }
    }
}

function MakeComputationRequest(token) {
    var request = new XMLHttpRequest()
    request.open(
        "POST",
        "https://trolltunga.distributedlearning.ai/task"
    )
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.setRequestHeader('Authorization', 'Bearer ' + token);
    request.send(
        JSON.stringify(
            {
                "image": "harbor.distributedlearning.ai/iknl-public/secure-sum-arm",
                "collaboration_id": 1,
                "organizations":
                [
                    {
                        "id":1,
                        "input": {
                            "method":"master", 
                            "args": [],
                            "kwargs":{}
                        }
                    }
                ]
            }
        )
    );

    request.onreadystatechange = function() {
        if (request.readyState === 4) {
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
        "https://trolltunga.distributedlearning.ai/result/" + result_id.toString()
    )
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.setRequestHeader('Authorization', 'Bearer ' + token);
    
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            // computation request has been send
            var finished = JSON.parse(request.response).finished_at
            if (finished != null) {
                var results = JSON.parse((JSON.parse(request.response).result))
                LoadedData(results)
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

function LoadedData(results) {
    $("#loader").animate({ "top": "-100%", "bottom": "100%" }, 500);

    

    var age_result = document.getElementById("result-age");
    var weight_result = document.getElementById("result-weight");
    
    age_result.innerHTML = Math.round(results.age * 10) / 10
    weight_result.innerHTML = Math.round(results.weight * 10) / 10
}

function BackToStart() {
    $(".main-section").animate({ "top": "150px", "bottom": "30px" }, 500);
}

var ageslider = document.getElementById("age");
var ageoutput = document.getElementById("age-out");
ageoutput.innerHTML = ageslider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
ageslider.oninput = function () {
    ageoutput.innerHTML = this.value;
}
ageslider.onchange = function () {
    ageoutput.innerHTML = this.value;
    WriteData();
}

var weightslider = document.getElementById("weight");
var weightoutput = document.getElementById("weight-out");
weightoutput.innerHTML = weightslider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
weightslider.oninput = function () {
    weightoutput.innerHTML = this.value;
}
weightslider.onchange = function () {
    weightoutput.innerHTML = this.value;
    WriteData();
}

function WriteData(){
    var request = new XMLHttpRequest()
    request.open('GET', 'http://localhost/update?age='+ageoutput.innerHTML+'&&weight='+weightoutput.innerHTML)
    request.send()
}


