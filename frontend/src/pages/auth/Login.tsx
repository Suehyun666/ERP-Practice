import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { login as loginApi } from '../../api/auth.api.ts';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginApi({ username, password });
      login(user);
      navigate('/', { replace: true });
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
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
          <p className="text-slate-400 text-sm mt-2">로그인하여 계속하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-800 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-slate-300">아이디</label>
            <input
              className={INPUT}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-300">비밀번호</label>
            <input
              type="password"
              className={INPUT}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-medium py-2 rounded-md text-sm transition-colors"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <p className="text-center text-sm text-slate-400">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 transition-colors">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
