
import { char2Number } from "./char2Number";

export const cellIdtoMatrixIndices = (cellId: string) => {
  console.log("coverting id to pages, cols, rows",cellId);
  const columnLetters = cellId.match(/[A-Z]+/)![0];
  console.log("coverting id cellid is"+columnLetters);
  const columnNumber = char2Number(columnLetters);

  const rowNumber = parseInt(cellId.match(/[0-9]+/)![0]) ;
  console.log("column number"+columnNumber+"row number"+rowNumber);
  return {
    column: columnNumber,
    row: rowNumber,
  };
};