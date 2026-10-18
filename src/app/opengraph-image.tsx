import { ImageResponse } from "next/og";

export const alt = "Caderno de Delícias - Seu Caderno de Receitas, sem distrações";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FED7AA 100%)",
          color: "#1C1917",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              background: "#EA580C",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
              fontWeight: 900,
            }}
          >
            🍲
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "30px", fontWeight: 800, color: "#1C1917" }}>
              Caderno de Delícias
            </span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#EA580C" }}>
              cadernodedelicias.com.br
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "960px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1.08,
              color: "#1C1917",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Seu Caderno de Receitas,</span>
            <span style={{ color: "#EA580C" }}>sem distrações.</span>
          </div>
          <div
            style={{
              fontSize: "26px",
              lineHeight: 1.4,
              color: "#57534E",
            }}
          >
            Crie suas receitas de família, organize em cadernos temáticos públicos ou privados e compartilhe com atribuição transparente.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #FDBA74",
            paddingTop: "24px",
            fontSize: "20px",
            fontWeight: 600,
            color: "#9A3412",
          }}
        >
          <span>100% Livre & Open Source</span>
          <span>Zero Anúncios Invasivos</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

