define("utils", function () {

  var months = [
    "January",
    "Februrary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  function formatDate(string) {
    var date = new Date(string);
    return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
  }

  return {
    formatDate: formatDate
  };

});
