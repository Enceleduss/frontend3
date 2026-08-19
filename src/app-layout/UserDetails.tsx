import React from "react";
//import expr from "../../macros/expr.macro" with { type: "macro" };
import liveExpression from "../../macros/liveExpression.macro";
import { useLiveExpression } from "../utils/useLiveExpression";
const UserDetails: React.FC = () => {
  const dynamicValue = useLiveExpression(
    liveExpression(/* javascript */ `
    var a = 10;
    var b = 20;
    a + b;
    `),
    [],
  );

  return (
    <div>
      <h2>User Details Component</h2>
      <p>This is a placeholder for user details.</p>
      <p>Live Expression Value: {dynamicValue}</p>
    </div>
  );
};

export default UserDetails;
