import { useClock } from "@/hooks/useClock";

export default function Header() {
  const time = useClock();

  return (
    <header className="flex justify-between items-center px-8 pt-8 bg-transparent">
      <h1 className="text-primary text-5xl font-bold">BeaverPanel</h1>
      <div className="text-primary text-4xl font-bold">{time}</div>
    </header>
  );
}
