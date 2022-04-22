const expect = require("chai").expect;
const sinon = require("sinon");
const lib = require("../stockx-scraper");
const got = require("got");

describe("scrapers/stockx-scraper.js", function () {
  describe("getProductsAndInfo", function () {
    describe("return 'Product Not Found'", function () {
      let sku = "testSku",
        err,
        data;

      this.beforeAll(async function () {
        sinon.stub(got, "post").callsFake(() => ({
          body: JSON.stringify({
            hits: [
              {
                style_id: "zz" + sku,
              },
            ],
          }),
        }));

        await lib.getProductsAndInfo(sku, function (r, d) {
          err = r;
          data = d;
        });
      });

      it("error should be 'Product Not Found'", () => {
        expect(err.message).equals("Product Not Found");
      });
    });
  });
});
