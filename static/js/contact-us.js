var turnstileToken = null;



window.onloadTurnstileCallback = function () {
    $('#submitbtn').prop("disabled",true);
    turnstile.render('#turnstilebox', {
        sitekey: window.turnstileSiteKey,
        callback: function(token) {
            console.log(`Challenge Success ${token}`);
            turnstileToken = token;
            validdatethese['turnstile'] = true;
            checkFields();
        },
    });
};



function processForm() {
    //        var formdata = $('#contactform').serialize();
        var data = {};
        data['name'] = $('#contact-name').val();
        data['email'] = $('#contact-email').val();
        data['message'] = $('#contact-message').val();
        data['turnstile'] = turnstileToken;
        // console.dir(data);
        var formdata = JSON.stringify(data);

        // console.log("Data: ",formdata);
        // alert('submit3!');
        $('#submitbtn').prop("disabled",true);
        $('#submitbtn').html("Sending...");
        $("#dlgmsg").html("");        
        $.ajax({
            type: "POST", 
            url: 'postcontact.php',
            data: formdata,
            dataType: "json",
            success: function(response)
            {
//                console.log("got response: ", response)
//                var jsonData = JSON.parse(response.responseText);
                $('#submitbtn').css("background", "green");
                $('#submitbtn').html("Message sent! We will be in touch.");                 
                // // user is logged in successfully in the back-end
                // // let's redirect
                // if (jsonData.success == "1")
                // {
                //     location.href = 'my_profile.php';
                // }
                // else
                // {
                //     alert('Invalid Credentials!');
                // }

                setTimeout(function(){
                    $("#contactModal").modal("hide");
                    $('#submitbtn').css("background", "");
                    $('#submitbtn').html("Send");
                    $('#submitbtn').prop("disabled",false);
                }, 20*1000);
           },
           error: function(response) 
           {
                var msg = "error";
                try {
                    var rsp = JSON.parse(response.responseText);
                    var msg = rsp.error;
                } catch(e) {
                    msg = "Other error: " + e;
                }
                console.log("got response: ", response)
                $("#dlgmsg").html("<b>Error:</b>&nbsp"+msg);
                setTimeout(function(){
                    $('#submitbtn').css("background", "");
                    $('#submitbtn').html("Send");
                    $('#submitbtn').prop("disabled",false);
                }, 2*1000);
           }
        });
}

emailok = false;

var validdatethese = {
    'contact-email': false,
    'contact-message': false,
    'contact-name': false,
    'turnstile': false,
}

function checkFields() {
    var ok = true;
    validatethese.forEach(function(id) {
        ok = ok && validdatethese[id];
    });
    if(ok) {
        $('#submitbtn').prop("disabled",false);
    } else {
        $('#submitbtn').prop("disabled",true);
    }
    return ok;
}

$(document).ready(function() {
    validatethese = Object.keys(validdatethese);
    validatethese.forEach(function(id) {
        if (id != 'turnstile') {
            document.getElementById(id).value = "";
            document.getElementById(id).onchange = function() {
                console.log("changed: ", id);
                validdatethese[id] = true;
                document.getElementById(id).checkValidity();
                checkFields();
            }
            $('#'+id).keyup(function() {
                console.log("keyup: ", id);
                document.getElementById('contactform').checkValidity();
                checkFields();
            })
            $('#'+id).focusout(function() {
                console.log("focusout: ", id);
                document.getElementById('contactform').checkValidity();
                checkFields();
            })  
            $('#'+id).on('invalid', function(e){
                validdatethese[id] = false;
                console.log("invalid: ", id);
                checkFields();
            });
    
        }
    })
    $('#contactform').submit(function(e) {
        e.preventDefault();
        if(checkFields()) {
            processForm();
        }
     });

});



// function sendEmail() {
//     var xhr = new XMLHttpRequest();
 
// xhr.onreadystatechange = function() {
//   if(xhr.readyState === 4) {
//     if(xhr.status === 200) {
//          alert(xhr.responseText);
//     } else {
//           alert('Error Code: ' +  objXMLHttpRequest.status);
//           alert('Error Message: ' + objXMLHttpRequest.statusText);
//     }
//   }
// }
// xhr.open('POST', 'postcontact.php');
// xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// // xhr.send("format=json");
// xhr.send();
// // var resp = xml.responseText;
// //     console.log(resp);	
// }
