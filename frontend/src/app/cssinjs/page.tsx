"use client";

import { useState, useEffect } from "react";

export default function CatppuccinPalette() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    // Check initial theme
    const html = document.documentElement;
    setIsDarkMode(html.getAttribute("data-theme") === "dark");
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = isDarkMode ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    setIsDarkMode(!isDarkMode);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const colors = [
    { name: "Rosewater", var: "--rosewater" },
    { name: "Flamingo", var: "--flamingo" },
    { name: "Pink", var: "--pink" },
    { name: "Mauve", var: "--mauve" },
    { name: "Red", var: "--red" },
    { name: "Maroon", var: "--maroon" },
    { name: "Peach", var: "--peach" },
    { name: "Yellow", var: "--yellow" },
    { name: "Green", var: "--green" },
    { name: "Teal", var: "--teal" },
    { name: "Sky", var: "--sky" },
    { name: "Sapphire", var: "--sapphire" },
    { name: "Blue", var: "--blue" },
    { name: "Lavender", var: "--lavender" },
  ];

  const neutrals = [
    { name: "Text", var: "--text" },
    { name: "Subtext 1", var: "--subtext1" },
    { name: "Subtext 0", var: "--subtext0" },
    { name: "Overlay 2", var: "--overlay2" },
    { name: "Overlay 1", var: "--overlay1" },
    { name: "Overlay 0", var: "--overlay0" },
    { name: "Surface 2", var: "--surface2" },
    { name: "Surface 1", var: "--surface1" },
    { name: "Surface 0", var: "--surface0" },
    { name: "Base", var: "--base" },
    { name: "Mantle", var: "--mantle" },
    { name: "Crust", var: "--crust" },
  ];

  const styles = {
    container: {
      padding: "2rem",
      minHeight: "100vh",
      backgroundColor: "var(--base)",
      color: "var(--text)",
      transition: "all 0.3s ease",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "3rem",
      paddingBottom: "1rem",
      borderBottom: `2px solid var(--surface0)`,
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      background: `linear-gradient(135deg, var(--pink), var(--mauve))`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    subtitle: {
      fontSize: "1rem",
      color: "var(--subtext1)",
      marginTop: "0.5rem",
    },
    toggleButton: {
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
      backgroundColor: "var(--surface1)",
      color: "var(--text)",
      border: `2px solid var(--surface2)`,
      borderRadius: "0.5rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    section: {
      marginBottom: "3rem",
    },
    sectionTitle: {
      fontSize: "1.75rem",
      fontWeight: "600",
      marginBottom: "1.5rem",
      color: "var(--text)",
    },
    colorGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "1.5rem",
    },
    colorCard: {
      borderRadius: "0.75rem",
      overflow: "hidden",
      backgroundColor: "var(--surface0)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    colorHeader: {
      padding: "1rem",
      backgroundColor: "var(--surface1)",
      borderBottom: `1px solid var(--surface2)`,
    },
    colorName: {
      fontWeight: "bold",
      fontSize: "1.1rem",
      color: "var(--text)",
      marginBottom: "0.25rem",
    },
    colorVarName: {
      fontSize: "0.85rem",
      color: "var(--subtext0)",
      fontFamily: "monospace",
    },
    shadesContainer: {
      padding: "0.75rem",
    },
    shadeRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "0.5rem",
      borderRadius: "0.25rem",
      overflow: "hidden",
      cursor: "pointer",
      transition: "transform 0.2s ease",
    },
    shadeSwatch: {
      width: "60px",
      height: "32px",
      borderRadius: "0.25rem 0 0 0.25rem",
    },
    shadeLabel: {
      flex: 1,
      padding: "0 0.75rem",
      fontSize: "0.85rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "var(--surface1)",
      height: "32px",
    },
    shadeNumber: {
      fontWeight: "600",
      color: "var(--text)",
    },
    shadeVar: {
      fontSize: "0.75rem",
      color: "var(--subtext0)",
      fontFamily: "monospace",
    },
    copiedNotice: {
      position: "fixed" as const,
      bottom: "2rem",
      right: "2rem",
      padding: "0.75rem 1.5rem",
      backgroundColor: "var(--green)",
      color: "var(--base)",
      borderRadius: "0.5rem",
      fontWeight: "600",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      zIndex: 1000,
    },
    buttonShowcase: {
      display: "flex",
      gap: "2rem",
      flexWrap: "wrap" as const,
      marginBottom: "2rem",
    },
    buttonGroup: {
      flex: "1 1 300px",
    },
    buttonGroupTitle: {
      fontSize: "1.1rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "var(--text)",
    },
    buttonRow: {
      display: "flex",
      gap: "1rem",
      marginBottom: "1rem",
      flexWrap: "wrap" as const,
    },
    button: {
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
      border: "none",
      borderRadius: "0.5rem",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.2s ease",
      textDecoration: "none",
    },
  };

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredShade, setHoveredShade] = useState<string | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const ColorCard = ({ color }: { color: { name: string; var: string } }) => {
    const shades = [
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
    ];
    const isHovered = hoveredCard === color.var;

    return (
      <div
        style={{
          ...styles.colorCard,
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: isHovered
            ? "0 8px 12px rgba(0, 0, 0, 0.15)"
            : "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={() => setHoveredCard(color.var)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div style={styles.colorHeader}>
          <div style={styles.colorName}>{color.name}</div>
          <div style={styles.colorVarName}>{color.var}</div>
        </div>
        <div style={styles.shadesContainer}>
          {shades.map((shade) => {
            const varName =
              shade === "500" ? color.var : `${color.var}-${shade}`;
            const isShadeHovered = hoveredShade === varName;

            return (
              <div
                key={shade}
                style={{
                  ...styles.shadeRow,
                  transform: isShadeHovered
                    ? "translateX(4px)"
                    : "translateX(0)",
                }}
                onMouseEnter={() => setHoveredShade(varName)}
                onMouseLeave={() => setHoveredShade(null)}
                onClick={() => copyToClipboard(varName)}
              >
                <div
                  style={{
                    ...styles.shadeSwatch,
                    backgroundColor: `var(${varName})`,
                    border:
                      shade === "500" ? `2px solid var(--surface2)` : "none",
                  }}
                />
                <div style={styles.shadeLabel}>
                  <span style={styles.shadeNumber}>{shade}</span>
                  <span style={styles.shadeVar}>{varName}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const NeutralCard = ({ color }: { color: { name: string; var: string } }) => {
    const isHovered = hoveredCard === color.var;

    return (
      <div
        style={{
          ...styles.colorCard,
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: isHovered
            ? "0 8px 12px rgba(0, 0, 0, 0.15)"
            : "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={() => setHoveredCard(color.var)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div style={styles.colorHeader}>
          <div style={styles.colorName}>{color.name}</div>
          <div style={styles.colorVarName}>{color.var}</div>
        </div>
        <div style={styles.shadesContainer}>
          <div
            style={{
              ...styles.shadeRow,
              transform:
                hoveredShade === color.var
                  ? "translateX(4px)"
                  : "translateX(0)",
            }}
            onClick={() => copyToClipboard(color.var)}
            onMouseEnter={() => setHoveredShade(color.var)}
            onMouseLeave={() => setHoveredShade(null)}
          >
            <div
              style={{
                ...styles.shadeSwatch,
                backgroundColor: `var(${color.var})`,
                width: "100%",
                height: "60px",
                borderRadius: "0.25rem",
                border:
                  color.var === "--text" || color.var === "--crust"
                    ? `1px solid var(--surface2)`
                    : "none",
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const Button = ({
    type,
    children,
  }: {
    type:
      | "primary"
      | "secondary"
      | "tertiary"
      | "danger"
      | "success"
      | "warning";
    children: React.ReactNode;
  }) => {
    const isHovered = hoveredButton === `${type}-${children}`;

    const getButtonStyle = () => {
      const baseStyle = {
        ...styles.button,
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      };

      switch (type) {
        case "primary":
          return {
            ...baseStyle,
            backgroundColor: "var(--blue)",
            color: "var(--base)",
            boxShadow: isHovered
              ? "0 4px 12px rgba(30, 102, 245, 0.3)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
          };
        case "secondary":
          return {
            ...baseStyle,
            backgroundColor: isHovered
              ? "rgba(30, 102, 245, 0.1)"
              : "transparent",
            color: "var(--blue)",
            border: `2px solid var(--blue)`,
          };
        case "tertiary":
          return {
            ...baseStyle,
            backgroundColor: isHovered ? "var(--surface1)" : "transparent",
            color: "var(--text)",
            textDecoration: "underline",
            textDecorationColor: isHovered
              ? "var(--text)"
              : "rgba(76, 79, 105, 0.3)",
          };
        case "danger":
          return {
            ...baseStyle,
            backgroundColor: "var(--red)",
            color: "var(--base)",
            boxShadow: isHovered
              ? "0 4px 12px rgba(210, 15, 57, 0.3)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
          };
        case "success":
          return {
            ...baseStyle,
            backgroundColor: "var(--green)",
            color: "var(--base)",
            boxShadow: isHovered
              ? "0 4px 12px rgba(64, 160, 43, 0.3)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
          };
        case "warning":
          return {
            ...baseStyle,
            backgroundColor: "var(--yellow)",
            color: "var(--base)",
            boxShadow: isHovered
              ? "0 4px 12px rgba(223, 142, 29, 0.3)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
          };
        default:
          return baseStyle;
      }
    };

    return (
      <button
        style={getButtonStyle()}
        onMouseEnter={() => setHoveredButton(`${type}-${children}`)}
        onMouseLeave={() => setHoveredButton(null)}
      >
        {children}
      </button>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Catppuccin Color Palette</h1>
          <p style={styles.subtitle}>
            {isDarkMode ? "Mocha (Dark)" : "Latte (Light)"} Theme - Click any
            color to copy
          </p>
        </div>
        <button
          style={{
            ...styles.toggleButton,
            transform:
              hoveredButton === "theme-toggle"
                ? "translateY(-2px)"
                : "translateY(0)",
            backgroundColor:
              hoveredButton === "theme-toggle"
                ? "var(--surface2)"
                : "var(--surface1)",
          }}
          onMouseEnter={() => setHoveredButton("theme-toggle")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={toggleTheme}
        >
          <span style={{ fontSize: "1.25rem" }}>
            {isDarkMode ? "☀️" : "🌙"}
          </span>
          Switch to {isDarkMode ? "Light" : "Dark"} Mode
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Button Showcase</h2>
        <div style={styles.buttonShowcase}>
          <div style={styles.buttonGroup}>
            <h3 style={styles.buttonGroupTitle}>Primary Actions</h3>
            <div style={styles.buttonRow}>
              <Button type="primary">Save Changes</Button>
              <Button type="primary">Continue</Button>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <h3 style={styles.buttonGroupTitle}>Secondary Actions</h3>
            <div style={styles.buttonRow}>
              <Button type="secondary">Cancel</Button>
              <Button type="secondary">Back</Button>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <h3 style={styles.buttonGroupTitle}>Tertiary Actions</h3>
            <div style={styles.buttonRow}>
              <Button type="tertiary">Learn More</Button>
              <Button type="tertiary">Skip</Button>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <h3 style={styles.buttonGroupTitle}>Status Actions</h3>
            <div style={styles.buttonRow}>
              <Button type="danger">Delete</Button>
              <Button type="success">Confirm</Button>
              <Button type="warning">Review</Button>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Accent Colors</h2>
        <div style={styles.colorGrid}>
          {colors.map((color) => (
            <ColorCard key={color.var} color={color} />
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Neutral Colors</h2>
        <div style={styles.colorGrid}>
          {neutrals.map((color) => (
            <NeutralCard key={color.var} color={color} />
          ))}
        </div>
      </div>

      {copiedText && (
        <div style={styles.copiedNotice}>Copied: {copiedText}</div>
      )}
    </div>
  );
}

