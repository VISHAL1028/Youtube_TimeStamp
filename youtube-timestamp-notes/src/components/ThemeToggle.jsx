import { motion } from "framer-motion";

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: 44, height: 44, borderRadius: 12,
        background: "hsl(var(--secondary))",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden"
      }}
    >
      <motion.span
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0 : 1 }}
        style={{ position: "absolute", fontSize: 20 }}
      >☀️</motion.span>
      <motion.span
        animate={{ rotate: isDark ? 0 : -180, scale: isDark ? 1 : 0 }}
        style={{ position: "absolute", fontSize: 20 }}
      >🌙</motion.span>
    </motion.button>
  );
};

export default ThemeToggle;
