"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginForm() {
  const router = useRouter()
  const { locale } = useLocale()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function validate() {
    if (!email || !password) {
      return locale.auth.fillAllFields
    }
    if (!emailPattern.test(email)) {
      return locale.auth.invalidEmail
    }
    if (password.length < 8) {
      return locale.auth.passwordLength
    }
    return ""
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || locale.auth.loginError);
      }

      // Login successful, save to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Báo cho các component khác (Header, Sidebar) biết trạng thái đăng nhập đã thay đổi
      window.dispatchEvent(new Event("auth-change"));

      // redirect to homepage
      router.push("/");
    } catch (error: any) {
      setError(error.message || locale.auth.loginError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-border/80 bg-card/90 p-8 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:p-10">
      <div className="mb-8 space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Xin chào!</p>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{locale.auth.loginTitle}</h1>
        <p className="text-sm text-muted-foreground">
          {locale.auth.loginDescription}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="grid gap-3 text-sm font-semibold text-foreground">
          <span className="text-muted-foreground">{locale.auth.email}</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={locale.auth.emailPlaceholder}
            className="w-full rounded-2xl border border-border bg-background/90 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </label>

        <label className="grid gap-3 text-sm font-semibold text-foreground">
          <span className="text-muted-foreground">{locale.auth.password}</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={locale.auth.passwordPlaceholder}
              className="w-full rounded-2xl border border-border bg-background/90 px-4 py-3 pr-12 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </label>

        {error ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? `${locale.auth.loginTitle}...` : locale.auth.submitLogin}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>{locale.auth.noAccount}</span>
        <a
          href="/register"
          className="font-semibold text-primary transition hover:text-primary/80"
        >
          {locale.auth.registerNow}
        </a>
      </div>
    </div>
  )
}
