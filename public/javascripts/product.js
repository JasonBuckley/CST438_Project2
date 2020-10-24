// filename: product.js
// abstract: this file contains event listeners and functions tied to the product page

$(document).ready(function () {
    $("#search-product").focus();
  
    $("#back-to-top-btn").on("click", function () {
      backToTop();
    });
  
    $("#logo").on("click", function () {
      window.location.href = "/";
    });

    $(".cart-bttn").on("click", addToCart);
  
    $("#logout-opt").on("click", logout);
  
  });
  
  // functions for revealing the back to top button and implementing the page scroll
  var topButton = document.getElementById("back-to-top-btn");
  
  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };
  
  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      topButton.style.display = "block";
    } else {
      topButton.style.display = "none";
    }
  }
  
  // When the user clicks on the button, scroll to the top of the document
  function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  
  function logout() {
    $.ajax({
      type: "GET",
      url: "/users/logout",
      dataType: "json",
      success: function (status) {
        window.location.href = "/";
      },
      error: function (xhr, status, error) {
        err = eval("error: (" + xhr.responseText + ")");
        console.error(err);
      },
    });
  }

  $("#login-form").submit(function(event) {
    event.preventDefault(); 
    var post_url = $(this).attr("action"); 
    var request_method = $(this).attr("method"); 
    var form_data = $(this).serialize(); 
    
    $.ajax({
      url : post_url,
      type: request_method,
      data : form_data
    }).done(function(response) { 
      if (response.success == true) {
        window.location.href = "/";
      } else {
        $("#login-error").show();
      }
    });
  });

  $("#create-account-form").submit(function(event) {
    event.preventDefault(); 
    var post_url = $(this).attr("action"); 
    var request_method = $(this).attr("method"); 
    var form_data = $(this).serialize();
    
    $.ajax({
      url : post_url,
      type: request_method,
      data : form_data
    }).done(function(response) { 
      if (response.success) {
        window.location.href = "/";
      } else {
        $("#create-account-error").show();
      }
    });
  
  });
  
 // Methods for password validation (inspired by w3schools example)
  var password = document.getElementById("CA_password");
  var letter = document.getElementById("letter");
  var capital = document.getElementById("capital");
  var number = document.getElementById("number");
  var length = document.getElementById("length");
  var character = document.getElementById("character");
  
  // When the user clicks on the password field, show the message box
  password.onfocus = function () {
    document.getElementById("message").style.display = "block";
  }
  
  // When the user clicks outside of the password field, hide the message box
  password.onblur = function () {
    document.getElementById("message").style.display = "none";
  }
  
  // When the user starts to type something inside the password field
  password.onkeyup = function () {
    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if (password.value.match(lowerCaseLetters)) {
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }
  
    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if (password.value.match(upperCaseLetters)) {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }
  
    // Validate numbers
    var numbers = /[0-9]/g;
    if (password.value.match(numbers)) {
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }
  
    // Validate special characters
    var specialCharacters = /[!@#$%^&*]/g;
    if (password.value.match(specialCharacters)) {
      character.classList.remove("invalid");
      character.classList.add("valid");
    } else {
      character.classList.remove("valid");
      character.classList.add("invalid");
    }
  
    // Validate length
    if (password.value.length >= 6) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
  }

  function addToCart() {
    let productId = $(".cart-bttn").attr("productId");

    $.ajax({
      url: '/cart/add',
      type: 'post',
      data: "json",
      contentType: "application/json",
      data: JSON.stringify({
        "productId": productId
      }),
      success: function (data, status) {
          console.log(data);
      },
      error: function(xhr, status, error) {
        err = eval("error: (" + xhr.responseText + ")");
        console.error(err);
      }
    });
  }