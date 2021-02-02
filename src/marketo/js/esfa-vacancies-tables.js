$(function () {

  var tables = $('#Main_Text_1 table');

  tables.each(function () {
    var i, table,
        firstRow,
        columnNames = []

    table = $(this);
    table.addClass('das-table--responsive');

    firstRow = table.find('tr').eq(0)
    firstRow.addClass('das-table__first-row');

    firstRow.find('td').each(function () {
      columnNames.push($(this).text().trim())
    });

    for (i = 0; i < columnNames.length; ++i) {
      table.find('td:nth-child(' + (i+1) + ')').attr('data-label', columnNames[i])
    }

    table.find('td:nth-child(3)').each(function () {
      var jobdesc = $(this).text().trim();
      $(this).text(findUrls(jobdesc))
    })

  });

});

var findUrls = function (jobdesc) {
  return jobdesc
}