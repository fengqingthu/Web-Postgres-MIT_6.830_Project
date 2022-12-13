import { cellIdtoMatrixIndices } from "./cellId2Sheet";
import { CellValueState } from "../store/CellValueState";
import { PageIdxState } from "../store/PageIdxState";
import {useRecoilState, useRecoilValue} from "recoil";


export const getEquationExpressionFromState = (
  getState: any,
  expression: any,
  notAllowedCellsIds: string[] = []
) => {
  const filterFoundCells = notAllowedCellsIds.filter((cellId) =>
    expression.includes(cellId)
  );

  if (filterFoundCells.length) {
    return "!ERROR";
  }
  console.log("expression is",expression)
  const cellValues = [...Array.from(expression.matchAll(/[A-Z]+[0-9]+/gi))]
    .map((regrexOutput: any) => regrexOutput[0])
    .map((cellId: string) => {
      const { row, column } = cellIdtoMatrixIndices(cellId);
      const page=row/1000;
      console.log("page number is",page)
      

      let value = "";

      try {
        console.log(CellValueState(`${page}, ${row}, ${column}`))
        // const evaluatedCellValue=useRecoilValue<string>(CellValueState(`${page},${row},${column}`));
        value = getState(CellValueState(`${page}, ${row}, ${column}`)) || 0;
        console.log("value is",value)

        if (value.startsWith("=")) {
          notAllowedCellsIds.push(cellId);
          value = getEquationExpressionFromState(
            getState,
            value.slice(1),
            notAllowedCellsIds
          );
        }
      } catch {}

      return {
        cellId,
        value,
      };
    });

  const evaluatedExpression = cellValues.reduce(
    (finalExpression, cellValue) =>
      finalExpression.replaceAll(cellValue.cellId, cellValue.value.toString()),
    expression
  );

  // Evaluated expression needs to be added between brackets to avoid issues caused
  // by Mathematical operations priority 
  return `(${evaluatedExpression})`;
};