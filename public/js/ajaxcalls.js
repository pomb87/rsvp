/******************browser back functionality****************/
function pushState(state) {
    window.history.pushState(state, null, "");
}
window.onpopstate = function (event) {
    if (event.state) {
        state = event.state;
    }
    if (jQuery.isEmptyObject({ state }) || "start" === state || "/rsvpEnd" === state || "/rsvpDecline" === state) {
        loadStart("false");
    } else {
        ajaxPost(state, createJsonObj(), "#oval", "false");
    }
};
/********** ajax get requests (start layout on page load) *************/
$(document).ready(function () {
    loadStart("true");
});

function loadStart(push) {
    $.ajax({
        url: "/start", success: function (result) {
            $("#mainDiv").html(result);
        }
    });
    if ("true" === push) {
        pushState("start");
    }
}

function loadIntro() {
    $.ajax({
        url: "/intro", success: function (result) {
            $("#oval").html(result);
            // $("#oval").hide().html(result).fadeIn('medium');
        }
    });
}

/****************** ajax post requests ******************/
$(document).ready(function () {
    $('body').on('click', '#label-toggle', function () {
        loadIntro();
        $('#flicker').addClass("stop-anim");
        $('#imageLeft').one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
            function (event) {
                $("#front").empty();
            });
    });

      $('body').on('click', '#forwardToRsvpName', function () {
        // Prevent the form from submitting via the browser.
        event.preventDefault();
        ajaxPost("/rsvpName", createJsonObj(), "#oval", "true");
    });

    $('body').on('click', '#forwardToRsvpConfirm', function () {
        // validate name not null
        var name = $("#name").val();
        if (!$("#name").val()) {
            $("#name").addClass('warning');
        } else {
            // Prevent the form from submitting via the browser.
            event.preventDefault();
            ajaxPost("/rsvpConfirm", createJsonObj(), "#oval", "true");
        }
    });

    $('body').on('click', '#forwardToRsvpPerson', function () {
        // Prevent the form from submitting via the browser.
        event.preventDefault();
        ajaxPost("/rsvpPerson", createJsonObj(), "#oval", "true");
    });

    $('body').on('click', '#forwardToRsvpDinner', function () {
        // Prevent the form from submitting via the browser.
        event.preventDefault();
        ajaxPost("/rsvpPerson", createJsonObj("dinner"), "#oval", "true");
    });

    $('body').on('click', '#forwardToRsvpWedding', function () {
        // Prevent the form from submitting via the browser.
        event.preventDefault();
        ajaxPost("/rsvpPerson", createJsonObj("wedding"), "#oval", "true");
    });

    $('body').on('click', '#forwardToRsvpAddress', function () {
        // Prevent the form from submitting via the browser.
        event.preventDefault();
        ajaxPost("/rsvpAddress", createJsonObjPerson("true"), "#oval", "true");
    });

    $('body').on('click', '#forwardToRsvpAddressNo', function () {
        // Prevent the form from submitting via the browser.
        event.preventDefault();
        ajaxPost("/rsvpAddress", createJsonObjPerson("false"), "#oval", "true");
    });

    $('body').on('click', '#forwardToRsvpEnd', function () {
        // Prevent the form from submitting via the browser.
        event.preventDefault();
        ajaxPost("/rsvpEnd", createJsonObj(), "#mainDiv", "true");
    });

    $('body').on('click', '#forwardToRsvpDecline', function () {
        // Prevent the form from submitting via the browser.
        event.preventDefault();
        ajaxPost("/rsvpDecline", createJsonObj(), "#mainDiv", "true");
    });

    $('body').on('submit', '#formRsvpPerson', function () {
        // Prevent the form from submitting via the browser.
        event.preventDefault();
        ajaxPost("/rsvpAddress", createJsonObj(), "#oval", "true");
    });
})


/****************** helper funcions *************************/
function ajaxPost(url, jsonObj, div, pushstate) {
    if ("true" === pushstate) {
        pushState(url);
    }
    // DO POST
    $.ajax({
        type: "POST",
        dataType: "html",
        contentType: "application/json",
        data: JSON.stringify(jsonObj),
        url: url,
    })
        .done(function (response) {
            console.log("Response of update: ", response)
            $(div).html(response);
            animIn(div, response);
        })
        .fail(function (xhr, textStatus, errorThrown) {
            console.log("ERROR: ", xhr.responseText)
            return xhr.responseText;
        });
}

function animIn(div, response) {
    $(div).html(response).hide().fadeIn("medium");
}

function animOut(div) {
    $(div).fadeOut(3000);
}

function createJsonObj(confirm) {
    var name = $("#name").val();
    var confirmation = $("#confirmation").val();
    var personCount = $("#personCount").val();
    var childCount = $("#childCount").val();
    var address1 = $("#address1").val();
    var address2 = $("#address2").val();

    if (confirm) {
        confirmation = confirm;
    }

    var jsonObj = {
        'name': name,
        'confirmation': confirmation,
        'personCount': personCount,
        'childCount': childCount,
        'address1': address1,
        'address2': address2
    };
    return jsonObj;
}

function createJsonObjPerson(persons) {
    var name = $("#name").val();
    var confirmation = $("#confirmation").val();

    var personCount = getPersonAmount(persons);
    var childCount = getChildAmount(persons);

    var address1 = $("#address1").val();
    var address2 = $("#address2").val();

    var jsonObj = {
        'name': name,
        'confirmation': confirmation,
        'personCount': personCount,
        'childCount': childCount,
        'address1': address1,
        'address2': address2
    };
    return jsonObj;
}

function getPersonAmount(persons) {
    var personCount = "0";
    if (persons === "true") {
        var person0 = $("#personLbl0") != null && $("#personLbl0").hasClass("active");
        var person1 = $("#personLbl1") != null && $("#personLbl1").hasClass("active");
        var person2 = $("#personLbl2") != null && $("#personLbl2").hasClass("active");
        var person3 = $("#personLbl3") != null && $("#personLbl3").hasClass("active");
        if (person0 === true) {
            personCount = "0";
        } else if (person1 === true) {
            personCount = "1";
        } else if (person2 === true) {
            personCount = "2";
        } else if (person3 === true) {
            personCount = "3";
        }
    }
    return personCount;
}

function getChildAmount(persons) {
    var personCount = "0";
    if (persons === "true") {
        var person0 = $("#childLbl0") != null && $("#childLbl0").hasClass("active");
        var person1 = $("#childLbl1") != null && $("#childLbl1").hasClass("active");
        var person2 = $("#childLbl2") != null && $("#childLbl2").hasClass("active");
        var person3 = $("#childLbl3") != null && $("#childLbl3").hasClass("active");
        if (person0 === true) {
            personCount = "0";
        } else if (person1 === true) {
            personCount = "1";
        } else if (person2 === true) {
            personCount = "2";
        } else if (person3 === true) {
            personCount = "3";
        }
    }
    return personCount;
}