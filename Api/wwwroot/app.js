﻿$(document).ready(function() {
  
  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    auth: {
        params: {
            audience: AUTH0_AUDIENCE,
            responseType: 'id_token token',
            access_type: 'offline',
            scope: 'openid read:userinfo'
        } 
    }
  });

  $('.btn-login').click(function(e) {
    e.preventDefault();
    lock.show();
  });

  $('.btn-logout').click(function(e) {
    e.preventDefault();
    logout();
  })

  lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
      if (error) {
        // Handle error
        return;
      }
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('access_token', authResult.accessToken);
      // Display user information
      show_profile_info(profile);
    });
  });

  //retrieve the profile:
  var retrieve_profile = function() {
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          return alert('There was an error getting the profile: ' + err.message);
        }
        // Display user information
        show_profile_info(profile);
      });
    }
  };

  var show_profile_info = function(profile) {
     $('.nickname').text(profile.nickname);
     $('.btn-login').hide();
     $('.avatar').attr('src', profile.picture).show();
     $('.btn-logout').show();
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    window.location.href = "/";
  };
  var access_token = localStorage.getItem('access_token');
  $('#access-token').val(access_token);

  $('#call-api').on("click", function () {

      $.ajax({
          url: "http://localhost:1496/api/values/getcurrenttime",
          type: 'GET',
          dataType: 'text',
          headers: {'authorization': 'Bearer '+access_token},
          contentType: 'application/json; charset=utf-8',
          success: function (result) {
              $("#result-from-api").html('OK! Zapytanie powiodło się, aktualny czas z serwera: ' + result);
          },
          error: function (error) {
              $("#result-from-api").html('Niepowodzenie :' + error);
          }
      });
  });

  retrieve_profile();
});
