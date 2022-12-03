$(document).ready(function () {
    var now = dayjs().format('MMMM, D, YYYY, h:mm:ss');
    $("#currentDay").text(now);
});