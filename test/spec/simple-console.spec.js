describe("simple-console", function () {
  describe("no logger", function () {
    var conStub,
      con;

    beforeEach(function () {
      // By default, returns `undefined`.
      conStub = sinon.stub(SimpleConsole.prototype, "_getConsole");
      con = new SimpleConsole();
    });

    afterEach(function () {
      conStub.restore();
    });

    it("should invoke lots of functions and not die", function () {
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

  describe("invocations", function () {
    var con;

    beforeEach(function () {
      con = new SimpleConsole();
    });

    // Just do a lot of invocations and see if anything dies.
    // This _will_ clog the output, so do them last...
    it("should invoke lots of functions and maybe log out", function () {
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
