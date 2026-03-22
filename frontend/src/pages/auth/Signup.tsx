import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { signup as signupApi } from '../../api/auth.api.ts';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '', displayName: '', email: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await signupApi(form);
      login(user);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      setError(msg ?? '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const INPUT = 'w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 text-sm outline-none focus:border-primary-500 transition-colors';

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-indigo-400 bg-clip-text text-transparent">
            ERP Practice
          </h1>
          <p className="text-slate-400 text-sm mt-2">새 계정 만들기</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-800 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-slate-300">아이디 <span className="text-slate-500">(3자 이상)</span></label>
            <input className={INPUT} value={form.username} onChange={set('username')} required minLength={3} autoComplete="username" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-300">비밀번호 <span className="text-slate-500">(4자 이상)</span></label>
            <input type="password" className={INPUT} value={form.password} onChange={set('password')} required minLength={4} autoComplete="new-password" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-300">표시 이름</label>
            <input className={INPUT} value={form.displayName} onChange={set('displayName')} required />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-300">이메일</label>
            <input type="email" className={INPUT} value={form.email} onChange={set('email')} required autoComplete="email" />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-medium py-2 rounded-md text-sm transition-colors"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>

          <p className="text-center text-sm text-slate-400">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
