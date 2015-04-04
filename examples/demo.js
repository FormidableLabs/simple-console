/*adapter-start*/if (typeof SimpleConsole === "undefined") {
  /*global SimpleConsole:true*/
  SimpleConsole = require("../simple-console");
}/*adapter-end*/

var con = new SimpleConsole();
con.log("Hello World!");
con.info("An information message!");
con.warn("A warning");
con.error("An error string");
con.error(new Error("An error object"));

/*adapter-start*/if (typeof phantom !== "undefined") {
  /*global phantom*/
  phantom.exit();
}/*adapter-end*/
