import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <h1 className="m-auto text-xl">
        <Link className="link-primary link" href="/dashboard">
          MongoDB Dashboard
        </Link>
      </h1>
    </main>
  );
}
