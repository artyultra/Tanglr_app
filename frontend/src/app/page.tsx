// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center text-sm lg:flex flex-col">
        <h1 className="mb-8 text-4xl font-bold">Welcome to Tanglr</h1>

        <div className="mb-8 text-center">
          <p className="mb-4">
            Your centralized platform for collaboration and communication
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link
              href="/login"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-md border border-blue-500 px-4 py-2 text-blue-500 hover:bg-blue-50 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Seamless Collaboration"
            description="Work together with your team efficiently and effectively."
          />
          <FeatureCard
            title="Secure Communication"
            description="Keep your conversations and data secure with our encrypted platform."
          />
          <FeatureCard
            title="Intuitive Interface"
            description="Easy to navigate and use interface for all your needs."
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border p-6 hover:shadow-md transition-shadow">
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
