import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "nord-pack Fahrer App",
    short_name: "nord-pack",
    description: "Digitale Rechnungs-Vordrucke direkt beim Kunden",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F9FA",
    theme_color: "#2F7EA1",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
