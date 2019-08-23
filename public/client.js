$(document).ready(() => {
  startTime();

  createCalendar('http://localhost:3000/prov');
  createCalendar('http://localhost:3000/uppgifter');

  $('.table').fadeIn(1000).removeClass('hidden');

  $('.form-control-lg').keypress(e => {
    if (e.which == 13) {
      query = $('.form-control').val();
      window.location.href = "https://google.com/search?q=" + query;
    }
  });

  // Adding an event handler to the first forms
  $('.post').keypress(form => {
    if (form.which == 13) {
      var calendar = form.target.parentElement.parentElement.parentElement.className;
      var forms = form.target.parentElement.parentElement.children;

      createEvent(calendar, forms);
    }
  });

});

function createCalendar(url) {
  var tableindex = (url == 'http://localhost:3000/prov') ? 0 : 1;
  var tablebody = document.getElementsByTagName('tbody')[tableindex];

  $.ajax({
    url: url,
    type: 'GET',
    success: (events) => {
      events.forEach((event) => {
        var row = document.createElement('tr');

        var subject = document.createElement('td');
        var name = document.createElement('td');
        var day = document.createElement('td');
        var time = document.createElement('td');

        subject.innerText = event.description;
        name.innerText = event.summary;

        if (event.start.dateTime) {
          start = new Date(event.start.dateTime);
          end = new Date(event.end.dateTime);

          day.innerText = start.getFullYear() + '-' + ('0' + (start.getMonth() + 1)) + '-' + start.getDate();

          if (tableindex == 0) {
            time.innerText = start.getHours() + ':' + start.getMinutes() + ' - ' + end.getHours() + ':' + end.getMinutes();
          }
          else if (tableindex == 1) {
            time.innerText = start.getHours() + ':' + start.getMinutes();
          }

        }
        else if (event.start.date) {
          day.innerText = event.start.date;
          time.innerText = 'Ingen bestämd tid';
        }

        row.appendChild(subject);
        row.appendChild(name);
        row.appendChild(day);
        row.appendChild(time);

        tablebody.appendChild(row);
      });
    },
    error: (err) => {
      var row = document.createElement('tr');
      var message = document.createElement('td');

      message.innerHTML = (tableindex == 0) ? 'Inga prov \u{1F64F}' : 'Inga inlämmningar \u{1F973}'
      message.colSpan = 4;
      message.className = "text-center";

      row.appendChild(message);
      $(row).prependTo(tablebody);
    }
  });
}

function startTime() {
  var days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
  var months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var day = days[today.getDay()];
  var month = months[today.getMonth()];
  m = checkTime(m);
  document.getElementsByClassName('clock')[0].children[0].innerText = h + ':' + m;
  document.getElementsByClassName('clock')[0].children[1].innerText = day + ', ' + today.getDate() + ' ' + month;
  setTimeout(startTime, 1000);
}

function checkTime(i) {
  if (i < 10) {
    i = '0' + i; // add a zero in front of numbers < 10
  }
  return i;
}

function showForm(button) {
  var tablebody = button.parentElement.parentElement.parentElement;
  var row = button.parentElement.parentElement;
  $(row.firstElementChild).remove();
  $(row.children).show();

  // append a new row for adding a event
  var newrow = document.createElement('tr');

  newrow.innerHTML = (tablebody.className == "prov") ? "<td class='text-center' colspan='4'><button type='button' class='btn btn-light btn-sm' onclick='showForm(this)'>➕</button></td><td class='hidden'><input type='Text' class='form-control post' placeholder='Kurs'></td><td class='hidden'><input type='Text' class='form-control post' placeholder='Prov'></td><td class='hidden'><input type='Text' class='form-control post' placeholder='Dag'></td><td class='hidden'><input type='Text' class='form-control post' placeholder='Tid'></td>" : "<td class='text-center' colspan='4'><button type='button' class='btn btn-light btn-sm' onclick='showForm(this)'>➕</button></td><td class='hidden'><input type='Text' class='form-control post' placeholder='Kurs'></td><td class='hidden'><input type='Text' class='form-control post' placeholder='Uppgift'></td><td class='hidden'><input type='Text' class='form-control post' placeholder='Dag'></td><td class='hidden'><input type='Text' class='form-control post' placeholder='Tid'></td>"

  // Set an event handler on the newly created forms
  for (let i = 1; i < newrow.childElementCount; i++) {
    $(newrow.children[i]).keypress(form => {
      if (form.which == 13) {
        var calendar = form.target.parentElement.parentElement.parentElement.className;
        var forms = form.target.parentElement.parentElement.children;

        createEvent(calendar, forms);
      }
    });
  }

  tablebody.appendChild(newrow);
}

function createEvent(calendar, forms) {
  console.log("nu e de ba att inserta i " + calendar + " kalendern \u{1F609}");
  console.log(forms);
}