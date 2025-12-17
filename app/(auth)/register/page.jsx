import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RegisterForm from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar />
      <main className="p-8 relative flex-1">
        <div className="max-w-4xl mx-auto relative z-10">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

