interface CardGridProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default async function CardGrid({
  title,
  actions,
  children,
}: CardGridProps) {
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="flex w-full max-w-4xl flex-col gap-8">
        <div className="flex items-center">
          <div className="mx-4 text-xl font-medium">{title}</div>
          {actions && <div className="ml-auto flex gap-4">{actions}</div>}
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1fr]">
          {children}
        </div>
      </div>
    </div>
  );
}
