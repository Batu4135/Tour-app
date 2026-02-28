import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2F7EA1"
        }}
      >
        <div
          style={{
            width: 330,
            height: 330,
            borderRadius: 90,
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#4A4A4A",
            fontSize: 160,
            fontWeight: 800
          }}
        >
          N
        </div>
      </div>
    ),
    { ...size }
  );
}
