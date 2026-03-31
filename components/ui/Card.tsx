import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, description, children, className }) => {
  return (
    <div className={cn("rounded-lg border border-input bg-white p-6 shadow-sm", className)}>
      {title && <h3 className="mb-2 text-lg font-semibold">{title}</h3>}
      {description && <p className="mb-4 text-sm text-slate-600">{description}</p>}
      {children}
    </div>
  );
};

export { Card };