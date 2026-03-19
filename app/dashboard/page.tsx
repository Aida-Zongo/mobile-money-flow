export default function DashboardPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>Tableau de bord</h1>
            <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Vue d'ensemble de vos finances
            </p>
          </div>
          <div style={{ width: '60px', height: '60px', background: 'linear-gradient(to bottom right, #10b981, #14b8a6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>MF</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Solde Actuel</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', margin: '0' }}>125,000 FCFA</p>
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '0.25rem' }}>+12% ce mois</p>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#d1fae5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px' }}>💰</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Revenus</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', margin: '0' }}>250,000 FCFA</p>
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '0.25rem' }}>Ce mois</p>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#d1fae5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px' }}>📈</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Dépenses</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444', margin: '0' }}>125,000 FCFA</p>
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '0.25rem' }}>Ce mois</p>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#fee2e2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px' }}>📉</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 1.5rem 0' }}>Actions rapides</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button style={{ padding: '1rem', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', transition: 'background-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '20px' }}>➕</span>
                <span style={{ fontWeight: '500', color: '#374151' }}>Ajouter revenu</span>
              </div>
            </button>
            
            <button style={{ padding: '1rem', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', transition: 'background-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '20px' }}>➖</span>
                <span style={{ fontWeight: '500', color: '#374151' }}>Ajouter dépense</span>
              </div>
            </button>
            
            <button style={{ padding: '1rem', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', transition: 'background-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '20px' }}>📊</span>
                <span style={{ fontWeight: '500', color: '#374151' }}>Voir budgets</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
