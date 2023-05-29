'use client';
import { Container } from "@/components/container";
import { LoginForm } from "@/components/forms/login";

export default function Home() {
  return (
    <main>
      <Container>
        <LoginForm />
      </Container>
      <p className="text-center">
          &copy; PPDB SMAN 3 PALU
      </p>
    </main>
  )
}
