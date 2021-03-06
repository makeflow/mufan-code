import {rules} from '../rules';

import {
  RuleTester,
  getTestFileContent,
  getTestFileFullPath,
  getTestsDirPath,
} from './@utils';

const RULE_NAME = 'empty-line-around-blocks';

const TEST_DIR_PATH = getTestsDirPath(RULE_NAME);

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: TEST_DIR_PATH,
  },
});

ruleTester.run(RULE_NAME, rules[RULE_NAME], {
  valid: [
    {
      code: getTestFileContent(TEST_DIR_PATH, 'test2.ts'),
      filename: getTestFileFullPath(TEST_DIR_PATH, 'test2.ts'),
    },
  ],
  invalid: [
    {
      code: getTestFileContent(TEST_DIR_PATH, 'test.ts'),
      filename: getTestFileFullPath(TEST_DIR_PATH, 'test.ts'),
      errors: [
        {messageId: 'emptyLineAroundStatementRequired', line: 8},
        {messageId: 'emptyLineAroundStatementRequired', line: 9},
        {messageId: 'emptyLineAroundStatementRequired', line: 10, endLine: 12},
        {messageId: 'emptyLineAroundStatementRequired', line: 14, endLine: 15},
        {messageId: 'emptyLineAroundStatementRequired', line: 16},
        {messageId: 'emptyLineAroundStatementRequired', line: 17, endLine: 18},
        {messageId: 'emptyLineAroundStatementRequired', line: 19, endLine: 20},
        {messageId: 'emptyLineAroundStatementRequired', line: 23},
        {messageId: 'emptyLineAroundStatementRequired', line: 28},
        {messageId: 'emptyLineAroundStatementRequired', line: 32},
        {messageId: 'emptyLineAroundStatementRequired', line: 37},
        {messageId: 'emptyLineAroundStatementRequired', line: 45},
        {messageId: 'emptyLineAroundStatementRequired', line: 50},
        {messageId: 'emptyLineAroundStatementRequired', line: 56, endLine: 59},
        {messageId: 'emptyLineAroundStatementRequired', line: 70},
        {messageId: 'emptyLineAroundStatementRequired', line: 75},
        {messageId: 'emptyLineAroundStatementRequired', line: 80},
        {messageId: 'emptyLineAroundStatementRequired', line: 87},
        {messageId: 'emptyLineAroundStatementRequired', line: 88, endLine: 91},
        {messageId: 'emptyLineAroundStatementRequired', line: 107},
        {
          messageId: 'emptyLineAroundStatementRequired',
          line: 126,
          endLine: 129,
        },
        {
          messageId: 'emptyLineAroundStatementRequired',
          line: 148,
          endLine: 151,
        },
        {
          messageId: 'emptyLineAroundStatementRequired',
          line: 162,
          endLine: 165,
        },
        {messageId: 'emptyLineAroundStatementRequired', line: 175},
        {
          messageId: 'emptyLineAroundStatementRequired',
          line: 186,
          endLine: 187,
        },
        {
          messageId: 'emptyLineAroundStatementRequired',
          line: 194,
          endLine: 196,
        },
        {
          messageId: 'emptyLineAroundStatementRequired',
          line: 201,
          endLine: 203,
        },
        {
          messageId: 'emptyLineAroundStatementRequired',
          line: 204,
          endLine: 206,
        },
      ],
      output: getTestFileContent(TEST_DIR_PATH, 'test.ts.fix'),
    },
  ],
});
