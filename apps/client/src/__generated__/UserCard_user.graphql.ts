/**
 * @generated SignedSource<<9fd155071d32e75f2f49a4989dade9db>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UserCard_user$data = {
  readonly email: string;
  readonly id: string;
  readonly name: string;
  readonly " $fragmentType": "UserCard_user";
};
export type UserCard_user$key = {
  readonly " $data"?: UserCard_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"UserCard_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UserCard_user",
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
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "49f8d00dda146e42badb0ab5c1bb1c98";

export default node;
