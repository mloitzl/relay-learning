/**
 * @generated SignedSource<<28f307004b02df1d5f28487514b06525>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type PostListQuery$variables = Record<PropertyKey, never>;
export type PostListQuery$data = {
  readonly posts: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly title: string;
      };
    }>;
  };
};
export type PostListQuery = {
  response: PostListQuery$data;
  variables: PostListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "first",
        "value": 10
      }
    ],
    "concreteType": "PostConnection",
    "kind": "LinkedField",
    "name": "posts",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "PostEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Post",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "title",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "posts(first:10)"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PostListQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PostListQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "fd32732dcebb3c95e091aa4807cf7c66",
    "id": null,
    "metadata": {},
    "name": "PostListQuery",
    "operationKind": "query",
    "text": "query PostListQuery {\n  posts(first: 10) {\n    edges {\n      node {\n        id\n        title\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e6ffba665f11791b769f81e2c76e8ed4";

export default node;
