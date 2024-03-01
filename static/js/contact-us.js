var turnstileToken = null;



window.onloadTurnstileCallback = function () {
    $('#submitbtn').prop("disabled",true);
    turnstile.render('#turnstilebox', {
        sitekey: window.turnstileSiteKey,
        callback: function(token) {
            console.log(`Challenge Success!! ${token}`);
            if (window.Hula && window.Hula.SetCaptcha) {
                window.Hula.SetCaptcha(token);
            } else {
                console.log("No Hula.SetCaptcha");
            }   
            turnstileToken = token;
            validdatethese['turnstile'] = true;
            checkFields();
        },
    });
};



window.submit_successcb = function(data) {
    console.log("SUCCESS on form submission")
    console.dir(data)
    var output
    try {
        if (data && data.resp) {
            output = JSON.parse(data.resp)
            output = output.feedback
        }
    } catch(e) {
        output = "Thank you!"
    }
    document.getElementById('successresult').innerHTML = output;
    document.getElementById('successresult').style.display = 'block';
    document.getElementById('contactform').style.display = 'none';
    document.getElementById('failureresult').style.display = 'none';
}
window.submit_onfailure = function(error) {
    console.error("FAILURE on form submission")
    document.getElementById('successresult').innerHTML = output;
    document.getElementById('successresult').style.display = 'none';
    document.getElementById('contactform').style.display = 'block';
    document.getElementById('failureresult').style.display = 'block';

}


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
    validatekeys.forEach(function(id) {
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
// disable the default behavior on the submit button
// otherwise clicking it, if the forms.js is not loaded, will cause a page reload
document.getElementById('submitbtn').addEventListener('click', function(event) {
    event.preventDefault();
  });

    validatekeys = Object.keys(validdatethese);
    validatekeys.forEach(function(id) {
        if (id != 'turnstile') {
            document.getElementById(id).value = "";
            document.getElementById(id).onchange = function() {
                console.log("changed: ", id);
                validdatethese[id] = true;
                if(document.getElementById(id).checkValidity()) {
                    validdatethese[id] = true;
                }
                checkFields();
            }
            $('#'+id).keyup(function() {
                console.log("keyup: ", id);
                if(document.getElementById('contactform').checkValidity()) {
                    validdatethese[id] = true;
                }
                checkFields();
            })
            $('#'+id).focusout(function() {
                console.log("focusout: ", id);
                if (document.getElementById('contactform').checkValidity()) {
                    validdatethese[id] = true;
                }
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
//        e.preventDefault();
        // if(checkFields()) {
        //     processForm();
        // }
     });

});
