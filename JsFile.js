
const start = document.getElementById("start");
const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");
const q3 = document.getElementById("q3");
const q4 = document.getElementById("q4");
const q5 = document.getElementById("q5");
const end1 = document.getElementById("end-1");
const end2 = document.getElementById("end-2");
const end3 = document.getElementById("end-3");
const end4 = document.getElementById("end-4");
const end5 = document.getElementById("end-5");

function nextPage(event) {
    let firstname = document.getElementById("firstname").value;
    switch (event) {
        case 'next1':
            start.style.display = "none";
            q1.style.display = "block";
            break;
        case 'next2':
            if (!firstname) {
                alert("Name must be filled out!");
            }
            else {
                q1.style.display = "none";
                q2.style.display = "block";
            }
            break;
        case 'next3':
            q2.style.display = "none";
            q3.style.display = "block";
            break;
        case 'next4':
            q3.style.display = "none";
            q4.style.display = "block";
            break;
        default:
            q4.style.display = "none";
            q5.style.display = "block";
            break;
    }
}

function inputPopUp(x) {
    let radio = document.getElementById("optionalInput");
    if (x == 'T') {
        radio.style.display = "block";
    }
    else {
        radio.style.display = "none";
    }
}

function finalPage() {
    let mark = document.getElementById("customRange1").value;
    let span1 = document.getElementsByClassName("span1");
    let firstname = document.getElementById("firstname").value;

    switch (mark) {
        case '1':
            q5.style.display = "none";
            span1[0].innerHTML = firstname;
            end1.style.display = "block";
            break;
        case '2':
            q5.style.display = "none";
            span1[1].innerHTML = firstname;
            end2.style.display = "block";
            break;
        case '3':
            q5.style.display = "none";
            span1[2].innerHTML = firstname;
            end3.style.display = "block";
            break;
        case '4':
            q5.style.display = "none";
            span1[3].innerHTML = firstname;
            end4.style.display = "block";
            break;
        default:
            q5.style.display = "none";
            span1[4].innerHTML = firstname;
            end5.style.display = "block";
            break;
    }
}

/* COURSES PAGE */

var allData = [];
var clickedRowId = "";

$(document).ready(function () {
    getData();

    $("#courses_table_body").on("click", 'button', function () {
        if ($(this).hasClass("btn-outline-info")) {
            viewDetails($(this));
        }
        else if ($(this).hasClass("btn-outline-primary")) {
            makeReservation($(this));
        }
    })

    $("#reservationForm").validate({
        rules: {
            reservname: {
                required: true,
                minlength: 3
            },
            reservsurname: {
                required: true,
                minlength: 3
            },
            email: "required",
            reservnote: {
                required: true,
                minlength: 10
            }
        },
        messages: {
            reservname: {
                required: "Unesite Vaše ime.",
                minlength: "Ime mora imati bar 3 karaktera."
            },
            reservsurname: {
                required: "Unesite Vaše prezime.",
                minlength: "Prezime mora imati bar 3 karaktera."
            },
            email: "Unesite validan email.",
            reservnote: {
                required: "Komentar je obavezan.",
                minlength: "Mora imati minimum 10 karaktera."
            }
        }
    });

    $("#reservations_table_body").on("click", 'button', function () {
        if ($(this).hasClass("btn-outline-success")) {
            editReservation($(this));
        }
        else if ($(this).hasClass("btn-outline-danger")) {
            deleteReservation($(this));
        }
    })

    $('#makeReservationModal').on('hidden.bs.modal', function () {
        $("#reservname").val("");
        $("#reservsurname").val("");
        $("#reservemail").val("");
        $("#reservnote").val("");
    })
});

function getData() {
    var getRequest = $.ajax({
        type: "GET",
        url: "http://localhost:3000/courses"
    });
    getRequest.done(function (podaci) {
        allData = podaci;
        fillTable(podaci);
        $("#courses_table").dataTable();
    });
    getRequest.fail(function (error) {
        alert(error.statusText);
    });
}

function fillTable(data) {
    $("#courses_table_body").empty();
    $.each(data, function (i, podatak) {
        $("#courses_table_body").append(`
            <tr>
                <td> ${podatak.course} </td>
                <td> ${podatak.startDate} </td>
                <td> ${podatak.duration} </td>
                <td> ${podatak.price}$ </td>
                <td> <button class="btn btn-outline-info" id="view_${podatak.id}">View details</button> </td>
                <td> <button class="btn btn-outline-primary" id="reserve_${podatak.id}">Make reservation</button> </td>
            <\tr>
        `);
    })
}

