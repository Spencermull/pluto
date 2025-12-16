import NavBar from "@/components/NavBar";
import RegisterForm from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <main className="p-8 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}

