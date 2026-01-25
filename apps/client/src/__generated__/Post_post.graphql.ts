/**
 * @generated SignedSource<<87a07647a17bb3f41c25975e5d1246ab>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Post_post$data = {
  readonly author: {
    readonly " $fragmentSpreads": FragmentRefs<"UserCard_user">;
  };
  readonly body?: string;
  readonly createdAt: string;
  readonly id: string;
  readonly title?: string;
  readonly " $fragmentType": "Post_post";
};
export type Post_post$key = {
  readonly " $data"?: Post_post$data;
  readonly " $fragmentSpreads": FragmentRefs<"Post_post">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "showDetails"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "Post_post",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "condition": "showDetails",
      "kind": "Condition",
      "passingValue": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "title",
          "storageKey": null
        }
      ]
    },
    {
      "condition": "showDetails",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "body",
          "storageKey": null
        }
      ]
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "author",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "UserCard_user"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Post",
  "abstractKey": null
};

(node as any).hash = "c978a21febe8fa05e322ee919efd1daa";

export default node;
