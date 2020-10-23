// filename: home.js
// abstract: this file contains event listeners and functions tied to the landing page

$(document).ready(function () {
  $("#search-product").focus();

  populateProducts();

  document.querySelectorAll("[id^='slider-img-']")
    .forEach(function(el) {
      el.onclick = function() {
        console.log(this.id)
        let productId = $(`#${this.id}`).attr("productId");
        console.log(productId);
        viewProduct(productId);
      }
    })
    
  document.querySelectorAll("[id^='featured-img-']")
  .forEach(function(el) {
    el.onclick = function() {
      console.log(this.id)
      let productId = $(`#${this.id}`).attr("productId");
      console.log(productId);
      viewProduct(productId);
    }
  })

  document.querySelectorAll("[id^='featured-img-quick-']")
  .forEach(function(el) {
    el.onclick = function() {
      console.log(this.id)
      let productId = $(`#${this.id}`).attr("productId");
      console.log(productId);
      viewProduct(productId);
    }
  })

  $("#back-to-top-btn").on("click", function () {
    backToTop();
  });

  $("#logo").on("click", function () {
    window.location.href = "/";
  });


  $("#logout-opt").on("click", logout);
});

// functions for opening and closing the side menu for product categories
function openMenu() {
  document.getElementById("side-menu").style.display = "block";
  document.getElementById("menu-btn").style.display = "none";
  document.getElementById("close-btn").style.display = "block";
}

function closeMenu() {
  document.getElementById("side-menu").style.display = "none";
  document.getElementById("menu-btn").style.display = "block";
  document.getElementById("close-btn").style.display = "none";
}

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

function viewProduct(productId) {
  window.location.href = `/product/${productId}`;
}

function populateProducts() {
  $.ajax({
    type: "GET",
    url: "/product",
    dataType: "json",
    success: function(result, status) {
        console.log("got logout status back", result);
        let products = result.products;
        console.log("Products: ", products);
        
        for (let i = 0; i < 4; i++) {
          let productId = products[i].productId;
          let img = products[i].imgId ? "https://drive.google.com/uc?export=download&id=" + products[i].imgId : "./images/Empty.png";

          $(`#slider-img-${i+1}`).attr({"src": img, "productId": productId});
          $(`#featured-img-${i+1}`).attr({"src": img, height: "200", width: "200", "productId": productId});
          $(`#feat-prod-name-${i+1}`).html(`${products[i].name}`);
          $(`#feat-prod-price-${i+1}`).html(`$${products[i].cost}`);
          $(`#featured-img-quick-${i+1}`).attr({"productId": productId});
        }
    },
    error: function(xhr, status, error) {
        err = eval("error: (" + xhr.responseText + ")");
        console.error(err);
    }
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