// src/components/GridTable/GridTable.tsx
import { CounterClockwiseClockIcon, QuestionMarkCircledIcon, ResetIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import React, { useEffect, useRef, useState } from "react";
import { ApiResponse, Grid } from "../../store/useGridStore";
import GridCell from "../GridCell/GridCell";
import GridControlButtons from "../GridControlButtons/GridControlButtons";
import ShakingWrapper from "../GridShake/GridShake";
import MessageSpinner from "../MessageSpinner/MessageSpinner";

interface GridTableProps {
  grid: Grid;
  resetGrid: () => void;
  result: ApiResponse | null;
  activateRow: (rowIndex: number) => void;
  deActivateRow: (rowIndex: number) => void;
  solving: boolean;
  setShowChangeLog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInstructions: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * A table component that displays a grid of cells, where each cell can be in
 * one of three states: normal, active, or supercharged. The component also
 * renders a set of buttons to activate or deactivate entire rows at once.
 *
 * @param {Grid} grid - The grid to display
 * @param {function} activateRow - A function to activate an entire row
 * @param {function} deActivateRow - A function to deactivate an entire row
 * @param {ApiResponse | null} result - The result of an optimization calculation,
 *   or null if no calculation has been done.
 * @param {function} resetGrid - A function to reset the grid
 */
const GridTable: React.FC<GridTableProps> = ({ grid, activateRow, deActivateRow, resetGrid, solving, setShowChangeLog, setShowInstructions }) => {
  const [shaking, setShaking] = React.useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const [columnWidth, setColumnWidth] = useState("40px");

  useEffect(() => {
    const updateColumnWidth = () => {
      if (!gridRef.current) return;

      const computedStyle = window.getComputedStyle(gridRef.current);
      const gridTemplate = computedStyle.getPropertyValue("grid-template-columns").split(" ");

      const parseSize = (value: string, fallback: number) => parseFloat(value) || fallback;

      const eleventhColumn = parseSize(gridTemplate[10] ?? "40px", 40);
      const gap = parseSize(computedStyle.getPropertyValue("gap") ?? "8px", 8);

      setColumnWidth(`${eleventhColumn + gap}px`);
    };

    updateColumnWidth();
    window.addEventListener("resize", updateColumnWidth);
    return () => window.removeEventListener("resize", updateColumnWidth);
  }, []);

  // Whether there are any modules in the grid
  const hasModulesInGrid = grid.cells.flat().some((cell) => cell.module !== null);

  return (
    <>
      <ShakingWrapper shaking={shaking}>
        <MessageSpinner solving={solving} initialMessage={"OPTIMIZING!"} />
        <div ref={gridRef} className={`gridTable ${solving ? "opacity-50" : ""}`}>
          {grid.cells.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <GridCell
                  key={columnIndex}
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                  cell={{
                    label: cell.label,
                    supercharged: cell.supercharged,
                    active: cell.active,
                    image: cell.image || undefined,
                  }}
                  grid={grid}
                  setShaking={setShaking}
                />
              ))}
              <GridControlButtons
                rowIndex={rowIndex}
                activateRow={activateRow}
                deActivateRow={deActivateRow}
                hasModulesInGrid={hasModulesInGrid}
                isFirstInactiveRow={row.every((cell) => !cell.active) && rowIndex === grid.cells.findIndex((r) => r.every((cell) => !cell.active))}
                isLastActiveRow={
                  rowIndex >= grid.cells.length - 3 &&
                  row.some((cell) => cell.active) &&
                  rowIndex === grid.cells.map((r) => r.some((cell) => cell.active)).lastIndexOf(true)
                }
              />
            </React.Fragment>
          ))}
        </div>
      </ShakingWrapper>
      <div className="flex items-start gap-4 gridTable__footer__left">
        <div className="z-10 flex-1 pt-4 flex-nowrap gridTable__footer__left">
          <Button
            variant="soft"
            radius="large"
            highContrast
            className={`gridTable__button gridTable__button--instructions !mr-2 p-0 sm:!px-2`}
            onClick={() => setShowInstructions(true)}
          >
            <QuestionMarkCircledIcon />
            <span className="hidden font-light sm:inline">Instructions</span>
          </Button>
          <Button
            variant="soft"
            radius="large"
            highContrast
            className={`gridTable__button gridTable__button--changelog sm:!px-2`}
            onClick={() => setShowChangeLog(true)}
          >
            <CounterClockwiseClockIcon />
            <span className="hidden font-light sm:inline">Change Log</span>
          </Button>
        </div>
        <div className="z-10 pt-4 gridTable__footer__right" style={{ paddingRight: columnWidth }}>
          <Button className={`gridTable__button gridTable__button--reset`} variant="solid" onClick={resetGrid} disabled={solving}>
            <ResetIcon />
            <span className="font-bold">Reset Grid</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default GridTable;
