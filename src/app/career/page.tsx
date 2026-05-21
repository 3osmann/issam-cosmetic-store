"use client"
export default function CareerPage() {
  return (
    <div style={{ padding: "150px 0 60px" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontFamily: "Elsie, serif", fontSize: 36, marginBottom: 16 }}>Careers</h1>
        <p style={{ lineHeight: 1.8, marginBottom: 24 }}>Join our team at Beauty Cosmetic Store! We are always looking for passionate individuals to help us grow.</p>
        <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 8, marginBottom: 16 }}>
          <h3 style={{ marginBottom: 4 }}>Beauty Consultant</h3>
          <p style={{ color: "#666", marginBottom: 8 }}>Full-time · New York</p>
          <p style={{ lineHeight: 1.7 }}>Provide expert beauty advice to our customers and help them find the perfect products.</p>
        </div>
        <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 8, marginBottom: 16 }}>
          <h3 style={{ marginBottom: 4 }}>Marketing Specialist</h3>
          <p style={{ color: "#666", marginBottom: 8 }}>Full-time · Remote</p>
          <p style={{ lineHeight: 1.7 }}>Develop and execute marketing campaigns to promote our brand and products.</p>
        </div>
        <p style={{ marginTop: 24, color: "#666" }}>Send your resume to <a href="mailto:careers@beautycosmetic.com" style={{ color: "#FF5894" }}>careers@beautycosmetic.com</a></p>
      </div>
    </div>
  )
}
