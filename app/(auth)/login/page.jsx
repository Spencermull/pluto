import NavBar from "@/components/NavBar";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <main className="p-8 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