function deleteReservation(buttonObj) {
    let reservId = buttonObj.attr("id");
    let id = reservId.split("_")[1];
    var deleteRequest = $.ajax({
        type: "DELETE",
        url: "http://localhost:3000/reservations/" + id
    });
    deleteRequest.done(function (podaci) {
        buttonObj.parent().parent().remove();
        let tempIndex = allData.findIndex(x => x.id == id);
        if (tempIndex != -1) {
            allData.splice(tempIndex, 1);
        }
    });
    deleteRequest.fail(function (error) {
        alert(error.statusText);
    });
}

function viewDetails(buttonObj) {
    $("#viewDetailsModal").modal('toggle');
    let courseId = buttonObj.attr("id");
    let id = courseId.split("_")[1];
    clickedRowId = id;
    let tempIndex = allData.findIndex(x => x.id == id);
    if (tempIndex != -1) {
        let selectedCourse = allData[tempIndex];
        $(".modalTitle").text(selectedCourse.course);
        $("#courseDetails").text(selectedCourse.details);
    }
}

function makeReservation(buttonObj) {
    $("#makeReservationModal").modal('toggle');
    let courseId = buttonObj.attr("id");
    let id = courseId.split("_")[1];
    clickedRowId = id;
    let tempIndex = allData.findIndex(x => x.id == id);
    if (tempIndex != -1) {
        let selectedCourse = allData[tempIndex];
        $("#reservcourse").val(selectedCourse.course);
        $("#reservprice").val(selectedCourse.price);
    }
}


function editReservation(buttonObj) {
    $("#makeReservationModal").modal('toggle');
    $("#makeReservationModalLabel").text("Change reservation");
    let reservId = buttonObj.attr("id");
    let id = reservId.split("_")[1];
    clickedRowId = id;
    let tempIndex = allData.findIndex(x => x.id == id);
    if (tempIndex != -1) {
        let selectedReservation = allData[tempIndex];
        $("#reservname").val(selectedReservation.name);
        $("#reservsurname").val(selectedReservation.surname);
        $("#reservemail").val(selectedReservation.email);
        $("#reservnote").val(selectedReservation.note);
    }
}

function saveReservation() {
    let name = $("#reservname").val();
    let surname = $("#reservsurname").val();
    let email = $("#reservemail").val();
    let course = $("#reservcourse").val();
    let price = $("#reservprice").val();
    let note = $("#reservnote").val();
    var reservedCourse = {
        name: name,
        surname: surname,
        email: email,
        course: course,
        price: price,
        note: note,
    };

    let typeOfSaving = $("#makeReservationModalLabel").text();
    if (typeOfSaving == "Change reservation") {
        let editRequest = $.ajax({
            type: "PUT",
            url: "http://localhost:3000/reservations/" + clickedRowId,
            data: reservedCourse
        });
        editRequest.done(function () {
            $("#makeReservationModal").modal('toggle');
            getData();
        });
        editRequest.fail(function () {
            alert("Izmena podataka nije uspela");
        })
    }

    let addNewRequest = $.ajax({
        type: "POST",
        url: "http://localhost:3000/reservations",
        data: reservedCourse
    });
    addNewRequest.done(function (savedData) {
        $("#makeReservationModal").modal('toggle');
        $("#reservations_table_body").append(`
            <tr>
                <td> ${savedData.name} </td>
                <td> ${savedData.surname} </td>
                <td> ${savedData.email} </td>
                <td> ${savedData.course} </td>
                <td> ${savedData.price}$</td>
                <td> ${savedData.note} </td>
                <td> <button class="btn btn-outline-success" id="edit_${savedData.id}">Change Reservation</button> </td>
                <td> <button class="btn btn-outline-danger" id="delete_${savedData.id}">Delete Reservation</button> </td>
            <\tr>
        `);
    });
    addNewRequest.fail(function () {
        alert("Rezervacija nije uspela");
    })
}

function viewReservations() {
    let coursesTable = document.getElementById("coursesTable");
    let reservationsTable = document.getElementById("reservationsTable");
    coursesTable.style.display = "none";
    reservationsTable.style.display = "block";
}

function backToCourses() {
    let coursesTable = document.getElementById("coursesTable");
    let reservationsTable = document.getElementById("reservationsTable");
    reservationsTable.style.display = "none";
    coursesTable.style.display = "block";
}

// function addNewEmployee() {
//     $("#editEmployeeModal").modal('toggle');
//     $("#editEmployeeModalLabel").text("Add New Employee");
// }