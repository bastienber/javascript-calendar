const tableElt = document.querySelector('tbody')
const h1Elt = document.querySelector('h1');
const leftBtn = document.querySelector('#goLeft')
const rightBtn = document.querySelector('#goRight')
let dayCount = 1;
let isCalendarInstancied = false;
let year;
let month;
let allCells;

const thisDate = new Date();
let selectedDate = thisDate;

const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

let storageArray = JSON.parse(window.localStorage.getItem('storageArray')) || [];

calendar(thisDate);

//Previous Month
leftBtn.addEventListener('click', function() {
    selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    calendar(selectedDate);
});
//Next Month
rightBtn.addEventListener('click', function() {
    selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
    calendar(selectedDate);
});

function calendar(date) {
    //emptying the calendar if necessary
    if (isCalendarInstancied === true) {
        for (let i = 0; i < tableElt.children.length; i++) {
            tableElt.children[i].innerHTML = "";
        }
    }
    isCalendarInstancied = true;

    //First day of the selected month
    const firstDayOfMonth = new Date(date);
    firstDayOfMonth.setDate(1);
    //First day of the next month
    let lastDayOfMonth = new Date(firstDayOfMonth);
    lastDayOfMonth.setDate(0)
    //Lastday of the selected month
    lastDayOfMonth = new Date(lastDayOfMonth - 1);

    //checking which day of the week the first day of the month is
    let positionCalendar = firstDayOfMonth.getDay();
    //SUNDAY
    if (positionCalendar === 0) {
        positionCalendar = 7
    }

    //displaying the month and the year
    h1Elt.innerHTML = `${monthArray[date.getMonth()]}<br>${date.getFullYear()}`;
    let skippedDays = 0;

    let lastDayReached = false;

    for (let i = 1; i <= 42; i++) {
        if (i - skippedDays > lastDayOfMonth.getDate()) {
            lastDayReached = true;
        }

        if (lastDayReached === false) {
            let cellContent = `<td>${i - skippedDays}</td>`;

            //eventually skipping days
            if (positionCalendar <= 7 && i < positionCalendar) {
                cellContent = `<td class="previous"></td>`;
                skippedDays++;
            }

            tableElt.children[Math.floor((i - 1) / 7)].innerHTML += cellContent;

            if (i >= positionCalendar) {
                positionCalendar++;
            }

        }
        else {
            tableElt.children[Math.floor((i - 1) / 7)].innerHTML += `<td class="next"></td>`
        }
    }

    //Cells of previous and next month
    const previousCells = document.querySelectorAll('.previous');
    const nextCells = document.querySelectorAll('.next');

    const lastDayOfLastMonth = new Date(firstDayOfMonth);
    lastDayOfLastMonth.setDate(0);

    let j = 0

    //Days of the previous month;
    for (let i = lastDayOfLastMonth.getDate(); i >= lastDayOfLastMonth.getDate() - previousCells.length; i--) {
        if (previousCells[previousCells.length - 1 - j]) {
            previousCells[previousCells.length - 1 - j].innerHTML = i;
        }
        j++;
    }

    //Days of the next month
    for (let i = 0; i <= nextCells.length - 1; i++) {
        nextCells[i].innerHTML = i + 1;
    }

    addingEvents();

}

function addingEvents() {
    allCells = document.querySelectorAll("td");
    const modalElt = document.querySelector("#modal")
    const modalDateElt = document.querySelector('#modal h2')
    const textareaElt = document.querySelector('textarea')
    const saveBtn = document.querySelector("#save");
    const hideBtn = document.querySelector("#hide");

    year = parseInt(h1Elt.innerHTML.substring(h1Elt.innerHTML.length - 4));
    month = monthArray.indexOf(h1Elt.innerHTML.slice(0, -8));;
    let day;

    //selecting a day
    for (let i = 0; i < allCells.length; i++) {
        if (!allCells[i].classList.contains("next") && !allCells[i].classList.contains("previous")) {

            allCells[i].addEventListener('click', function(event) {
                modalElt.classList.remove("hidden");
                day = parseInt(event.target.innerHTML);
                modalDateElt.innerHTML = ` 
                ${day} ${monthArray[month]} ${year}
                `
                const matchingDay = storageArray.find(function(event) {
                    return event.day === day && event.month === month && event.year === year;
                });

                if (matchingDay) {
                    textareaElt.value = matchingDay.event;
                }
                else {
                    textareaElt.value = "";
                }

            })
        }
    }

    //hiding modal
    hideBtn.addEventListener('click', function() {
        modalElt.classList.add("hidden");
        textareaElt.value = ""
    });

    //saving in localstorage
    saveBtn.addEventListener('click', function() {
        if (textareaElt.value !== "") {
            storageArray.push({
                day: day,
                month: month,
                year: year,
                event: textareaElt.value
            })
        }
        window.localStorage.setItem("storageArray", JSON.stringify(storageArray));
        checkEvent();
    });


    checkEvent();

}

//Checking if events have to be show
function checkEvent() {
    for (event of storageArray) {
        if (event.month == month && event.year == year) {

            for (let i = 0; i < allCells.length; i++) {
                if (!allCells[i].classList.contains("next") && !allCells[i].classList.contains("previous")) {

                    if (allCells[i].innerHTML == event.day) {
                        allCells[i].classList.add("eventHere");
                    }
                }
            }
        }
    }
}


/*function getDateInfo(date) {
    return [date.getDate(), date.getMonth(), date.getFullYear(), date.getDay()]
}
*/
