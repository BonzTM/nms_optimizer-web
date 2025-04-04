// src/components/ShipSelection/ShipSelection.tsx
import React, { useRef } from "react";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { GearIcon } from "@radix-ui/react-icons";
import { useFetchShipTypesSuspense, useShipTypesStore } from "../../hooks/useShipTypes";
import { useGridStore } from "../../store/GridStore";

interface ShipSelectionProps {
  solving: boolean;
}

const ShipSelection: React.FC<ShipSelectionProps> = ({ solving }) => {
  const shipTypes = useFetchShipTypesSuspense();
  const selectedShipType = useShipTypesStore((state) => state.selectedShipType);
  const setSelectedShipType = useShipTypesStore((state) => state.setSelectedShipType);
  const resetGrid = useGridStore((state) => state.resetGrid);
  const previousSelectionRef = useRef<string | null>(null);

  const handleOptionSelect = (option: string) => {
    if (option !== previousSelectionRef.current) {
      setSelectedShipType(option);
      resetGrid();
    }
    previousSelectionRef.current = option;
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" disabled={solving}>
          <GearIcon className="w-6 h-6" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.RadioGroup value={selectedShipType} onValueChange={handleOptionSelect}>
          {Object.entries(shipTypes).map(([key, label]) => (
            <DropdownMenu.RadioItem key={key} value={key} className="font-bold">
              {label}
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ShipSelection;
