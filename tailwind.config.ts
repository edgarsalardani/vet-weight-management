import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  // Efeitos de hover só valem em dispositivos com mouse. Evita "hover preso"
  // depois de um toque no celular.
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        bg: "#F7FAF8",
        surface: "#FFFFFF",
        surfaceMuted: "#EEF6F1",
        ink: {
          DEFAULT: "#18332B",
          muted: "#4F675E",
          faint: "#5E746B",
        },
        line: "#E3EBE6",
        primary: {
          DEFAULT: "#237A5A", // botões e links (5,3:1 sobre branco)
          dark: "#1B6249", // hover / pressionado
          light: "#EAF6EF", // fundos de destaque
          50: "#EAF6EF",
          100: "#D5EDE0",
          500: "#2E8B6A", // decorativo, foco e gráficos (não usar como texto)
        },
        status: {
          low: "#2A64A8",
          lowBg: "#E8F0FA",
          ideal: "#1B6F46",
          idealBg: "#E4F4EA",
          high: "#9C4A12",
          highBg: "#FBEEDF",
        },
        danger: {
          DEFAULT: "#B42318",
          bg: "#FDECEA",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-figtree)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        // Os números agora usam a mesma fonte do restante da interface.
        // O alias "mono" é mantido apenas para não quebrar classes antigas.
        mono: [
          "var(--font-figtree)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      // Escala tipográfica mais generosa (antes: xs 12, sm 14, base 16).
      // Nenhum texto da interface fica abaixo de 13 px.
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.25rem" }], // 13px
        sm: ["0.9375rem", { lineHeight: "1.4rem" }], // 15px
        base: ["1rem", { lineHeight: "1.5rem" }], // 16px
        lg: ["1.125rem", { lineHeight: "1.65rem" }], // 18px
        xl: ["1.5rem", { lineHeight: "2rem" }], // 24px
        "2xl": ["2rem", { lineHeight: "2.5rem" }], // 32px
      },
      borderRadius: {
        card: "20px", // cards e painéis
        control: "14px", // campos, botões e ícones em caixa
      },
      boxShadow: {
        soft: "0 1px 2px rgba(24, 51, 43, 0.05)",
        card: "0 1px 2px rgba(24, 51, 43, 0.04), 0 4px 16px rgba(24, 51, 43, 0.06)",
        elevated:
          "0 2px 6px rgba(24, 51, 43, 0.06), 0 12px 32px rgba(24, 51, 43, 0.12)",
        focus: "0 0 0 3px rgba(46, 139, 106, 0.28)",
      },
      maxWidth: {
        app: "1080px",
      },
      // Animações curtas e discretas. Todas são neutralizadas pela regra de
      // prefers-reduced-motion em globals.css.
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "none" },
        },
        popIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "none" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        // Sem "fill-mode": ao terminar, o elemento volta ao estilo normal (sem
        // transform residual, que prenderia elementos "fixed" dentro dele).
        "fade-in": "fadeIn 180ms ease-out",
        "pop-in": "popIn 160ms ease-out",
        shimmer: "shimmer 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
