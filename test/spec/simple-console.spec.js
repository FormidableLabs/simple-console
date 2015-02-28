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

    describe("monkey patch real console", function () {
      var _oldConsole = window.console;

      beforeEach(function () {
        window.console = new SimpleConsole();
      });

      afterEach(function () {
        window.console = _oldConsole;
      });

      it("should invoke lots of functions and maybe log", function () {
        window.console.log("log");
        window.console.log.apply(window.console, ["log apply"]);
        window.console.log.call(window.console, "log call");
        window.console.warn("warn");
        window.console.warn.apply(window.console, ["warn apply"]);
        window.console.warn.call(window.console, "warn call");
        window.console.error("error");
        window.console.error.apply(window.console, ["error apply"]);
        window.console.error.call(window.console, "error call");
      });
    });
  });
});
