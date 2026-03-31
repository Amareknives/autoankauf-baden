import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import * as React from "react";

const tabsVariants = cva("flex items-center space-x-1 rounded-lg p-1 bg-slate-100", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const tabItemVariants = cva("rounded-md px-3 py-2 font-medium transition-colors", {
  variants: {
    active: {
      true: "bg-white text-primary shadow-sm",
      false: "text-slate-600 hover:bg-white hover:text-slate-900",
    },
  },
});

interface TabsProps {
  tabs: Array<{ key: string; label: string; content: React.ReactNode }>;
  defaultTab?: string;
  size?: VariantProps<typeof tabsVariants>["size"];
}

export function Tabs({ tabs, defaultTab, size = "md" }: TabsProps) {
  const [activeKey, setActiveKey] = React.useState(defaultTab ?? tabs[0]?.key);

  const activeTab = tabs.find((tab) => tab.key === activeKey);

  return (
    <div>
      <div className={cn(tabsVariants({ size }))}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={cn(tabItemVariants({ active: tab.key === activeKey }))}
            onClick={() => setActiveKey(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{activeTab?.content}</div>
    </div>
  );
}
