/* eslint-env mocha */
import assert from "assert";
import conditionsMatch from "../lib/utils/conditionsMatch.js";

describe("conditionsMatch()", () => {
  it("ok without conditions", () => {
    assert.ok(conditionsMatch({}));
    assert.ok(conditionsMatch({}, {}));
  });

  it("ok when condition and value are values", () => {
    assert.ok(conditionsMatch({ foo: "bar", xyz: 123 }, { foo: "bar" }));
    assert.ok(!conditionsMatch({ foo: "bar", xyz: 123 }, { foo: "foo" }));
  });

  it("ok when condition is a array and data is value", () => {
    assert.ok(conditionsMatch({ foo: "bar", xyz: 123 }, { foo: ["foo", "bar"] }));
    assert.ok(!conditionsMatch({ foo: "bar", xyz: 123 }, { foo: ["foo", "plah"] }));
    assert.ok(!conditionsMatch({ foo: "bar", xyz: 123 }, { foo: [] }));
  });

  it("ok when condition is an array and data is an array", () => {
    assert.ok(conditionsMatch({ foo: ["foo", "bar"], xyz: 123 }, { foo: "foo" }));
    assert.ok(conditionsMatch({ foo: ["foo", "bar"], xyz: 123 }, { foo: "bar" }));
    assert.ok(!conditionsMatch({ foo: ["foo", "bar"], xyz: 123 }, { foo: "plah" }));
  });

  it("ok when condition and value are arrays", () => {
    assert.ok(conditionsMatch({ foo: "bar", xyz: [1, 2, 3] }, { xyz: [1, 2] }));
    assert.ok(!conditionsMatch({ foo: "bar", xyz: [1, 2, 3] }, { xyz: [1, 4] }));
    assert.ok(!conditionsMatch({ foo: "bar", xyz: [1, 2, 3] }, { xyz: [4] }));
    assert.ok(conditionsMatch({ foo: "bar", xyz: [1, 2, 3] }, { xyz: [] }));
  });

  it("fails if not all conditions are met", () => {
    assert.ok(!conditionsMatch({ foo: ["foo", "bar"], xyz: 123 }, { foo: "foo", zicke: "zacke" }));
  });
});
