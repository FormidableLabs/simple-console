/*node-start*/if (typeof window === "undefined") {
  /*global SimpleConsole:true*/
  SimpleConsole = require("../simple-console");
}/*node-end*/

var con = new SimpleConsole();
con.log("Hello World!");
con.info("An information message!");
con.warn("A warning");
con.error("An error string");
con.error(new Error("An error object"));
