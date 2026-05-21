"use client"
export default function StoreLocationsPage() {
  const stores = [
    { name: "New York Flagship", address: "123 Beauty Street, New York, NY 10001", phone: "(212) 555-0199", hours: "Mon-Sat 9AM-8PM, Sun 10AM-6PM" },
    { name: "Los Angeles", address: "456 Glamour Ave, Los Angeles, CA 90001", phone: "(310) 555-0198", hours: "Mon-Sat 10AM-9PM, Sun 11AM-7PM" },
    { name: "Miami", address: "789 Coral Way, Miami, FL 33101", phone: "(305) 555-0197", hours: "Mon-Sat 9AM-9PM, Sun 11AM-6PM" },
  ]
  return (
    <div style={{ padding: "150px 0 60px" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontFamily: "Elsie, serif", fontSize: 36, textAlign: "center", marginBottom: 40 }}>Store Locations</h1>
        {stores.map((store, i) => (
          <div key={i} style={{ padding: 24, border: "1px solid #eee", borderRadius: 8, marginBottom: 16 }}>
            <h3 style={{ marginBottom: 8 }}>{store.name}</h3>
            <p style={{ color: "#666", marginBottom: 4 }}>{store.address}</p>
            <p style={{ color: "#666", marginBottom: 4 }}>Phone: {store.phone}</p>
            <p style={{ color: "#666" }}>Hours: {store.hours}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
