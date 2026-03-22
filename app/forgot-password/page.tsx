'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        // Simulate sending email (without actual SMTP setup for now)
        setSuccess(true);
        setTimeout(() => {
            router.push('/login');
        }, 4000);
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        border: '1.5px solid #E2EAE7',
        borderRadius: 10,
        fontSize: 14,
        outline: 'none',
        backgroundColor: '#FAFBFC',
        color: '#1A1D23',
        fontFamily: 'DM Sans, sans-serif',
        boxSizing: 'border-box' as const,
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'DM Sans, sans-serif',
            backgroundColor: '#F5F7F5',
            padding: 24,
        }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: 24, padding: 32,
                    boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
                }}>
                    <h2 style={{
                        fontSize: 24, fontWeight: 800,
                        color: '#1A1D23', marginBottom: 4,
                    }}>
                        Mot de passe oublié
                    </h2>
                    <p style={{
                        color: '#8A94A6', fontSize: 14,
                        marginBottom: 24,
                    }}>
                        Entrez votre adresse email pour recevoir un lien de réinitialisation.
                    </p>

                    {success ? (
                        <div style={{
                            backgroundColor: '#F0FDF4',
                            color: '#16A34A',
                            padding: '16px',
                            borderRadius: 12, fontSize: 14,
                            marginBottom: 16,
                            textAlign: 'center',
                            fontWeight: 500
                        }}>
                            Un email de réinitialisation vous a été envoyé si l'adresse existe.<br /><br />
                            Redirection en cours...
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{
                                    display: 'block', fontSize: 13,
                                    fontWeight: 500, color: '#1A1D23',
                                    marginBottom: 6,
                                }}>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="vous@exemple.com"
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: '100%', padding: '13px',
                                    backgroundColor: '#0A7B5E',
                                    color: 'white', border: 'none',
                                    borderRadius: 50, fontSize: 15,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 14px rgba(10,123,94,0.35)',
                                    fontFamily: 'DM Sans, sans-serif',
                                }}>
                                Envoyer le lien
                            </button>
                        </form>
                    )}

                    <p style={{
                        textAlign: 'center', marginTop: 20,
                        fontSize: 14, color: '#8A94A6',
                    }}>
                        Retourner à la{' '}
                        <span
                            onClick={() => router.push('/login')}
                            style={{
                                color: '#0A7B5E', fontWeight: 600,
                                cursor: 'pointer',
                            }}>
                            connexion
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
