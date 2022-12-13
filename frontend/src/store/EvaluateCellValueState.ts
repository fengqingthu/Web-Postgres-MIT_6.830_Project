import { selector } from "recoil";
import { memoize } from "../utils/memoize";
import { CellValueState } from "./CellValueState";
import { evaluate } from "mathjs";
import { getEquationExpressionFromState } from "../utils/getEquationExpressionFromState";

export const EvaluatedCellValueState = (cellId: string) =>
  memoize(`evaluatedCell_${cellId}`, () =>
    selector({
      key: `evaluatedCell_${cellId}`,
      get: ({ get }) => {
        console.log("trying to get value of",cellId)
        const value = get(CellValueState(cellId)) as string;
        console.log("got unparsed Value",value)

        if (value.startsWith("=")) {
          try {
            console.log("start with =",value);
            const evalutedExpression = getEquationExpressionFromState(
              get,
              value.slice(1)
            );

            if (evalutedExpression === "!ERROR") {
              return "!ERROR";
            }

            return evaluate(evalutedExpression);
          } catch {
            return value;
          }
        }

        return value;
      },
    })
  );