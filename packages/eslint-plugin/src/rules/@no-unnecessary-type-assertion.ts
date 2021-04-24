/**
 * Modifications copyright 2020 Chengdu Mufan Technology Co., Ltd.
 *
 * Copyright 2018 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {isObjectFlagSet, isObjectType, isTypeFlagSet} from 'tsutils';
import TypeScript from 'typescript';

import {createRule, getParserServices} from './@utils';

const messages = {
  unnecessaryAssertion:
    'This assertion is unnecessary since it does not change the type of the expression.',
};

type Options = [string[]];

type MessageId = keyof typeof messages;

export const noUnnecessaryTypeAssertionRule = createRule<Options, MessageId>({
  name: 'no-unnecessary-type-assertion',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Warns if a type assertion does not change the type of an expression.',
      category: 'Best Practices',
      recommended: 'error',
    },
    messages,
    schema: [
      {
        type: 'array',
        items: {
          oneOf: [
            {
              type: 'string',
            },
          ],
        },
      },
    ],
  },
  defaultOptions: [[]],

  create(context, [options]) {
    class Walker {
      constructor(
        private sourceFile: TypeScript.SourceFile,
        private options: string[],
        private readonly checker: TypeScript.TypeChecker,
        private readonly strictNullChecks: boolean,
      ) {}

      walk(): void {
        const cb = (node: TypeScript.Node): void => {
          switch (node.kind) {
            case TypeScript.SyntaxKind.NonNullExpression:
              if (this.strictNullChecks) {
                this.checkNonNullAssertion(
                  node as TypeScript.NonNullExpression,
                );
              }

              break;
            case TypeScript.SyntaxKind.TypeAssertionExpression:
            case TypeScript.SyntaxKind.AsExpression:
              this.verifyCast(node as TypeScript.AssertionExpression);
          }

          return TypeScript.forEachChild(node, cb);
        };

        return TypeScript.forEachChild(this.sourceFile, cb);
      }

      private checkNonNullAssertion(node: TypeScript.NonNullExpression): void {
        const type = this.checker.getTypeAtLocation(node.expression);

        if (type === this.checker.getNonNullableType(type)) {
          context.report({
            node: parserServices.tsNodeToESTreeNodeMap.get(node),
            messageId: 'unnecessaryAssertion',
          });
        }
      }

      private verifyCast(node: TypeScript.AssertionExpression): void {
        if (this.options.indexOf(node.type.getText(this.sourceFile)) !== -1) {
          return;
        }

        const castType = this.checker.getTypeAtLocation(node);

        if (
          isTypeFlagSet(castType, TypeScript.TypeFlags.Literal) ||
          (isObjectType(castType) &&
            (isObjectFlagSet(castType, TypeScript.ObjectFlags.Tuple) ||
              couldBeTupleType(castType)))
        ) {
          // It's not always safe to remove a cast to a literal type or tuple
          // type, as those types are sometimes widened without the cast.
          return;
        }

        const uncastType = this.checker.getTypeAtLocation(node.expression);

        if (
          uncastType === castType &&
          this.checker.typeToString(uncastType) !== 'any'
        ) {
          context.report({
            node: parserServices.tsNodeToESTreeNodeMap.get(node),
            messageId: 'unnecessaryAssertion',
          });
        }
      }
    }

    /**
     * Sometimes tuple types don't have ObjectFlags.Tuple set, like when they're being matched against an inferred type.
     * So, in addition, check if there are integer properties 0..n and no other numeric keys
     */
    function couldBeTupleType(type: TypeScript.ObjectType): boolean {
      const properties = type.getProperties();

      if (properties.length === 0) {
        return false;
      }

      let i = 0;

      for (; i < properties.length; ++i) {
        const name = properties[i].name;

        if (String(i) !== name) {
          if (i === 0) {
            // if there are no integer properties, this is not a tuple
            return false;
          }

          break;
        }
      }

      for (; i < properties.length; ++i) {
        if (String(+properties[i].name) === properties[i].name) {
          return false; // if there are any other numeric properties, this is not a tuple
        }
      }

      return true;
    }

    const parserServices = getParserServices(context);

    let sourceFile = parserServices.esTreeNodeToTSNodeMap.get(
      context.getSourceCode().ast,
    );

    const program = parserServices.program;
    const compilerOptions = program.getCompilerOptions();
    const strictChecksEnabled = !!compilerOptions.strict;
    const strictNullChecksEnabled = compilerOptions.strictNullChecks === true;
    const strictNullChecksNotDisabled =
      compilerOptions.strictNullChecks !== false;

    new Walker(
      sourceFile,
      options,
      program.getTypeChecker(),
      strictNullChecksEnabled ||
        (strictChecksEnabled && strictNullChecksNotDisabled),
    ).walk();

    return {};
  },
});
