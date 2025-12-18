import LandingPage from "@/components/LandingPage";
import AuthRedirect from "@/components/AuthRedirect";

export default function Home() {
  return (
    <AuthRedirect>
      <LandingPage />
    </AuthRedirect>
  );
}
