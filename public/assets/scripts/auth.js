$(document).ready(function() {
  var firstNameComplete = false;
  var lastNameComplete = false;
  var emailComplete = false;
  var passwordComplete = false;
  var confirmPasswordComplete = false;

  $("#first-name").keyup(function(){
    if($("#first-name").val() != ""){
      firstNameComplete = true;
      hasSuccess("#first-name-group","#first-name-span");
    }
    else{
      firstNameComplete = false;
      hasError("#first-name-group","#first-name-span");
    }
    checkForm();
  });
  $("#last-name").keyup(function(){
    if($("#last-name").val() != ""){
      lastNameComplete = true;
      hasSuccess("#last-name-group","#last-name-span");
    }
    else{
      lastNameComplete = false;
      hasError("#last-name-group","#last-name-span");
    }
    checkForm();
  });

  $("#email").keyup(function(){
    if($("#email").val() != "" && $("#email").val().includes("@") && $("#email").val().includes(".") && $("#email").val().length > 5 && $("#email").val().indexOf("@.") == -1 && $("#email").val().indexOf(" ") == -1){
      emailComplete = true;
      hasSuccess("#email-group","#email-span");
    }
    else{
      emailComplete = false;
      hasError("#email-group","#email-span");
    }
    checkForm();
  });

  $("#password").keyup(function(){
    var password = $('#password').val();
    var hasNumbers = /\d/.test(password);
    var hasNonalphas = /\W/.test(password);
    if(hasNumbers && hasNonalphas){
      passwordComplete = true;
      hasSuccess("#password-group","#password-span");

      if($("#confirm-password").val() != ""){
        if($("#confirm-password").val() == $("#password").val()){
          confirmPasswordComplete = true;
          hasSuccess("#confirm-password-group","#confirm-password-span");
        }
        else{
          confirmPasswordComplete = false;
          hasError("#confirm-password-group","#confirm-password-span");
        }
      }
    }
    else{
      passwordComplete = false;
      hasError("#password-group","#password-span");
    }
    checkForm();
  });

  $("#confirm-password").keyup(function(){
    if($("#confirm-password").val() != "" && $("#confirm-password").val() == $("#password").val()){
      confirmPasswordComplete = true;
      hasSuccess("#confirm-password-group","#confirm-password-span");
    }
    else{
      confirmPasswordComplete = false;
      hasError("#confirm-password-group","#confirm-password-span");
    }
    checkForm();
  });

  function checkForm(){
  if(firstNameComplete&&lastNameComplete&&emailComplete&&passwordComplete&&confirmPasswordComplete)
    $("#signup-button").removeAttr("disabled");
  else
    $("#signup-button").attr("disabled",true);
  }
  function hasSuccess(divID,spanID){
    $(divID).removeClass("has-error has-feedback");
    $(divID).addClass("has-success has-feedback");
    $(spanID).removeClass("glyphicon glyphicon-remove form-control-feedback");
    $(spanID).addClass("glyphicon glyphicon-ok form-control-feedback");
  }
  function hasError(divID,spanID){
    $(divID).removeClass("has-success has-feedback");
    $(divID).addClass("has-error has-feedback");
    $(spanID).removeClass("glyphicon glyphicon-ok form-control-feedback");
    $(spanID).addClass("glyphicon glyphicon-remove form-control-feedback");
  }

  $('#signup-button').on('click', function(){
    $(this).toggleClass('active');
    var newUser = {
      firstName: $('#first-name').val().trim(),
      lastName: $('#last-name').val().trim(),
      email: $('#email').val().trim(),
      password: $('#password').val().trim()
    }
     $.ajax({
        type: "post",
        url: window.location.href + "signup",
        dataType:"json",
        data: newUser,
        success: function (response) {
            if(response.status === "success") {
              //something
            } else if(response.status === "error") {
                // TODO: Pop up modal with error message
                console.log(response);
            }
        }
    });
    return false;
  });

  $('#login-button').on('click', function(){
    $(this).toggleClass('active');
    var login = {
      email: $('#email').val().trim(),
      password: $('#password').val().trim()
    }
     $.ajax({
        type: "post",
        url: window.location.href + "login",
        dataType:"json",
        data: login,
        success: function (response) {
            if(response.status === "success") {
              //something
            } else if(response.status === "error") {
                console.log(response);
                // TODO: Pop up modal with error message
            }
        }
    });
    return false;
  });
});
