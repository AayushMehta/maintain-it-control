
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  description,
  icon,
  color,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-white",
              color
            )}
          >
            {icon}
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              {title}
            </div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
};
