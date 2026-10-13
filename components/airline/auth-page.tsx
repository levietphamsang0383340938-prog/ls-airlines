import { AuthForm } from "./auth-form"

type AuthPageProps = {
  mode: 'login' | 'register';
  onSuccess?: () => void;
  onSwitchMode?: (mode: 'login' | 'register') => void;
}

export function AuthPage({ mode, onSuccess, onSwitchMode }: AuthPageProps) {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        {mode === 'register' ? "Đăng ký tài khoản" : "Đăng nhập tài khoản"}
      </h1>
      <AuthForm mode={mode} onSuccess={onSuccess} onSwitchMode={onSwitchMode} />
    </>
  )
}