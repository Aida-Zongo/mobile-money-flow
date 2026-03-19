export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #d1fae5, #a7f3d0, #99f6e4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', gap: '2rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ gap: '1rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(to bottom right, #10b981, #14b8a6)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>MF</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>MoneyFlow</h1>
          <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0 auto' }}>
            Gérez vos finances avec style et simplicité
          </p>
        </div>
        
        <div style={{ gap: '1rem', display: 'flex', flexDirection: 'column' }}>
          <a 
            href="/auth"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              padding: '12px 32px', 
              background: '#10b981', 
              color: 'white', 
              fontWeight: '600', 
              borderRadius: '12px', 
              textDecoration: 'none',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            Commencer
          </a>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            Ou connectez-vous à votre compte existant
          </p>
        </div>
      </div>
    </div>
  )
}
