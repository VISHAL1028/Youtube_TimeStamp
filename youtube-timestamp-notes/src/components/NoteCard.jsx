import { motion } from "framer-motion";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const NoteCard = ({ time, text, index, onSeek, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="glass-card p-4 cursor-pointer"
      onClick={() => onSeek(time)}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "4px 10px", background: "hsl(239 84% 67% / 0.1)", borderRadius: "8px"
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 600, color: "hsl(239 84% 67%)" }}>
            {formatTime(time)}
          </span>
        </motion.div>
        <p style={{ fontSize: "14px", color: "hsl(var(--foreground) / 0.8)", flex: 1 }}>{text}</p>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid hsl(var(--border) / 0.5)" }}>
        <motion.button
          onClick={(e) => { e.stopPropagation(); onEdit(index); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, background: "hsl(142 71% 45% / 0.1)", color: "hsl(142 71% 45%)", border: "none", cursor: "pointer" }}
        >
          ✏️ Edit
        </motion.button>
        <motion.button
          onClick={(e) => { e.stopPropagation(); onDelete(index); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, background: "hsl(0 72% 51% / 0.1)", color: "hsl(0 72% 51%)", border: "none", cursor: "pointer" }}
        >
          🗑 Delete
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NoteCard;

