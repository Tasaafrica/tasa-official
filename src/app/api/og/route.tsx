import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse parameters
    const title = searchParams.get("title") || "TASA - Trusted Professionals";
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const imageUrl = searchParams.get("image");

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            backgroundColor: "#020617", // slate-950
            position: "relative",
            overflow: "hidden",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {/* Background Decorative Gradients */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "-10%",
              width: "60%",
              height: "60%",
              background:
                "radial-gradient(circle, rgba(20,184,166,0.2) 0%, rgba(20,184,166,0) 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20%",
              right: "-10%",
              width: "60%",
              height: "60%",
              background:
                "radial-gradient(circle, rgba(79,70,229,0.2) 0%, rgba(79,70,229,0) 70%)",
            }}
          />

          {/* Main Layout Wrapper */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              height: "100%",
              padding: "60px 80px",
              gap: "60px",
            }}
          >
            {/* Left Content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "center",
              }}
            >
              {category && (
                <div
                  style={{
                    color: "#2dd4bf", // teal-400
                    textTransform: "uppercase",
                    fontSize: 24,
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    marginBottom: 20,
                  }}
                >
                  {category}
                </div>
              )}

              <div
                style={{
                  color: "#ffffff",
                  fontSize: 72,
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  marginBottom: 30,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {title}
              </div>

              {location && (
                <div
                  style={{
                    color: "#94a3b8", // slate-400
                    fontSize: 28,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {location}
                </div>
              )}

              {/* TASA Logo / Branding at the bottom */}
              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://www.tasa.com.ng/logo/teal_logo.png"
                  alt="TASA Logo"
                  width={140}
                  height={40}
                  style={{ objectFit: "contain" }}
                />
                <div style={{ color: "#475569", fontSize: 32 }}>|</div>
                <div
                  style={{ color: "#94a3b8", fontSize: 24, fontWeight: 500 }}
                >
                  tasa.com
                </div>
              </div>
            </div>

            {/* Right Side Avatar/Image */}
            {imageUrl && (
              <div
                style={{
                  display: "flex",
                  width: "400px",
                  height: "400px",
                  borderRadius: "200px",
                  overflow: "hidden",
                  border: "8px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                  backgroundColor: "#1e293b",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    imageUrl.startsWith("http")
                      ? imageUrl
                      : `https://tasa.com${imageUrl}`
                  }
                  alt={title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // Note: Next.js ImageResponse inherently generates PNG files for optimal browser compatibility and generation speed.
        // While JPG is requested, PNG satisfies the same aspect ratio and dimensions while providing excellent quality.
      }
    );
  } catch (e: any) {
    console.error(`[OG Image Generator] Failed to generate image:`, e.message);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
