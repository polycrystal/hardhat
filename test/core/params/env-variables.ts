import { assert, expect } from "chai";

import { BuidlerError, ERRORS } from "../../../src/core/errors";
import { BUIDLER_PARAM_DEFINITIONS } from "../../../src/core/params/buidler-params";
import {
  getEnvBuidlerArguments,
  paramNameToEnvVariable
} from "../../../src/core/params/env-variables";

// This is testing an internal function, which may seem weird, but its behaviour
// is 100% user facing.
describe("paramNameToEnvVariable", () => {
  it("should convert camelCase to UPPER_CASE and prepend BUIDLER_", () => {
    assert.equal(paramNameToEnvVariable("a"), "BUIDLER_A");
    assert.equal(paramNameToEnvVariable("B"), "BUIDLER_B");
    assert.equal(paramNameToEnvVariable("AC"), "BUIDLER_A_C");
    assert.equal(paramNameToEnvVariable("aC"), "BUIDLER_A_C");
    assert.equal(
      paramNameToEnvVariable("camelCaseRight"),
      "BUIDLER_CAMEL_CASE_RIGHT"
    );
    assert.equal(
      paramNameToEnvVariable("somethingAB"),
      "BUIDLER_SOMETHING_A_B"
    );
  });
});

describe("Env vars arguments parsing", () => {
  it("Should use the default values if arguments are not defined", () => {
    const args = getEnvBuidlerArguments(BUIDLER_PARAM_DEFINITIONS, {
      IRRELEVANT_ENV_VAR: "123"
    });
    assert.equal(args.help, BUIDLER_PARAM_DEFINITIONS.help.defaultValue);
    assert.equal(args.network, BUIDLER_PARAM_DEFINITIONS.network.defaultValue);
    assert.equal(args.emoji, BUIDLER_PARAM_DEFINITIONS.emoji.defaultValue);
    assert.equal(
      args.showStackTraces,
      BUIDLER_PARAM_DEFINITIONS.showStackTraces.defaultValue
    );
    assert.equal(args.version, BUIDLER_PARAM_DEFINITIONS.version.defaultValue);
  });

  it("Should accept values", () => {
    const args = getEnvBuidlerArguments(BUIDLER_PARAM_DEFINITIONS, {
      IRRELEVANT_ENV_VAR: "123",
      BUIDLER_NETWORK: "asd",
      BUIDLER_SHOW_STACK_TRACES: "true",
      BUIDLER_EMOJI: "true",
      BUIDLER_VERSION: "true",
      BUIDLER_HELP: "true"
    });

    assert.equal(args.network, "asd");

    // These are not really useful, but we test them anyway
    assert.equal(args.showStackTraces, true);
    assert.equal(args.emoji, true);
    assert.equal(args.version, true);
    assert.equal(args.help, true);
  });

  it("should throw if an invalid value is passed", () => {
    expect(() =>
      getEnvBuidlerArguments(BUIDLER_PARAM_DEFINITIONS, {
        BUIDLER_HELP: "123"
      })
    )
      .to.throw(BuidlerError)
      .with.property("number", ERRORS.ENV_VARIABLE_ARG_INVALID_VALUE.number);
  });
});
