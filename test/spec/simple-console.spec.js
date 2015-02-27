describe("simple-console", function () {
  describe("invocations", function () {
    var con;

    beforeEach(function () {
      con = new SimpleConsole();
    });

    // Just do a lot of invocations and see if anything dies.
    // This _will_ clog the output, so do them last...
    it("should invoke lots of functions", function () {
      con.log("log");
      con.log.apply(con, ["log apply"]);
      con.log.call(con, "log call");
      con.warn("warn");
      con.warn.apply(con, ["warn apply"]);
      con.warn.call(con, "warn call");
      con.error("warn");
      con.error.apply(con, ["warn apply"]);
      con.error.call(con, "warn call");
    });
  });
});
