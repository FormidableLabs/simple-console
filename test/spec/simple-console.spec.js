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
      con.error("error");
      con.error.apply(con, ["error apply"]);
      con.error.call(con, "error call");
    });
  });

  // These specs will log out to console.
  // This is generally disfavored in tests, but we're _testing_ a logger
  // and want to have things blow up if anything is wrong.
  describe("actually log out", function () {
    describe("no function bind", function () {
      var bindStub,
        con;

      beforeEach(function () {
        // By default, returns `undefined`.
        bindStub = sinon.stub(SimpleConsole.prototype, "_getBind");
        con = new SimpleConsole();
      });

      afterEach(function () {
        bindStub.restore();
      });

      it("should invoke lots of functions and not die", function () {
        con.log("log");
        con.log.apply(con, ["log apply"]);
        con.log.call(con, "log call");
        con.warn("warn");
        con.warn.apply(con, ["warn apply"]);
        con.warn.call(con, "warn call");
        con.error("error");
        con.error.apply(con, ["error apply"]);
        con.error.call(con, "error call");
      });
    });

    describe("native functionality", function () {
      var con;

      beforeEach(function () {
        con = new SimpleConsole();
      });

      // Just do a lot of invocations and see if anything dies.
      // This _will_ clog the output, so do them last...
      it("should invoke lots of functions and maybe log", function () {
        con.log("log");
        con.log.apply(con, ["log apply"]);
        con.log.call(con, "log call");
        con.warn("warn");
        con.warn.apply(con, ["warn apply"]);
        con.warn.call(con, "warn call");
        con.error("error");
        con.error.apply(con, ["error apply"]);
        con.error.call(con, "error call");
      });
    });
  });
});
