import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen">
      <h1 className="m-auto text-xl">
        <Link className="btn btn-primary btn-lg" href="/dashboard">
          MongoDB Dashboard
        </Link>
      </h1>
      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 p-16">
        <h2 className="font-bold">Proyecto de Bases de Datos II</h2>
        <ul className="list-none text-center">
          <li>Andres Goncalves</li>
          <li>Michelle Villegas</li>
          <li>Moises Liota</li>
        </ul>
      </div>
    </main>
  );
}
