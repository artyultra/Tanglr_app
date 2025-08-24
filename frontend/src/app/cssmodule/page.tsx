"use client";

import { useState } from "react";
import styles from "./ColorPalette.module.css";
import ColorToggleButton from "@/components/ColorToggleButton/ColorToggleButton";

export default function CssModulePage() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

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

    return (
      <div className={styles.colorCard}>
        <div className={styles.colorHeader}>
          <div className={styles.colorName}>{color.name}</div>
          <div className={styles.colorVarName}>{color.var}</div>
        </div>
        <div className={styles.shadesContainer}>
          {shades.map((shade) => {
            const varName =
              shade === "500" ? color.var : `${color.var}-${shade}`;

            return (
              <div
                key={shade}
                className={styles.shadeRow}
                onClick={() => copyToClipboard(varName)}
              >
                <div
                  className={`${styles.shadeSwatch} ${shade === "500" ? styles.shadeSwatchPrimary : ""}`}
                  style={{ backgroundColor: `var(${varName})` }}
                />
                <div className={styles.shadeLabel}>
                  <span className={styles.shadeNumber}>{shade}</span>
                  <span className={styles.shadeVar}>{varName}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const NeutralCard = ({ color }: { color: { name: string; var: string } }) => {
    return (
      <div className={styles.colorCard}>
        <div className={styles.colorHeader}>
          <div className={styles.colorName}>{color.name}</div>
          <div className={styles.colorVarName}>{color.var}</div>
        </div>
        <div className={styles.shadesContainer}>
          <div
            className={styles.shadeRow}
            onClick={() => copyToClipboard(color.var)}
          >
            <div
              className={`${styles.neutralSwatch} ${
                color.var === "--text" || color.var === "--crust"
                  ? styles.neutralSwatchBordered
                  : ""
              }`}
              style={{ backgroundColor: `var(${color.var})` }}
            />
          </div>
        </div>
      </div>
    );
  };

  type ButtonType =
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "success"
    | "warning";

  const Button = ({
    type,
    children,
  }: {
    type: ButtonType;
    children: React.ReactNode;
  }) => {
    const buttonClasses = {
      primary: styles.primaryButton,
      secondary: styles.secondaryButton,
      tertiary: styles.tertiaryButton,
      danger: styles.dangerButton,
      success: styles.successButton,
      warning: styles.warningButton,
    };

    return (
      <button className={`${styles.button} ${buttonClasses[type]}`}>
        {children}
      </button>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Catppuccin Color Palette</h1>
          <ColorToggleButton />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Button Showcase</h2>
        <div className={styles.buttonShowcase}>
          <div className={styles.buttonGroup}>
            <h3 className={styles.buttonGroupTitle}>Primary Actions</h3>
            <div className={styles.buttonRow}>
              <Button type="primary">Save Changes</Button>
              <Button type="primary">Continue</Button>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <h3 className={styles.buttonGroupTitle}>Secondary Actions</h3>
            <div className={styles.buttonRow}>
              <Button type="secondary">Cancel</Button>
              <Button type="secondary">Back</Button>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <h3 className={styles.buttonGroupTitle}>Tertiary Actions</h3>
            <div className={styles.buttonRow}>
              <Button type="tertiary">Learn More</Button>
              <Button type="tertiary">Skip</Button>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <h3 className={styles.buttonGroupTitle}>Status Actions</h3>
            <div className={styles.buttonRow}>
              <Button type="danger">Delete</Button>
              <Button type="success">Confirm</Button>
              <Button type="warning">Review</Button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Accent Colors</h2>
        <div className={styles.colorGrid}>
          {colors.map((color) => (
            <ColorCard key={color.var} color={color} />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Neutral Colors</h2>
        <div className={styles.colorGrid}>
          {neutrals.map((color) => (
            <NeutralCard key={color.var} color={color} />
          ))}
        </div>
      </div>

      {copiedText && (
        <div className={styles.copiedNotice}>Copied: {copiedText}</div>
      )}
    </div>
  );
}
