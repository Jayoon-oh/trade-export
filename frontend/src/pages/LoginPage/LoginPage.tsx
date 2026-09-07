import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username.trim()) {
            alert('아이디를 입력해주세요.');
            return;
        }
        if (!password.trim()) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        try {
            const data = await login({ username, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.name);
            localStorage.setItem('role', data.role);
            navigate('/orders');
        } catch (error) {
            alert('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">Trade Export</h1>
                <p className="text-sm text-gray-500 mb-8 text-center">담당자 로그인</p>

                <div className="flex flex-col gap-3">
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="아이디"
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="비밀번호"
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    <button
                        onClick={handleLogin}
                        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 mt-2"
                    >
                        로그인
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;