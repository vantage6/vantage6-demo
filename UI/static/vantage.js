function StartDemo() {

    $("#welcome").animate({ "top": "-100%", "bottom": "100%" }, 500);
    var request = new XMLHttpRequest()
    request.open(
        'POST',
        'https://petronas.vantage6.ai/token/user'
    )
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ "username": "***", "password": "***"}));

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
        "https://petronas.vantage6.ai/task"
    )
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.setRequestHeader('Authorization', 'Bearer ' + token);
    request.send(
        JSON.stringify(
            {
                "image": "harbor2.vantage6.ai/demo/secure-sum-arm",
                "collaboration_id": 8,
                "organizations":
                [
                    {
                        "id":12,
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
        "https://petronas.vantage6.ai/result/" + result_id.toString()
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

var data1slider = document.getElementById("data1");
var data1output = document.getElementById("data1-out");
data1output.innerHTML = data1slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
data1slider.oninput = function () {
    data1output.innerHTML = this.value;
}
data1slider.onchange = function () {
    data1output.innerHTML = this.value;
    WriteData();
}

var data2slider = document.getElementById("data2");
var data2output = document.getElementById("data2-out");
data2output.innerHTML = data2slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
data2slider.oninput = function () {
    data2output.innerHTML = this.value;
}
data2slider.onchange = function () {
    data2output.innerHTML = this.value;
    WriteData();
}

var data3slider = document.getElementById("data3");
var data3output = document.getElementById("data3-out");
data3output.innerHTML = data3slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
data3slider.oninput = function () {
    data3output.innerHTML = this.value;
}
data3slider.onchange = function () {
    data3output.innerHTML = this.value;
    WriteData();
}

var datalabel = document.getElementById("datalabel");

function WriteData(){
    var request = new XMLHttpRequest()
    request.open('GET', 'http://localhost/update?data1='+data1output.innerHTML+'&&data2='+data2output.innerHTML+'&&data3='+data3output.innerHTML+'&&label='+datalabel.innerHTML)
    request.send()
}


