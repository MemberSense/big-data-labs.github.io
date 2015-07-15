// Simple JavaScript Templating
  // John Resig - http://ejohn.org/ - MIT Licensed
  (function () {
    var cache = {};
    this.tmpl = function tmpl(str, data) {
      // Figure out if we're getting a template, or if we need to
      // load the template - and be sure to cache the result.
      var fn = !/\W/.test(str) ?
          cache[str] = cache[str] ||
          tmpl(document.getElementById(str).innerHTML) :
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
            // Convert the template into pure JavaScript
              str
                  .replace(/[\r\t\n]/g, " ")
                  .split("<%").join("\t")
                  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                  .replace(/\t=(.*?)%>/g, "',$1,'")
                  .split("\t").join("');")
                  .split("%>").join("p.push('")
                  .split("\r").join("\\'") + "');}return p.join('');");
      // Provide some basic currying to the user
      return data ? fn(data) : fn;
    };
  })();
  var grid;
  var data = [];
  var columns = [
    {id: "contact-card", name: "Contacts", formatter: renderCell, width: 500, cssClass: "contact-card-cell"}
  ];
  var options = {
    rowHeight: 140,
    editable: false,
    enableAddRow: false,
    enableCellNavigation: false,
    enableColumnReorder: false
  };
  var compiled_template = tmpl("cell_template");
  function renderCell(row, cell, value, columnDef, dataContext) {
    return compiled_template(dataContext);
  }
  $(function () {
    for (var i = 0; i < 100; i++) {
      var d = (data[i] = {});
      d["name"] = "User " + i;
      d["email"] = "test.user@nospam.org";
      d["title"] = "Regional sales manager";
      d["phone"] = "206-000-0000";
    }
    grid = new Slick.Grid("#myGrid", data, columns, options);
  })