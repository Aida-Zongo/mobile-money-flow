export default function AuthPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #d1fae5, #a7f3d0, #99f6e4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '60px', height: '60px', background: 'linear-gradient(to bottom right, #10b981, #14b8a6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>MF</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>MoneyFlow</h2>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0' }}>
            Connectez-vous à votre compte
          </p>
        </div>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Email</label>
            <input 
              type="email" 
              placeholder="Entrez votre email"
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Mot de passe</label>
            <input 
              type="password" 
              placeholder="Entrez votre mot de passe"
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
            />
          </div>
          
          <button 
            type="submit"
            style={{ 
              width: '100%', 
              padding: '12px 24px', 
              background: '#10b981', 
              color: 'white', 
              fontWeight: '600', 
              borderRadius: '8px', 
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            Se connecter
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Pas encore de compte ? 
              <a href="/auth" style={{ color: '#10b981', textDecoration: 'none', fontWeight: '500' }}> Créer un compte</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
