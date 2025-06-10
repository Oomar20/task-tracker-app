import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import api from '../lib/api';

export default function Login() {
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            setToken(response.data.access_token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-4 text-center text-black">Login</h2>
                {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
                <div className="space-y-4">
                    <div className='text-black'>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1"
                        />
                    </div>
                    <div className='text-black'>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1"
                        />
                    </div>
                    <span className='text-black'>Don't have an account? </span>
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register now
                    </Link>
                </div>
                <Button type="submit" disabled={loading} className="w-full mt-6">
                    {loading ? 'Logging in...' : 'Log In'}
                </Button>
            </form>
        </div>
    );
}
