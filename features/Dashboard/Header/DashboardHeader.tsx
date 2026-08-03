"use client";

import Header from "@/components/Base/Header/Header";
import { Button } from "@/components/UI";

interface DashboardHeaderProps {
  onAdd?: () => void;
}

const DashboardHeader = ({ onAdd }: DashboardHeaderProps) => {
  return (
    <div>
      <Header
        header="Dashboard"
        actionButtons={
          <Button onClick={onAdd} className="rounded-lg!">
            Add Book
          </Button>
        }
      />
    </div>
  );
};

export default DashboardHeader;
