import { BookOpen, MessageSquareText, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

function MenuSection({ icon, title, links }) {
  return (
    <div className="menu-section">
      <div className="menu-title">
        {icon}
        <span>{title}</span>
      </div>

      <div className="menu-links">
        {links.map((link) => (
          <NavLink key={link.to} className="menu-link" to={link.to} end>
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">HAIBAZO BOOK REVIEW</div>

      <MenuSection
        title="Authors"
        icon={<Users size={18} />}
        links={[
          { to: "/authors", label: "List" },
          { to: "/authors/create", label: "Create" },
        ]}
      />

      <MenuSection
        title="Books"
        icon={<BookOpen size={18} />}
        links={[
          { to: "/books", label: "List" },
          { to: "/books/create", label: "Create" },
        ]}
      />

      <MenuSection
        title="Reviews"
        icon={<MessageSquareText size={18} />}
        links={[
          { to: "/reviews", label: "List" },
          { to: "/reviews/create", label: "Create" },
        ]}
      />
    </aside>
  );
}
